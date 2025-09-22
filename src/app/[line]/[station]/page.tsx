import { loadArrivalsByPlatform } from '@/server/tfl'
import AutoRefreshTimer from '@/components/AutoRefreshTimer'
import DisplayBoard from '@/components/DisplayBoard'
import {BackButton} from '@/components/BackButton'
import {FavoriteButton} from '@/components/FavoriteButton'

export default async function StationPage({ params }: { params: Promise<any> }) {
    const resolvedParams = await params
    const { line, station } = resolvedParams
    const platformBoards = await loadArrivalsByPlatform(line, station)

    return (
        <>
            <AutoRefreshTimer line={line} station={station} />
            <div className="w-full sm:max-w-144">
                <div className="flex justify-between items-center mb-4">
                    <BackButton href={`${line}`}/>
                    <FavoriteButton 
                        line={line}
                        stationId={station}
                        stationName={platformBoards[0]?.stationName || station}
                        lineName={`${line.charAt(0).toUpperCase() + line.slice(1)} Line`}
                    />
                </div>
                {platformBoards.map((board, index) => (
                    <DisplayBoard
                        key={`platform-${index}`}
                        lineId={line}
                        lineName={`${line.charAt(0).toUpperCase() + line.slice(1)} Line`}
                        stationName={board.stationName}
                        platformName={board.platformName}
                        arrivals={board.arrivals}
                    />
                ))}
            </div>
        </>
    )
}
