import { lineColors } from '@/lib/colours'
import { Clock } from '@/components/Clock'

interface ArrivalRow {
    due: string
    dest: string
    via: string
    plat: string
    status: string
}

interface DisplayBoardProps {
    lineName: string
    stationName: string
    platformName?: string
    arrivals: ArrivalRow[]
    lineId: string
}

export default function DisplayBoard({
    lineName,
    lineId,
    stationName,
    platformName,
    arrivals
}: DisplayBoardProps) {
    const color = lineColors.find((l) => l.id === lineId)?.color ?? 'gray'

    return (
        <div className="display-board w-full sm:max-w-144 sm:mx-auto">
            <div className="pb-4 flex">
                <div
                    className="px-2 flex whitespace-nowrap rounded-xl p-2 text-white font-bold justify-center items-center"
                    style={{
                        backgroundColor: color
                    }}
                >
                    {lineName}
                </div>
                <div className=""></div>
                <div className="pl-4 mb-2 my-auto">
                    <div>{stationName} - {platformName}</div>
                </div>
            </div>

            <div className="w-full">
                <table className="w-full">
                    <thead>
                        <tr className="text-left">
                            <th className="py-2 px-2">Destination</th>
                            <th className="py-2 text-right">Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrivals.map((row: ArrivalRow, rowIndex: number) => {
                            return (
                                <tr className="py-2" key={`row-${rowIndex}`}>
                                    <td className="led py-1 px-2">{row.dest}</td>
                                    <td className="led py-1 whitespace-nowrap text-right">{row.due}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="">
                            <td colSpan={3}>
                                <div className="p-2 justify-center items-center flex">
                                <Clock />
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
