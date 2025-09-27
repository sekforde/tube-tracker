import { Station } from '@/types'

interface StationButtonProps {
    station: Station
    onClickAddFavourite?: (station: Station) => void
    onClickRemoveFavourite?: (stationId: string) => void
}

export function StationButton({ station, onClickAddFavourite, onClickRemoveFavourite }: StationButtonProps) {
    function handleRemoveFavorite(e: React.MouseEvent<HTMLButtonElement>, stationId: string) {
        e.stopPropagation()
        e.preventDefault()
        onClickRemoveFavourite && onClickRemoveFavourite(stationId)
    }

    function handleAddFavorite(e: React.MouseEvent<HTMLButtonElement>, station: Station) {
        e.stopPropagation()
        e.preventDefault()
        onClickAddFavourite && onClickAddFavourite(station)
    }

    return (
        <a
            href={`/station/${station.id}`}
            className="flex justify-between items-center text-blue-700 p-3 bg-white rounded-lg border-2 border-blue-700 hover:border-gray-300 transition-colors cursor-pointer"
        >
            <div className="flex-1">
                {station.name}
            </div>
            {onClickRemoveFavourite && (
                <button
                    onClick={(e) => handleRemoveFavorite(e, station.id)}
                    className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    aria-label={`Remove ${station.name} from favorites`}
                >
                    Remove
                </button>
            )}
            {onClickAddFavourite && (
                <button
                    onClick={(e) => handleAddFavorite(e, station)}
                    className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    aria-label={`Remove ${station.name} from favorites`}
                >
                    Add
                </button>
            )}
        </a>
    )
}
