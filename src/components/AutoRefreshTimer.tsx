'use client'

import { useEffect } from 'react'
import { revalidateArrivals } from '@/server/tfl'

interface AutoRefreshTimerProps {
    line: string
    station: string
    intervalMs?: number
}

export default function AutoRefreshTimer({ 
    line, 
    station, 
    intervalMs = 30000 
}: AutoRefreshTimerProps) {
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await revalidateArrivals(line, station)
            } catch (error) {
                console.error('Failed to revalidate arrivals:', error)
            }
        }, intervalMs)

        return () => clearInterval(interval)
    }, [line, station, intervalMs])

    // This component doesn't render anything visible
    return null
}
