import { getLines } from '@/lib/api'
import { FavoritesList } from '@/components/FavoritesList'

export default async function Home() {
    const lines = await getLines()
    return (
        <div className="block">
            <FavoritesList />
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tube Lines</h2>
            {lines.map((line: any) => {
                return <div key={line.id} className="p-2">
                  <a className="" href={`/${line.id}`}>{line.name}</a>
                </div>
            })}
        </div>
    )
}
