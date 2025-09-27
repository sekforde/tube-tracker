'use server'

import fs from 'fs'
import { getArrivals, getLineRoute, getVehiclePositions } from '@/lib/api'
import { revalidatePath } from 'next/cache'
import { cleanName } from '@/lib/utils'
import { ArrivalRow } from '@/types' 

export async function loadArrivals(lineId: string, stationId: string) {
    const data = await getArrivals(lineId, stationId)
    data.sort((a: any, b: any) => a.timeToStation - b.timeToStation)

    const rows = data.slice(0, 10).map((item: any) => {
        // console.log(item)
        const mins = Math.max(0, Math.round(item.timeToStation / 60))
        const due = mins <= 0 ? 'Due' : `${mins} min`
        return {
            due,
            dest: item.destinationName || item.towards || item.towards,
            via: item.platformName?.replace(/.*-\s*/, '') || item.towards || '',
            plat: (item.platformName || '').match(/Platform\s(\d+)/)?.[1] || '',
            status: item.modeName === 'tube' ? 'Good Service' : ''
        }
    })

    return rows
}

// export async function loadArrivalsByPlatform(line: string, station: string) {
//     const data = await getArrivals(line, station)
//     console.log(data)
//     data.sort((a: any, b: any) => a.timeToStation - b.timeToStation)

//     // Group arrivals by platform
//     const platformGroups: { [key: string]: any[] } = {}

//     data.forEach((item: any) => {
//         const platformName = item.platformName || 'Unknown Platform'
//         if (!platformGroups[platformName]) {
//             platformGroups[platformName] = []
//         }
//         platformGroups[platformName].push(item)
//     })

//     // Convert each platform group to display format and sort by platform number
//     const platformBoards = Object.entries(platformGroups)
//         .map(([platformName, arrivals]) => {
//             let stationName = ''
//             const rows = arrivals.slice(0, 8).map((item: any) => {
//                 stationName = cleanName(item.stationName);
//                 const mins = Math.max(0, Math.round(item.timeToStation / 60))
//                 const due = mins <= 0 ? 'Due' : `${mins} min`
//                 return {
//                     due,
//                     dest: cleanName(item.destinationName || item.towards || item.towards),
//                     via: item.platformName?.replace(/.*-\s*/, '') || item.towards || '',
//                     plat: (item.platformName || '').match(/Platform\s(\d+)/)?.[1] || '',
//                     status: item.modeName === 'tube' ? 'Good Service' : ''
//                 }
//             })

//             // Extract platform number for sorting
//             const platformNumber = parseInt(platformName.match(/Platform\s(\d+)/)?.[1] || '999')

//             return {
//                 stationName,
//                 platformName,
//                 platformNumber,
//                 arrivals: rows
//             }
//         })
//         .sort((a, b) => a.platformNumber - b.platformNumber)
//         .map(({ stationName, platformName, arrivals }) => ({ stationName, platformName, arrivals }))

//     return platformBoards
// }

export async function loadArrivalsByDirection(lineId: string, stationId: string) {
    const data = await getArrivals(lineId, stationId)
    const lineName = `${lineId.charAt(0).toUpperCase() + lineId.slice(1)} Line`

    // console.log(data)
    data.sort((a: any, b: any) => a.timeToStation - b.timeToStation)

    // Group arrivals by platform
    const directionGroups: { [key: string]: any[] } = {}

    data.forEach((item: any) => {
        if (!directionGroups[item.direction]) {
            directionGroups[item.direction] = []
        }
        directionGroups[item.direction].push(item)
    })

    // Convert each platform group to display format and sort by platform number
    const directionBoards = Object.entries(directionGroups)
        .map(([direction, arrivalsData]) => {
            let stationName = ''
            const arrivals: ArrivalRow[] = arrivalsData.slice(0, 8).map((item: any) => {
                stationName = cleanName(item.stationName)
                const mins = Math.max(0, Math.round(item.timeToStation / 60))
                const due = mins <= 0 ? 'Due' : `${mins} min`
                return {
                    platformName: item.platformName,
                    due,
                    dest: cleanName(item.destinationName || item.towards || item.towards),
                    via: item.platformName?.replace(/.*-\s*/, '') || item.towards || '',
                    plat: (item.platformName || '').match(/Platform\s(\d+)/)?.[1] || '',
                    status: item.modeName === 'tube' ? 'Good Service' : ''
                }
            })

            return {
                stationName,
                direction,
                arrivals
            }
        })
        // .sort((a, b) => a.platformNumber - b.platformNumber)
        .map(({ stationName, direction, arrivals }) => ({ 
            lineId, 
            lineName, 
            stationId,
            stationName, 
            direction, 
            arrivals 
        }))

    return directionBoards
}

export async function revalidateArrivals(stationId: string) {
    revalidatePath(`/station/${stationId}`)
}

export async function loadLineRoute(lineId: string) {
    const route = await getLineRoute(lineId)
    return route
}

export async function loadVehiclePositions(lineId: string) {
    const positions = await getVehiclePositions(lineId)
    fs.writeFileSync('./src/data/positions.json', JSON.stringify(positions, null, 2))

    // Process vehicle positions to get current locations
    const vehicles = positions.map((vehicle: any) => {
        // console.log(vehicle)
        return {
            id: vehicle.vehicleId,
            currentLocation: vehicle.currentLocation,
            destination: vehicle.destinationName || vehicle.towards,
            direction: vehicle.direction,
            timeToStation: vehicle.timeToStation,
            stationName: vehicle.stationName,
            lineId: vehicle.lineId,
            lineName: vehicle.lineName,
            naptanId: vehicle.naptanId
        }
    })

    return vehicles
}
