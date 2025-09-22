'use client'

import { useRouter } from 'next/navigation'

export function BackButton({ href }: {href: string}) {
    const router = useRouter()

    const handleClick = () => {
        router.push(`/${href}`)
    }

    return (
        <button
            onClick={handleClick}
            className={`back-button`}
            aria-label="Go back"
        >
            <div className="back-button-content">
                <svg 
                    className="back-arrow" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="M15 18L9 12L15 6" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                </svg>
                <span className="back-text">BACK</span>
            </div>
        </button>
    )
}
