// 'use client'

// import { useState, useEffect } from 'react'
// import { lineColors } from '@/lib/colours'
// import { loadVehiclePositions } from '@/server/tfl'

// interface Station {
//     id: string
//     commonName: string
//     lat: number
//     lon: number
//     order: number
// }

// interface Vehicle {
//     id: string
//     currentLocation: string
//     destination: string
//     direction: string
//     timeToStation: number
//     stationName: string
// }

// interface LineMapProps {
//     line: string
//     stations: Station[]
//     vehicles: Vehicle[]
//     lineColor: string
// }

// export default function LineMap({ line, stations, vehicles: initialVehicles, lineColor }: LineMapProps) {
//     const [selectedStation, setSelectedStation] = useState<string | null>(null)
//     const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
//     const [vehicles, setVehicles] = useState(initialVehicles)
//     const [lastUpdated, setLastUpdated] = useState(new Date())
//     const [isUpdating, setIsUpdating] = useState(false)

//     // Sort stations by order for proper display
//     const sortedStations = [...stations].sort((a, b) => a.order - b.order)

//     // Update vehicles data every 30 seconds
//     useEffect(() => {
//         const updateVehicles = async () => {
//             setIsUpdating(true)
//             try {
//                 const newVehicles = await loadVehiclePositions(line)
//                 setVehicles(newVehicles)
//                 setLastUpdated(new Date())
//             } catch (error) {
//                 console.error('Failed to update vehicle positions:', error)
//             } finally {
//                 setIsUpdating(false)
//             }
//         }

//         const interval = setInterval(updateVehicles, 30000) // Update every 30 seconds
//         return () => clearInterval(interval)
//     }, [line])

//     // Group vehicles by their current location
//     const vehiclesByLocation = vehicles.reduce((acc, vehicle) => {
//         const location = vehicle.currentLocation || vehicle.stationName
//         if (!acc[location]) {
//             acc[location] = []
//         }
//         acc[location].push(vehicle)
//         return acc
//     }, {} as Record<string, Vehicle[]>)

//     return (
//         <div className="w-full max-w-6xl mx-auto p-2 sm:p-4">
//             <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
//                     <h1 className="text-xl sm:text-2xl font-bold capitalize">
//                         {line.replace('-', ' ')} Line Map
//                     </h1>
//                     <div className="flex items-center space-x-2 sm:space-x-4">
//                         <div className="text-xs sm:text-sm text-gray-600">
//                             <div className="flex items-center space-x-2">
//                                 <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
//                                 <span className="hidden sm:inline">
//                                     {isUpdating ? 'Updating...' : `Last updated: ${lastUpdated.toLocaleTimeString()}`}
//                                 </span>
//                                 <span className="sm:hidden">
//                                     {isUpdating ? 'Updating...' : lastUpdated.toLocaleTimeString()}
//                                 </span>
//                             </div>
//                         </div>
//                         <div 
//                             className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
//                             style={{ backgroundColor: lineColor }}
//                         ></div>
//                     </div>
//                 </div>

//                 {/* Line Map */}
//                 <div className="relative">
//                     {/* Line track */}
//                     <div 
//                         className="absolute top-1/2 left-0 right-0 h-2 rounded-full transform -translate-y-1/2"
//                         style={{ backgroundColor: lineColor, opacity: 0.3 }}
//                     ></div>

//                     {/* Stations */}
//                     <div className="relative flex justify-between items-center py-6 sm:py-8 overflow-x-auto">
//                         {sortedStations.map((station, index) => {
//                             const stationVehicles = vehiclesByLocation[station.commonName] || []
//                             const isSelected = selectedStation === station.id
                            
//                             return (
//                                 <div 
//                                     key={station.id}
//                                     className="relative flex flex-col items-center group cursor-pointer min-w-0 flex-shrink-0"
//                                     onClick={() => setSelectedStation(isSelected ? null : station.id)}
//                                 >
//                                     {/* Station dot */}
//                                     <div 
//                                         className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 sm:border-4 border-white shadow-lg transition-all duration-200 ${
//                                             isSelected ? 'scale-125' : 'hover:scale-110'
//                                         }`}
//                                         style={{ backgroundColor: lineColor }}
//                                     ></div>
                                    
//                                     {/* Station name */}
//                                     <div className={`mt-1 sm:mt-2 text-xs sm:text-sm text-center max-w-16 sm:max-w-20 transition-all duration-200 ${
//                                         isSelected ? 'font-bold text-sm sm:text-lg' : 'group-hover:font-semibold'
//                                     }`}>
//                                         <span className="block truncate">
//                                             {station.commonName.replace(' Underground Station', '')}
//                                         </span>
//                                     </div>

//                                     {/* Vehicles at this station */}
//                                     {stationVehicles.length > 0 && (
//                                         <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2">
//                                             <div className="flex space-x-1">
//                                                 {stationVehicles.map((vehicle) => (
//                                                     <div
//                                                         key={vehicle.id}
//                                                         className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-white shadow-sm cursor-pointer transition-all duration-200 ${
//                                                             selectedVehicle === vehicle.id ? 'scale-125' : 'hover:scale-110'
//                                                         }`}
//                                                         style={{ backgroundColor: lineColor }}
//                                                         onClick={(e) => {
//                                                             e.stopPropagation()
//                                                             setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)
//                                                         }}
//                                                         title={`Train ${vehicle.id} to ${vehicle.destination}`}
//                                                     ></div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* Station details popup */}
//                                     {isSelected && (
//                                         <div className="absolute top-10 sm:top-12 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 sm:p-3 z-10 min-w-40 sm:min-w-48 max-w-64">
//                                             <h3 className="font-semibold text-xs sm:text-sm mb-2">
//                                                 {station.commonName}
//                                             </h3>
//                                             {stationVehicles.length > 0 ? (
//                                                 <div className="space-y-1">
//                                                     <p className="text-xs text-gray-600">
//                                                         {stationVehicles.length} train{stationVehicles.length > 1 ? 's' : ''} at station
//                                                     </p>
//                                                     {stationVehicles.map((vehicle) => (
//                                                         <div key={vehicle.id} className="text-xs">
//                                                             <span className="font-medium">Train {vehicle.id}:</span>
//                                                             <span className="ml-1">to {vehicle.destination}</span>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             ) : (
//                                                 <p className="text-xs text-gray-500">No trains at station</p>
//                                             )}
//                                         </div>
//                                     )}
//                                 </div>
//                             )
//                         })}
//                     </div>
//                 </div>

//                 {/* Vehicle details panel */}
//                 {selectedVehicle && (
//                     <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
//                         {(() => {
//                             const vehicle = vehicles.find(v => v.id === selectedVehicle)
//                             if (!vehicle) return null
                            
//                             return (
//                                 <div>
//                                     <h3 className="font-semibold mb-2 text-sm sm:text-base">Train {vehicle.id} Details</h3>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
//                                         <div>
//                                             <span className="font-medium">Current Location:</span>
//                                             <p className="truncate">{vehicle.currentLocation || vehicle.stationName}</p>
//                                         </div>
//                                         <div>
//                                             <span className="font-medium">Destination:</span>
//                                             <p className="truncate">{vehicle.destination}</p>
//                                         </div>
//                                         <div>
//                                             <span className="font-medium">Direction:</span>
//                                             <p className="capitalize">{vehicle.direction}</p>
//                                         </div>
//                                         <div>
//                                             <span className="font-medium">Time to Station:</span>
//                                             <p>{Math.round(vehicle.timeToStation / 60)} minutes</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )
//                         })()}
//                     </div>
//                 )}

//                 {/* Legend */}
//                 <div className="mt-4 sm:mt-6 flex items-center justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
//                     <div className="flex items-center space-x-2">
//                         <div 
//                             className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm"
//                             style={{ backgroundColor: lineColor }}
//                         ></div>
//                         <span>Stations</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                         <div 
//                             className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-white shadow-sm"
//                             style={{ backgroundColor: lineColor }}
//                         ></div>
//                         <span>Trains</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
