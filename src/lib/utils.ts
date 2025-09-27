export function makeHash(arr: any[], field: string) {
    return arr.reduce((acc, item) => {
        acc[item[field]] = item
        return acc
    }, {})
}

export function cleanName(name:string) {
    return name.replace('Underground Station', '').replace(/\s*\([^)]*\)/g, "").trim()
}
