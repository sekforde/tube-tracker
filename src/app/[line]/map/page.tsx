// import { getStations, getLine, getStationHash } from '@/lib/api'
// import { loadVehiclePositions } from '@/server/tfl'
// import { lineColors } from '@/lib/colours'
import { BackButton } from '@/components/BackButton'
import { LineMap } from '@/components/LineMap'
import { processLine } from '@/lib/sequence'

export default async function LineMapPage({ params }: { params: Promise<{ line: string }> }) {
    const { line } = await params
    const routes = await processLine(line)

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-6">
                <BackButton href={`/${line}`} />
                <LineMap 
                    line={line}
                    routes={routes}
                />
            </div>
        </div>
    )
}
