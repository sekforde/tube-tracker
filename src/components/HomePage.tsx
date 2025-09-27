'use client'

import { useState, useEffect } from 'react'
import { getFavorites } from '@/lib/favorites'
import { Station } from '@/types'
import { FavoritesList } from '@/components/FavoritesList'
import { StationList } from '@/components/StationList'

interface HomePageProps {
    stations: Station[]
}

export function HomePage({ stations }: HomePageProps) {
    const [favorites, setFavorites] = useState<Station[]>([])

    const refreshFavorites = () => {
        setFavorites(getFavorites())
    }

    useEffect(() => {
        refreshFavorites()
    }, [])

    return (
        <div className="">
            <FavoritesList favorites={favorites} onRefresh={refreshFavorites} />
            <div className="flex">
                <StationList stations={stations} onFavoriteAdded={refreshFavorites} />
            </div>
        </div>
    )
}
