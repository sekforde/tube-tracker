import { getLineSequence } from '@/lib/api'

export async function processLine(line: string) {
    const seq = await getLineSequence(line)

    const stations = seq.stopPointSequences
        .map((stopSeq: any) => {
            const stopPoint = stopSeq.stopPoint
            return stopPoint.map((stopPointSegment: any) => {
                return {
                    id: stopPointSegment.id,
                    name: stopPointSegment.name.replace('Underground Station', '').trim()
                }
            })
        })
        .flat()

    const stationHash = stations.reduce((acc: any, s: any) => {
        acc[s.id] = s
        return acc
    }, {})

    const routes = seq.orderedLineRoutes.map((route: any) => {
        return route.naptanIds.map((nid: string) => {
            return {
                id: nid,
                name: stationHash[nid].name
            }
        })
    })

    // const baseRoute = routes[0]
    // const baseRouteIds = baseRoute.map((r) => r.id)
    routes.sort((a: any, b: any) => b.length - a.length)

    // function setStationMergePoint(routeIndex, id) {
    //     const fIndex = routes[routeIndex].findIndex(st => st.id === id)
    //     routes[routeIndex][fIndex].mergePoint = true
    //     return routes[routeIndex][fIndex]
    // }

    // function getStationMergePoint(routeIndex, id) {
    //     const fIndex = routes[routeIndex].findIndex(st => st.id === id)
    //     return routes[routeIndex][fIndex]
    // }

    // const processRoute = (route: any[], baseRoute: any[]) => {
    //     const baseRouteIds = baseRoute.map((r) => r.id)
    //     const routeIds = route.map((r) => r.id)

    //     const difference: any[] = []

    //     let merged = baseRouteIds[0] === routeIds[0]
    //     routeIds.forEach((id, index) => {
    //         // does it exist on base
    //         const isOnBase = baseRouteIds.includes(id)
    //         if (isOnBase && !merged) {
    //             const fStation = setStationMergePoint(route,id)
    //             difference.push(fStation)
    //             merged = true
    //             // return
    //         }
    //         if (merged && !isOnBase) {
    //             const lastId = routeIds[index - 1]
    //             console.log('lastId', lastId)
    //             const fStation = getStationMergePoint(route,id)
    //             difference.push(fStation)
    //             merged = false
    //             // return
    //         }
    //         if (!isOnBase) {
    //             const fStation = getStationMergePoint(route,id)
    //             difference.push(fStation)
    //         }
    //     })

    //     return difference

    // }

    return routes
}
