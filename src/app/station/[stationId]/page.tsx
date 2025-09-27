import { loadArrivalsByDirection } from '@/server/tfl'
import { getStationById } from '@/lib/api'
import { AutoRefreshTimer } from '@/components/AutoRefreshTimer'
import { DisplayBoard } from '@/components/DisplayBoard'
import { BackButton } from '@/components/BackButton'
import { FavoriteButton } from '@/components/FavoriteButton'

export default async function StationPage({ params }: { params: Promise<{ stationId: string }> }) {
    const resolvedParams = await params
    const { stationId } = resolvedParams

    const station = await getStationById(stationId)
    if (!station) return <></>
    const { lines } = station

    const directionBoards = (
        await Promise.all(
            lines.map(async (lineId) => {
                const boards = await loadArrivalsByDirection(lineId, stationId)
                // boards.forEach((b: any) => (b.lineId = lineId))
                return boards
            })
        )
    ).flat()

    // console.log(lines)
    // console.log(directionBoards)

    return (
        <div className="w-full sm:max-w-144  border-0 border-green-500  mx-auto pt-4">
            <AutoRefreshTimer stationId={station.id} />
            <div className="flex justify-between items-center mb-4">
                <BackButton href="/" />
                <FavoriteButton station={station} />
            </div>
            {directionBoards.map((board, index) => (
                <DisplayBoard key={`platform-${index}`} board={board} />
            ))}
        </div>
    )
}
