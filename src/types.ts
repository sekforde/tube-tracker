export interface Station {
    id: string
    name: string
    lines: string[]
}

// export interface StationHash {
//     [id: string]: Station | 
// }

export interface ArrivalRow {
    due: string
    dest: string
    via: string
    plat: string
    status: string
}

// export interface Arrival {
//     platformName: string
//     due: number
//     dest: string
//     via: string
//     plat: string
//     status: string
// }

export interface BoardData {
    stationId: string
    stationName: string
    lineId: string
    lineName: string
    direction: string
    arrivals: ArrivalRow[]
}