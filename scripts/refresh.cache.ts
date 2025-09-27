import fs from 'fs'
import { getLine, getLines, getLineSequence, getStations } from '@/lib/api'
import { Station } from '@/types'
import { cleanName } from '@/lib/utils'

function saveJson(filename: string, data: any) {
    return fs.writeFileSync(`./src/data/${filename}.json`, JSON.stringify(data, null, 2))
}

async function main() {
    const lines = await getLines(false)
    fs.writeFileSync('./src/data/lines.json', JSON.stringify(lines, null, 2))

    console.log(`Processing ${lines.length} lines`)

    const stationHash: { [id: string]: any } = {}
    const stationList: Station[] = []

    for await (let line of lines) {
        console.log('loading', line.id)
        const lineFileId = line.id.replace('-', '.')

        const stations = await getStations(line.id, false)
        saveJson(`${lineFileId}.stations`, stations)

        const lineDetails = await getLine(line.id, false)
        saveJson(`${lineFileId}.line`, lineDetails)

        const lineSeq = await getLineSequence(line.id, false)
        saveJson(`${lineFileId}.seq`, lineSeq)

        stations.forEach((station) => {
            stationList.push({
                id: station.id,
                name: cleanName(station.commonName),
                lines: station.lines.map((l) => l.id)
            })
        })
    }

    // deduplicate the stations
    const uniqueStationList = Array.from(new Map(stationList.map(station => [station.id, station])).values());
    stationList.length = 0; // Clear the original array
    stationList.push(...uniqueStationList); // Populate with unique stations

    stationList.forEach((station) => {
        stationHash[station.id] = station
    })

    saveJson(`stations`, stationList)
    saveJson(`station.hash`, stationHash)
}

main().catch(console.error)
