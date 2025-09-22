export interface FavoriteStation {
  line: string
  stationId: string
  stationName: string
  lineName: string
}

const FAVORITES_KEY = 'tube-tracker-favorites'

export function getFavorites(): FavoriteStation[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addFavorite(favorite: FavoriteStation): void {
  if (typeof window === 'undefined') return
  
  const favorites = getFavorites()
  const exists = favorites.some(f => f.line === favorite.line && f.stationId === favorite.stationId)
  
  if (!exists) {
    favorites.push(favorite)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }
}

export function removeFavorite(line: string, stationId: string): void {
  if (typeof window === 'undefined') return
  
  const favorites = getFavorites()
  const filtered = favorites.filter(f => !(f.line === line && f.stationId === stationId))
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
}

export function isFavorite(line: string, stationId: string): boolean {
  const favorites = getFavorites()
  return favorites.some(f => f.line === line && f.stationId === stationId)
}
