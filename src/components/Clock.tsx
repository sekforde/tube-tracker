'use client'

import { useState, useEffect } from 'react'

export function Clock() {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 5000) // Update every 5 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-12 pt-2" id="clock">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
    )
}
