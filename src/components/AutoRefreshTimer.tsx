'use client'

import { useEffect } from 'react'
import { revalidateArrivals } from '@/server/tfl'

interface AutoRefreshTimerProps {
    stationId: string
    intervalMs?: number
}

export function AutoRefreshTimer({ 
    stationId, 
    intervalMs = 30000 
}: AutoRefreshTimerProps) {
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await revalidateArrivals(stationId)
            } catch (error) {
                console.error('Failed to revalidate arrivals:', error)
            }
        }, intervalMs)

        return () => clearInterval(interval)
    }, [stationId, intervalMs])

    // This component doesn't render anything visible
    return null
}
