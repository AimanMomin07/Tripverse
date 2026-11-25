import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOCK_FLIGHTS, Flight, FareClassType } from '../utils/mockFlights'
import BookingFlow from '../components/BookingFlow'
import ChatInterface from '../components/ChatInterface'
import { Link } from 'react-router-dom'

export default function AIPlanner(){
  const [dest, setDest] = useState('')
  const [people, setPeople] = useState(2)
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departDate, setDepartDate] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [scraped, setScraped] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState('Economy')

  const [results, setResults] = useState<Flight[]>([])
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [showBooking, setShowBooking] = useState(false)

  // Local AI recommender: choose cheapest or highest rated flight
  const aiRecommend = () => {
    // filter flights by origin/destination/date
    const matches = MOCK_FLIGHTS.filter(f => {
      const matchOrigin = origin ? f.from.toLowerCase() === origin.trim().toLowerCase() : true
      const matchDest = destination ? f.to.toLowerCase() === destination.trim().toLowerCase() : true
      const matchDate = departDate ? f.depart.startsWith(departDate) : true
      return matchOrigin && matchDest && matchDate
    })
    if(matches.length === 0){
      setResult('AI: No matching flights found to recommend.')
      return
    }
    // prefer highest rating, then lowest price
    const best = matches.slice().sort((a,b)=> (b.rating||0) - (a.rating||0) || a.price - b.price)[0]
    setResult(`AI Recommendation: ${best.airline} ${best.id} — ₹${best.price.toLocaleString()} — ${best.durationMin}min`)
    setSelectedFlight(best)
    setShowBooking(true)
  }

  const searchFlights = () => {
    const matches = MOCK_FLIGHTS.filter(f => {
      const matchOrigin = origin ? f.from.toLowerCase() === origin.trim().toLowerCase() : true
      const matchDest = destination ? f.to.toLowerCase() === destination.trim().toLowerCase() : true
      const matchDate = departDate ? f.depart.startsWith(departDate) : true
      return matchOrigin && matchDest && matchDate
    })
    setResults(matches)
  }

  return (
    <div className="container py-20" style={{ 
      overscrollBehavior: 'none', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <div style={{ 
        height: '100%', 
        overflowY: 'auto',
        overscrollBehavior: 'contain'
      }}>
        <h1 className="text-2xl font-semibold mb-4">AI Travel Planner</h1>
        <div className="glass-card p-6 rounded-xl mb-6">
        <div className="grid md:grid-cols-6 gap-4">
          <input value={origin} onChange={(e)=>setOrigin(e.target.value)} placeholder="Origin (e.g. DEL)" className="input" />
          <input value={destination} onChange={(e)=>setDestination(e.target.value)} placeholder="Destination (e.g. BOM)" className="input" />
          <input value={departDate} onChange={(e)=>setDepartDate(e.target.value)} placeholder="Depart date (YYYY-MM-DD)" className="input" type="date" />
          <select value={people} onChange={(e)=>setPeople(parseInt(e.target.value))} className="input">
            {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n} traveler{n>1?'s':''}</option>)}
          </select>
          <button className="btn btn-outline col-span-1" onClick={searchFlights}>Search Flights</button>
          <button className="btn btn-primary col-span-1" onClick={aiRecommend}>AI Recommend & Book</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">AI Travel Assistant</h3>
          <div style={{ overscrollBehavior: 'contain', isolation: 'isolate' }}>
            <ChatInterface onSuggestFlight={(flight) => {
              setSelectedFlight(flight)
              setShowBooking(true)
              const fareClass = flight.fareClasses[0]
              setSelectedClass(fareClass.type)
              setResult(`AI Recommended Flight:\n${flight.airline} ${flight.id}\n${flight.from} → ${flight.to}\n${fareClass.type} Class: ₹${fareClass.price.toLocaleString()}\nDuration: ${flight.durationMin} minutes`)
              
              // Also update the search results to show this flight
              setResults([flight])

              // Scroll the results into view smoothly
              setTimeout(() => {
                document.querySelector('.search-results')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'nearest'
                })
              }, 100)
            }} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Current Selection</h3>
          <div className="glass-card p-4 rounded-xl">
            <AnimatePresence>
            {result ? (
              <motion.pre 
                key="ai-result" 
                initial={{opacity:0, y:6}} 
                animate={{opacity:1, y:0}} 
                exit={{opacity:0, y:6}} 
                transition={{duration:0.28}} 
                className="whitespace-pre-wrap text-accent font-medium"
              >
                {result}
              </motion.pre>
            ) : (
              <motion.div 
                key="ai-empty" 
                initial={{opacity:0}} 
                animate={{opacity:1}} 
                className="text-sm text-gray-600"
              >
                Chat with our AI Assistant to get personalized flight recommendations.
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-8 search-results">
        <h3 className="font-semibold mb-4">Search Results</h3>
        <motion.div className="grid md:grid-cols-3 gap-4" style={{ overscrollBehavior: 'contain' }} initial="hidden" animate="show" variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } }
        }}>
          {results.length === 0 && <div className="text-sm text-gray-500 col-span-3">No flights. Use Search or try AI Recommend.</div>}
          {results.map((f, idx) => (
            <motion.div key={f.id} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 } }}>
              <div className="glass-card p-4 rounded-xl hover:scale-[1.01] transition-transform">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-lg font-semibold">{f.airline} <span className="text-sm text-gray-400">{f.id}</span></div>
                    <div className="text-sm text-gray-400">{f.from} → {f.to} • {new Date(f.depart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(f.arrive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    <div className="text-sm text-gray-500 mt-2">{f.description}</div>
                    {f.returnSegment && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Return Flight Available</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-accent">₹{f.fareClasses.find(fc => fc.type === selectedClass)?.price.toLocaleString() || f.fareClasses[0].price.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">{f.durationMin} min • {f.stops} stops</div>
                    <div className="flex flex-wrap justify-end gap-2 mt-2">
                      {f.fareClasses.map((fc) => (
                        <span key={fc.type} className={`px-2 py-0.5 rounded text-xs ${fc.type === 'Economy' ? 'bg-blue-100 text-blue-700' : 
                          fc.type === 'Premium' ? 'bg-purple-100 text-purple-700' :
                          fc.type === 'Business' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'}`}>
                          {fc.type} ₹{fc.price.toLocaleString()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link to={`/flights/${f.id}`} className="btn btn-outline">View</Link>
                  <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="select select-bordered select-sm"
                  >
                    {f.fareClasses.map(fc => (
                      <option key={fc.type} value={fc.type}>{fc.type} - ₹{fc.price.toLocaleString()}</option>
                    ))}
                  </select>
                  <button className="btn btn-primary" onClick={()=>{ setSelectedFlight(f); setShowBooking(true) }}>Book</button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {showBooking && selectedFlight && (
        <BookingFlow 
          flight={selectedFlight} 
          passengers={people} 
          classType={selectedClass as FareClassType} 
          onComplete={(b)=>{ setShowBooking(false); setResult('Booking complete: ' + b.id); }} 
          onClose={()=>{ setShowBooking(false); setSelectedFlight(null)}} 
        />
      )}
      </div>
    </div>
  )
}
