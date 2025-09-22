'use server'

import { getArrivals } from '@/lib/api'

// const APP_KEY = process.env.APP_KEY ?? ''

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
    // const p = new URLSearchParams()
    // p.set('app_key', APP_KEY)

    // const url = `https://api.tfl.gov.uk/Line/${line}/Arrivals?stopPointId=${station}${p.toString() ? '&' + p : ''}`
    // const res = await fetch(url)
    // if (!res.ok) throw new Error('TfL error ' + res.status)
    // const data = await res.json()
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
