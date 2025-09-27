'use client'

import { removeFavorite } from '@/lib/favorites'
import { Station } from '@/types'
import { StationButton } from '@/components/StationButton'

interface FavoritesListProps {
    favorites: Station[]
    onRefresh: () => void
}

export function FavoritesList({ favorites, onRefresh }: FavoritesListProps) {
    const handleRemoveFavorite = (stationId: string) => {
        removeFavorite(stationId)
        onRefresh()
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {favorites.map((favorite) => (
                    <StationButton key={favorite.id} station={favorite} onClickRemoveFavourite={handleRemoveFavorite} />
                ))}
            </div>
        </div>
    )
}
