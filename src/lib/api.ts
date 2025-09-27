'use server'

import fs from 'fs'
import { Station } from '@/types'

const APP_KEY = process.env.APP_KEY ?? ''
const BASE_URL = process.env.BASE_URL ?? ''

export async function get(pathname: string, searchParams: URLSearchParams = new URLSearchParams()) {
    const url = new URL(BASE_URL)
    url.pathname = pathname
    searchParams.set('app_key', APP_KEY)

    url.search = searchParams.toString()

    const res = await fetch(url.toString())
    if (!res.ok) {
        console.log(res)
        throw new Error('TfL error ' + res.status)
    }
    const data = await res.json()
    return data
}

function idToFile(id: string) {
    return id.replace('-', '.')
}

// function FileToId(filename: string) {
//     return filename.replace('.', '-')
// }

function loadJson(filename: string) {
    const data = fs.readFileSync(`./src/data/${filename}.json`).toString()
    return JSON.parse(data)
}

export async function getLines(cache: boolean = true) {
    return cache ? loadJson('lines') : get('/Line/Mode/tube')
}

export async function getLine(line: string, cache: boolean = true) {
    if (cache) {
        return loadJson(`${idToFile(line)}.line`)
    }
    const data = await get(`/Line/${line}`)
    if (data.length) return data[0]
    return data
}

export async function getStations(line: string, cache: boolean = true) {
    return cache ? loadJson(`${idToFile(line)}.stations`) : get(`/Line/${line}/StopPoints`)
}

export async function getAllStations(): Promise<Station[]> {
    return loadJson('stations')
}

export async function getStationById(stationId: string): Promise<Station> {
    const stationHash = await getStationHash()
    return stationHash[stationId]
}

export async function getStationHash() {
    return loadJson('station.hash')
}

export async function getLineSequence(line: string, cache: boolean = true) {
    return cache ? loadJson(`${idToFile(line)}.seq`) : get(`/Line/${line}/Route/Sequence/outbound`)
}

////////////////////////////////////////////////

export async function getArrivals(lineId: string, stationId: string) {
    const query = new URLSearchParams()
    query.set('stopPointId', stationId)
    return get(`/Line/${lineId}/Arrivals`, query)
}

export async function getAllArrivals(line: string) {
    const query = new URLSearchParams()
    query.set('mode', 'tube')
    return get(`/Line/${line}/Arrivals`, query)
}

export async function getLineRoute(line: string) {
    return get(`/Line/${line}/Route`)
}

export async function getVehiclePositions(line: string) {
    return get(`/Line/${line}/Arrivals`)
}

export async function getStopPoint(station: string) {
    return get(`/StopPoint/${station}`)
}
