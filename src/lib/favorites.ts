import { Station } from '@/types'

const FAVORITES_KEY = 'tube-tracker-favorites'

export function getFavorites(): Station[] {
    if (typeof window === 'undefined') return []

    try {
        const stored = localStorage.getItem(FAVORITES_KEY)
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

export function addFavorite(favorite: Station): void {
    if (typeof window === 'undefined') return

    const favorites = getFavorites()
    const exists = favorites.some((f) => f.id === favorite.id)

    if (!exists) {
        favorites.push(favorite)
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
}

export function removeFavorite(stationId: string): void {
    if (typeof window === 'undefined') return

    const favorites = getFavorites()
    const filtered = favorites.filter((f) => !(f.id === stationId))
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
}

export function isFavorite(stationId: string): boolean {
    const favorites = getFavorites()
    return favorites.some((f) => f.id === stationId)
}
