'use client'

export function Clock() {
    return (
        <div className="w-12 pt-2" id="clock">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
    )
}
