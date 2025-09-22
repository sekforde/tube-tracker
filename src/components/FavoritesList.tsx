'use client'

import { useState, useEffect } from 'react'
import { getFavorites, removeFavorite, FavoriteStation } from '@/lib/favorites'

export function FavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteStation[]>([])

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])

  const handleRemoveFavorite = (line: string, stationId: string) => {
    removeFavorite(line, stationId)
    setFavorites(getFavorites())
  }

  if (favorites.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Favorites</h2>
        <p className="text-gray-600">No favorite stations yet. Visit a station page to add one!</p>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Favorites</h2>
      <div className="space-y-2">
        {favorites.map((favorite) => (
          <div 
            key={`${favorite.line}-${favorite.stationId}`}
            className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex-1">
              <a 
                href={`/${favorite.line}/${favorite.stationId}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {favorite.stationName}
              </a>
              <p className="text-sm text-gray-500">{favorite.lineName}</p>
            </div>
            <button
              onClick={() => handleRemoveFavorite(favorite.line, favorite.stationId)}
              className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
              aria-label={`Remove ${favorite.stationName} from favorites`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
