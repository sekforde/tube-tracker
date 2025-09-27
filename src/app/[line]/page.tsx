import { getStations } from '@/lib/api'
import {BackButton} from '@/components/BackButton'

export default async function Line({ params }: { params: Promise<{ line: string }> }) {
    const { line } = await params
    const stations = await getStations(line)
    return (
        <div className="block">
            <BackButton href={"/"}/>
            
            {/* Line Map Link */}
            {/* <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
                <a 
                    href={`/${line}/map`}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
                >
                    🗺️ View Line Map with Live Train Positions
                </a>
            </div> */}

            {/* Stations List */}
            <div className="space-y-2">
                {stations.map((station: any) => {
                    return (
                        <div key={station.id} className="p-2">
                            <a className="hover:text-blue-600" href={`/${line}/${station.stationNaptan}`}>
                                {station.commonName}
                            </a>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
