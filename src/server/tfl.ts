'use server'

import { getArrivals } from '@/lib/api'
import { revalidatePath } from 'next/cache'

// const example = {
//     $type: 'Tfl.Api.Presentation.Entities.Prediction, Tfl.Api.Presentation.Entities',
//     id: '-1230734648',
//     operationType: 1,
//     vehicleId: '056',
//     naptanId: '940GZZLUWSD',
//     stationName: 'Wanstead Underground Station',
//     lineId: 'central',
//     lineName: 'Central',
//     platformName: 'Inner Rail - Platform 2',
//     direction: 'outbound',
//     bearing: '',
//     destinationNaptanId: '940GZZLUHLT',
//     destinationName: 'Hainault Underground Station',
//     timestamp: '2025-09-22T09:17:55.8449253Z',
//     timeToStation: 1564,
//     currentLocation: 'At Chancery Lane',
//     towards: 'Hainault via Newbury Park',
//     expectedArrival: '2025-09-22T09:43:59Z',
//     timeToLive: '2025-09-22T09:43:59Z',
//     modeName: 'tube',
//     timing: {
//         $type: 'Tfl.Api.Presentation.Entities.PredictionTiming, Tfl.Api.Presentation.Entities',
//         countdownServerAdjustment: '00:00:00',
//         source: '0001-01-01T00:00:00',
//         insert: '0001-01-01T00:00:00',
//         read: '2025-09-22T09:18:11.604Z',
//         sent: '2025-09-22T09:17:55Z',
//         received: '0001-01-01T00:00:00'
//     }
// }

export async function loadArrivals(line:string, station:string) {
    const data = await getArrivals(line, station)
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

export async function loadArrivalsByPlatform(line:string, station:string) {
    const data = await getArrivals(line, station)
    // console.log(data)
    data.sort((a: any, b: any) => a.timeToStation - b.timeToStation)

    // Group arrivals by platform
    const platformGroups: { [key: string]: any[] } = {}
    
    data.forEach((item: any) => {
        const platformName = item.platformName || 'Unknown Platform'
        if (!platformGroups[platformName]) {
            platformGroups[platformName] = []
        }
        platformGroups[platformName].push(item)
    })

    // Convert each platform group to display format and sort by platform number
    const platformBoards = Object.entries(platformGroups)
        .map(([platformName, arrivals]) => {
            let stationName = ''
            const rows = arrivals.slice(0, 8).map((item: any) => {
                stationName = item.stationName.replace("Underground Station","")
                const mins = Math.max(0, Math.round(item.timeToStation / 60))
                const due = mins <= 0 ? 'Due' : `${mins} min`
                return {
                    due,
                    dest: (item.destinationName || item.towards || item.towards).replace("Underground Station",""),
                    via: item.platformName?.replace(/.*-\s*/, '') || item.towards || '',
                    plat: (item.platformName || '').match(/Platform\s(\d+)/)?.[1] || '',
                    status: item.modeName === 'tube' ? 'Good Service' : ''
                }
            })

            // Extract platform number for sorting
            const platformNumber = parseInt(platformName.match(/Platform\s(\d+)/)?.[1] || '999')
            
            return {
                stationName,
                platformName,
                platformNumber,
                arrivals: rows
            }
        })
        .sort((a, b) => a.platformNumber - b.platformNumber)
        .map(({ stationName, platformName, arrivals }) => ({ stationName, platformName, arrivals }))

    return platformBoards
}

export async function revalidateArrivals(line: string, station: string) {
    revalidatePath(`/${line}/${station}`)
}
