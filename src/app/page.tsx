import { getAllStations } from '@/lib/api'
import { HomePage } from '@/components/HomePage'

export default async function Home() {
    const stations = await getAllStations()

    return <HomePage stations={stations} />
}
