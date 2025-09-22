import { getLines } from '@/lib/api'

export default async function Home() {
    const lines = await getLines()
    return (
        <div className="block">
            {lines.map((line: any) => {
                return <div key={line.id} className="p-2">
                  <a className="" href={`/${line.id}`}>{line.name}</a>
                </div>
            })}
        </div>
    )
}
