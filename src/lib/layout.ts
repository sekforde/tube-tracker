/**
 * Checks if an array represents a branch divergence from previous arrays
 * This happens when arrays share common stations but then diverge to different destinations
 */
function checkForBranchDivergence(currentArray, previousArrays) {
    // Find the longest common prefix with any previous array
    let maxCommonLength = 0
    let divergencePoint = -1

    for (const prevArray of previousArrays) {
        let commonLength = 0
        const minLength = Math.min(currentArray.length, prevArray.length)

        // Find how many stations are common from the start
        for (let i = 0; i < minLength; i++) {
            if (currentArray[i].id === prevArray[i].id) {
                commonLength++
            } else {
                break
            }
        }

        // If we found a longer common prefix, update our tracking
        if (commonLength > maxCommonLength) {
            maxCommonLength = commonLength
            divergencePoint = commonLength
        }
    }

    // Check if there's divergence after the common prefix
    if (divergencePoint > 0 && divergencePoint < currentArray.length) {
        // Check if the next station after the common prefix is different
        for (const prevArray of previousArrays) {
            if (
                divergencePoint < prevArray.length &&
                currentArray[divergencePoint].id !== prevArray[divergencePoint].id
            ) {
                return true // Found a divergence point
            }
        }
    }

    return false
}

/**
 * Assigns row and column coordinates to objects across overlapping arrays
 * to create a tube map-like layout
 */
export function generateTubeMapCoordinates(arrays) {
    if (!arrays || arrays.length === 0) {
        return []
    }

    const objectMap = new Map()
    const result: any[] = []

    // First pass: collect all unique objects
    arrays.forEach((array) => {
        array.forEach((obj) => {
            if (!objectMap.has(obj.id)) {
                objectMap.set(obj.id, { ...obj, row: 0, col: 0 })
            }
        })
    })

    const positioned = new Set()

    // Start with the first array as the baseline (row 0)
    const baseline = arrays[0]
    baseline.forEach((obj, index) => {
        const coordObj = objectMap.get(obj.id)
        coordObj.row = 0
        coordObj.col = index
        positioned.add(obj.id)
    })

    // Process remaining arrays
    for (let arrayIndex = 1; arrayIndex < arrays.length; arrayIndex++) {
        const currentArray = arrays[arrayIndex]
        const previousArray = arrays[arrayIndex - 1]

        const connections: any[] = []
        currentArray.forEach((obj, index) => {
            if (positioned.has(obj.id)) {
                connections.push({
                    id: obj.id,
                    arrayPosition: index,
                    currentCoords: objectMap.get(obj.id)
                })
            }
        })

        // Check if this array starts differently than the previous array
        const startsWithDifferentStation = currentArray[0].id !== previousArray[0].id

        // Check for branch divergence - when arrays share common stations but then diverge
        const isBranchDivergence = checkForBranchDivergence(currentArray, arrays.slice(0, arrayIndex))

        if (connections.length === 0) {
            // No connections at all - definitely a new branch
            assignNewBranch(currentArray, objectMap, positioned, getNextAvailableRow(objectMap))
        } else if (startsWithDifferentStation && connections[0].arrayPosition > 0) {
            // Array starts with a different station and the first connection is not at position 0
            // This means we have new stations at the beginning that should be on a new row
            const branchRow = getNextAvailableRow(objectMap)
            assignBranchFromConnection(currentArray, connections[0], objectMap, positioned, branchRow)
        } else if (isBranchDivergence) {
            // This array represents a different branch from a common point
            const branchRow = getNextAvailableRow(objectMap)
            const firstConnection = connections[0]
            assignBranchFromConnection(currentArray, firstConnection, objectMap, positioned, branchRow)
        } else if (connections.length === 1) {
            const connection = connections[0]
            // Only create a new branch if the connection is not at the start of the array
            // and there are new stations before the connection
            if (connection.arrayPosition > 0) {
                const branchRow = getNextAvailableRow(objectMap)
                assignBranchFromConnection(currentArray, connection, objectMap, positioned, branchRow)
            } else {
                // Connection is at the start, just extend the existing line
                assignBridgingPath(currentArray, connections, objectMap, positioned)
            }
        } else {
            assignBridgingPath(currentArray, connections, objectMap, positioned)
        }
    }

    objectMap.forEach((obj) => result.push(obj))

    return result.sort((a: any, b: any) => {
        if (a.row !== b.row) return a.row - b.row
        return a.col - b.col
    })
}

function assignNewBranch(array, objectMap, positioned, row) {
    array.forEach((obj, index) => {
        const coordObj = objectMap.get(obj.id)
        coordObj.row = row
        coordObj.col = index
        positioned.add(obj.id)
    })
}

function assignBranchFromConnection(array, connection, objectMap, positioned, branchRow) {
    const connectionIndex = connection.arrayPosition
    const connectionCol = connection.currentCoords.col

    for (let i = 0; i < connectionIndex; i++) {
        const obj = array[i]
        if (!positioned.has(obj.id)) {
            const coordObj = objectMap.get(obj.id)
            coordObj.row = branchRow
            coordObj.col = connectionCol - (connectionIndex - i)
            positioned.add(obj.id)
        }
    }

    for (let i = connectionIndex + 1; i < array.length; i++) {
        const obj = array[i]
        if (!positioned.has(obj.id)) {
            const coordObj = objectMap.get(obj.id)
            coordObj.row = branchRow
            coordObj.col = connectionCol + (i - connectionIndex)
            positioned.add(obj.id)
        }
    }
}

function assignBridgingPath(array, connections, objectMap, positioned, targetRow = null) {
    connections.sort((a, b) => a.arrayPosition - b.arrayPosition)

    const firstConnection = connections[0]
    const lastConnection = connections[connections.length - 1]

    const useRow = targetRow || firstConnection.currentCoords.row

    const colStart = firstConnection.currentCoords.col
    const colEnd = lastConnection.currentCoords.col
    const arrayStart = firstConnection.arrayPosition
    const arrayEnd = lastConnection.arrayPosition

    array.forEach((obj, index) => {
        if (!positioned.has(obj.id)) {
            const coordObj = objectMap.get(obj.id)
            coordObj.row = useRow

            if (index <= arrayStart) {
                coordObj.col = colStart - (arrayStart - index)
            } else if (index >= arrayEnd) {
                coordObj.col = colEnd + (index - arrayEnd)
            } else {
                const progress = (index - arrayStart) / (arrayEnd - arrayStart)
                coordObj.col = Math.round(colStart + (colEnd - colStart) * progress)
            }

            positioned.add(obj.id)
        }
    })
}

function getNextAvailableRow(objectMap) {
    let maxRow = -1
    objectMap.forEach((obj) => {
        maxRow = Math.max(maxRow, obj.row)
    })
    return maxRow + 1
}
