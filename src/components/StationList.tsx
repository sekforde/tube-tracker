'use client'

import { useState } from 'react'
import { addFavorite } from '@/lib/favorites'
import { StationButton } from '@/components/StationButton'
import { Station } from '@/types'

interface StationListProps {
    stations: Station[]
    onFavoriteAdded: () => void
}

export function StationList({ stations, onFavoriteAdded }: StationListProps) {
    const [searchText, setSearchText] = useState<string>('')

    function onChangeSearchText(e: any) {
        setSearchText(e.target.value)
    }

    function handleAddFavourites(station: Station) {
        addFavorite(station)
        onFavoriteAdded()
    }

    return (
        <div className="mb-8 w-full">
            <h2 className="text-xl font-bold my-2 text-gray-900">Stations</h2>
            <div className="py-4">
                <input className="border border-gray-400 text-gray-400 p-2 w-full rounded-lg" placeholder="Search Stations..." value={searchText} onChange={onChangeSearchText} />
            </div>
            <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {stations
                    .filter((station) => station.name.toLowerCase().includes(searchText.toLowerCase()))
                    .map((station) => (
                        <StationButton key={station.id} station={station} onClickAddFavourite={handleAddFavourites} />
                    ))}
            </div>
        </div>
    )
}
