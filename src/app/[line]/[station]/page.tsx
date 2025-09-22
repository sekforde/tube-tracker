import { loadArrivals } from '@/server/tfl'
import AutoRefreshTimer from '@/components/AutoRefreshTimer'

export default async function StationPage({ params }: { params: Promise<any> }) {
    const resolvedParams = await params
    const { line, station } = resolvedParams
    const rows = await loadArrivals(line, station)

    return (
        <>
            <AutoRefreshTimer line={line} station={station} />
            <div className="frame" role="region" aria-label="Central line arrivals for Wanstead">
            <div className="topbar">
                <span className="pill">Central Line</span>
                <div className="title">Wanstead — Arrivals</div>
                <div className="now" id="clock" aria-live="polite">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            <div className="panel" role="table" aria-label="Arrivals board">
                <div className="row hdr" role="row">
                    <div className="cell" role="columnheader">
                        Due
                    </div>
                    <div className="cell" role="columnheader">
                        Destination
                    </div>
                    <div className="cell" role="columnheader">
                        Towards
                    </div>
                    <div className="cell plat" role="columnheader">
                        Plat
                    </div>
                    <div className="cell" role="columnheader">
                        Status
                    </div>
                </div>

                {/* SAMPLE ROWS: replace dynamically with API data if desired */}
                {rows.map((row: any, rowIndex: number) => {
                    return (
                        <div className="row" role="row" key={`row-${rowIndex}`}>
                            <div className="cell led blink" role="cell">
                                {row.due}
                            </div>
                            <div className="cell led" role="cell">
                                {row.dest}
                            </div>
                            <div className="cell led-dim" role="cell">
                                {row.via}
                            </div>
                            <div className="cell plat led" role="cell">
                                {row.plat}
                            </div>
                            <div className="cell" role="cell">
                                <span className="badge good">{row.status}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* <div className="footer" aria-hidden="true">
                <span>LED simulation: amber glow + tabular numerals</span>
                <span>Mock data shown — hook up to TfL API to go live</span>
            </div> */}
            </div>
        </>
    )
}
