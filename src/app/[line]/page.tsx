import { getStations } from '@/lib/api'

export default async function Line({ params }: { params: Promise<{ line: string }> }) {
    const { line } = await params
    const stations = await getStations(line)
    // console.log(stations)
    return (
        <div className="block">
            {stations.map((station: any) => {
                return (
                    <div key={station.id} className="p-2">
                        <a className="" href={`/${line}/${station.stationNaptan}`}>
                            {station.commonName}
                        </a>
                    </div>
                )
            })}
        </div>
    )
}
