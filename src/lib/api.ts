const APP_KEY = process.env.APP_KEY ?? ''
const BASE_URL = process.env.BASE_URL ?? ''

export async function get(pathname:string, searchParams: URLSearchParams = new URLSearchParams()) {
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

export function getLines() {
    return get('/Line/Mode/tube')
}

export async function getLine(line: string) {
    const data = await get(`/Line/${line}`)
    if (data.length) return data[0]
    return data
}

export function getStations(line: string) {
    return get(`/Line/${line}/StopPoints`)
}

export function getArrivals(line: string, station: string) {
    const query = new URLSearchParams()
    query.set('stopPointId', station)
    return get(`/Line/${line}/Arrivals`, query)
}