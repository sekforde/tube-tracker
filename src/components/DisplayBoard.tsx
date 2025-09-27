'use client'

import { lineColors } from '@/lib/colours'
import { Clock } from '@/components/Clock'
import { BoardData, ArrivalRow } from '@/types'

interface DisplayBoardProps {
    board: BoardData
}

// .display-board {
//     width: 100%;
//     background:linear-gradient(180deg, #0f1117 0%, #0a0c12 100%);
//     border-radius:22px; 
//     padding:18px; 
//     box-shadow:0 20px 60px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.03);
//     border:1px solid var(--trim);
//     display: flex;
//     flex-direction: column;
//     margin-bottom: 20px;
//   }


export function DisplayBoard({ board }: DisplayBoardProps) {
    const color = lineColors.find((l) => l.id === board.lineId)?.color ?? 'gray'
    // display-board w-full sm:max-w-144 sm:mx-auto border-4 border-pink-500
    return (
        <div className="w-full sm:max-w-144 sm:mx-auto bg-black rounded-lg p-4 flex flex-col mb-4 border-4 border-pink-500">
            {/** Header */}
            <div className="pb-4 flex">
                <div
                    className="px-2 flex whitespace-nowrap rounded-xl p-2 text-white font-bold justify-center items-center"
                    style={{
                        backgroundColor: color
                    }}
                >
                    {board.lineName}
                </div>
                <div className=""></div>
                <div className="pl-4 mb-2 my-auto text-white ">
                    <div>
                        {board.stationName} - {board.direction}
                    </div>
                </div>
            </div>

            <div className="w-full">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-white">
                            <th className="py-2 px-2">Destination</th>
                            <th className="py-2 px-2 text-right">Platform</th>
                            <th className="py-2 text-right">Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/** Rows */}
                        {board.arrivals.map((row: ArrivalRow, rowIndex: number) => {
                            return (
                                <tr className="py-2" key={`row-${rowIndex}`}>
                                    <td className="led py-1 px-2">{row.dest}</td>
                                    <td className="led py-1 px-2 text-right">{row.plat}</td>
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
