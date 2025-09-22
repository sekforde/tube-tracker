'use client'

import { useState, useEffect } from 'react'
import { addFavorite, removeFavorite, isFavorite, FavoriteStation } from '@/lib/favorites'

interface FavoriteButtonProps {
  line: string
  stationId: string
  stationName: string
  lineName: string
}

export function FavoriteButton({ line, stationId, stationName, lineName }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false)

  useEffect(() => {
    setFavorited(isFavorite(line, stationId))
  }, [line, stationId])

  const handleToggle = () => {
    const favoriteData: FavoriteStation = {
      line,
      stationId,
      stationName,
      lineName
    }

    if (favorited) {
      removeFavorite(line, stationId)
      setFavorited(false)
    } else {
      addFavorite(favoriteData)
      setFavorited(true)
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`favorite-button ${favorited ? 'favorited' : ''}`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <div className="favorite-button-content">
        <svg 
          className="favorite-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill={favorited ? "currentColor" : "none"}
          />
        </svg>
        <span className="favorite-text">{favorited ? 'FAV' : 'ADD'}</span>
      </div>
    </button>
  )
}
