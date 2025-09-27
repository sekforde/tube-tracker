'use client'

import { useState, useEffect, useCallback } from 'react'
import { lineColorHash } from '@/lib/colours'
import { getAllArrivals } from '@/lib/api'
// import { loadVehiclePositions } from '@/server/tfl'
import { generateTubeMapCoordinates } from '@/lib/layout'
import { makeHash } from '@/lib/utils'

interface Station {
    id: string
    name: string
    row: number
    col: number
}

interface StationOnMap extends Station {
    x: number
    y: number
}

// interface Vehicle {
//     id: string
//     currentLocation: string
//     destination: string
//     direction: string
//     timeToStation: number
//     stationName: string
// }

interface LineMapProps {
    line: string
    routes: any
    // stationHash: any
    // stations: Station[]
    // vehicles: Vehicle[]
    // lineColor: string
}

export function LineMap({ line, routes }: LineMapProps) {
    const [trains, setTrains] = useState<any[]>([])
    const stations: Station[] = generateTubeMapCoordinates(routes)
    const stationHash = makeHash(stations, 'id')

    const cellWidth = 150
    const cellHeight = 40
    const marginTop = 50
    const marginLeft = 200

    function placeOnMap(station: Station): StationOnMap {
        if (isNaN(station.row * cellWidth + marginLeft)) {
            console.log(station.row * cellWidth + marginLeft)
            // console.log(station.col * cellHeight + marginTop)
            console.log(station)
        }
        return {
            ...station,
            x: station.row * cellWidth + marginLeft,
            y: station.col * cellHeight + marginTop
        }
    }

    useEffect(() => {
        updateTrains()
    }, [])

    const updateTrains = useCallback(async () => {
        const arrivals = await getAllArrivals(line)
        console.log(arrivals)
        // const positions = await loadVehiclePositions(line)
        // console.log(positions[0])
        // const _trains = positions
        //     .filter((p) => {
        //         if (!stationHash[p.naptanId]) {
        //             console.log(p.naptanId)
        //             return false
        //         }
        //         return true
        //     })
        //     .map((p) => {
        //         return {
        //             ...stationHash[p.naptanId],
        //             ...p
        //         }
        //     })
        // // console.log(_trains)
        setTrains([])
        // setTrains(_trains)
    }, [])

    const connections: any = []

    routes.forEach((stations) => {
        // Draw lines between consecutive stations in this array
        for (let i = 0; i < stations.length - 1; i++) {
            const fromStation = placeOnMap(stationHash[stations[i].id])
            const toStation = placeOnMap(stationHash[stations[i + 1].id])

            if (fromStation && toStation) {
                if (fromStation.row === toStation.row) {
                    // Horizontal line
                    connections.push({ d: `M ${fromStation.x} ${fromStation.y} L ${toStation.x} ${toStation.y}` })
                } else if (fromStation.col === toStation.col) {
                    // Vertical line
                    connections.push({ d: `M ${fromStation.x} ${fromStation.y} L ${toStation.x} ${toStation.y}` })
                } else {
                    // L-shaped line (horizontal then vertical)
                    connections.push({
                        d: `M ${fromStation.x} ${fromStation.y} L ${toStation.x} ${fromStation.y} L ${toStation.x} ${toStation.y}`
                    })
                }
            }
        }
    })

    return (
        <div className="w-full max-w-6xl mx-auto p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
                    {/* <pre>{JSON.stringify(coordinates, null, 2)}</pre> */}
                    <svg width="1000" height="2000">
                        <rect x="1" y="1" width="999" height="1999" stroke="black" fill="none" />
                        {connections.map((connection, connectionIndex) => {
                            return (
                                <path
                                    key={`connection-${connectionIndex}`}
                                    {...connection}
                                    stroke={lineColorHash[line]}
                                    strokeWidth="4"
                                    fill="none"
                                />
                            )
                        })}
                        {stations.map((station) => {
                            const { x, y } = placeOnMap(station)
                            return (
                                <g key={station.id} transform={`translate(${x},${y})`}>
                                    <circle cx="0" cy="0" r="8" stroke="black" strokeWidth="3" fill="white" />
                                    <text className="cabin-400" fontSize="12" x={-20} textAnchor="end">
                                        {station.name}
                                    </text>
                                </g>
                            )
                        })}
                        {trains.map((train) => {
                            const { x, y } = placeOnMap(train)
                            return (
                                <circle
                                    key={`train-${Math.random()}`}
                                    cx={x}
                                    cy={y}
                                    r="4"
                                    stroke="pink"
                                    strokeWidth="0"
                                    fill="blue"
                                />
                            )
                        })}
                    </svg>
                </div>
            </div>
        </div>
    )
}

// ---- 1) Build topology from Route/Sequence (do this once per direction) ----
export function buildTopology(seq) {
    const branches = (seq.orderedLineRoutes || []).map((r) => r.naptanIds || [])
    const prevOf = new Map() // id -> prevId (per first-seen branch)
    const nextOf = new Map() // id -> nextId
    const nameToId = new Map()

    // station names for parsing "Between A and B"
    const allStops = (seq.stations || []).concat((seq.stopPointSequences || []).flatMap((s) => s.stopPoints || []))
    for (const sp of allStops) {
        const name = (sp.commonName || sp.name || sp.id).toLowerCase()
        if (!nameToId.has(name)) nameToId.set(name, sp.id)
    }

    // simple prev/next maps
    for (const ids of branches) {
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i]
            if (i > 0 && !prevOf.has(id)) prevOf.set(id, ids[i - 1])
            if (i < ids.length - 1 && !nextOf.has(id)) nextOf.set(id, ids[i + 1])
        }
    }

    return { prevOf, nextOf, nameToId }
}

// ---- 2) Helpers ----
function parseBetween(currentLocation, nameToId) {
    if (!currentLocation) return null
    // e.g. "Between Liverpool Street and Bethnal Green"
    const m = /Between\s+(.+?)\s+and\s+(.+)/i.exec(currentLocation)
    if (!m) return null
    const a = nameToId.get(m[1].toLowerCase())
    const b = nameToId.get(m[2].toLowerCase())
    return a && b ? { a, b } : null
}

function lerp(a, b, t) {
    return a + (b - a) * t
}

// ---- 3) Main: Arrivals[] -> plotted train points [{vehicleId,x,y,fromId,toId,t,...}] ----
export function computeTrainPositions(arrivals, topoInbound, topoOutbound, xyById) {
    // group by vehicleId
    const byVeh = new Map()
    for (const p of arrivals) {
        if (!p.vehicleId) continue
        if (!byVeh.has(p.vehicleId)) byVeh.set(p.vehicleId, [])
        byVeh.get(p.vehicleId).push(p)
    }

    const points: any = []
    for (const [vehicleId, preds] of byVeh) {
        preds.sort((a, b) => a.timeToStation - b.timeToStation)
        const next = preds[0]
        const dir = (next.direction || 'outbound').toLowerCase()
        const topo = dir.startsWith('in') ? topoInbound : topoOutbound

        // determine segment
        let aId, bId
        const seg = parseBetween(next.currentLocation, topo.nameToId)
        if (seg) {
            aId = seg.a
            bId = seg.b
        } else {
            bId = next.naptanId
            aId = topo.prevOf.get(bId) || bId // if unknown, snap to the stop
        }

        // fraction along the segment
        let t = 0.5
        const next2 = preds[1]
        if (next2) {
            const delta = Math.max(30, next2.timeToStation - next.timeToStation)
            t = Math.max(0.05, Math.min(0.95, 1 - next.timeToStation / delta))
        } else if (typeof next.timeToStation === 'number') {
            t = Math.max(0.05, Math.min(0.95, 1 - Math.exp(-next.timeToStation / 90)))
        }
        if (next.timeToStation != null && next.timeToStation <= 15) {
            aId = bId
            t = 1
        } // at platform

        const A = xyById[aId]
        const B = xyById[bId]
        if (!A || !B) continue

        points.push({
            vehicleId,
            direction: dir,
            fromId: aId,
            toId: bId,
            t,
            x: lerp(A.x, B.x, t),
            y: lerp(A.y, B.y, t),
            currentLocation: next.currentLocation,
            nextStopName: next.stationName,
            destination: next.destinationName,
            timeToStation: next.timeToStation
        })
    }
    return points
}
