import React, { useMemo, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MOCK_FLIGHTS, Flight } from '../utils/mockFlights'
import FlightCard from '../components/FlightCard'
import BookingFlow from '../components/BookingFlow'
import BookingConfirmation from '../components/BookingConfirmation'
import { motion, AnimatePresence } from 'framer-motion'

export default function Flights() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('2025-11-05')
  const [passengers, setPassengers] = useState(1)
  const [classType, setClassType] = useState('Economy')
  const [airlineFilter, setAirlineFilter] = useState<'All'|string>('All')
  const [sortBy, setSortBy] = useState<'price'|'duration'>('price')
  const [queryResults, setQueryResults] = useState<Flight[]>([])
  const [activeFlight, setActiveFlight] = useState<Flight|null>(null)
  const [booking, setBooking] = useState<any|null>(null)
  
  // Show all flights initially
  useEffect(() => {
    if (queryResults.length === 0) {
      setQueryResults(MOCK_FLIGHTS)
    }
  }, [])

  const airlines = useMemo(()=> Array.from(new Set(MOCK_FLIGHTS.map(f=>f.airline))),[])

  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const qTo = params.get('to')
    const qFrom = params.get('from')
    if(qTo) setTo(qTo.toUpperCase())
    if(qFrom) setFrom(qFrom.toUpperCase())
    if(qTo || qFrom) {
      // small timeout to allow state updates
      setTimeout(() => search(), 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  const search = ()=>{
    console.log('Searching with params:', { from, to, classType, airlineFilter })
    console.log('Available flights:', MOCK_FLIGHTS)
    
    let res = MOCK_FLIGHTS
    
    // Only filter by from/to if both are provided
    if (from && to) {
      res = res.filter(f => 
        f.from.toLowerCase() === from.toLowerCase() && 
        f.to.toLowerCase() === to.toLowerCase()
      )
    }
    
    console.log('After from/to filter:', res)
    
    if(airlineFilter !== 'All') {
      res = res.filter(r => r.airline === airlineFilter)
      console.log('After airline filter:', res)
    }
    
    if(sortBy === 'price') {
      res.sort((a,b)=>{
        const aPrice = a.fareClasses?.find(fc => fc.type === classType)?.price || a.price
        const bPrice = b.fareClasses?.find(fc => fc.type === classType)?.price || b.price
        return aPrice - bPrice
      })
    } else {
      res.sort((a,b)=>a.durationMin-b.durationMin)
    }
    
    console.log('Final results:', res)
    setQueryResults(res)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-warm-white pt-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-cover bg-center flex items-center" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("/hero-images/airport.jpg")'
      }}>
        <div className="container">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center text-white mb-8"
          >
            <h1 className="heading-1 mb-4">Find Your Perfect Flight</h1>
            <p className="text-xl">Discover luxury travel experiences with our curated flight selection</p>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass bg-white/95 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* From - To Fields */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1 flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-secondary mb-2">From</label>
                  <input 
                    value={from} 
                    onChange={(e) => setFrom(e.target.value.toUpperCase())} 
                    className="input w-full" 
                    placeholder="DEL"
                  />
                </div>
                <div className="flex items-center pt-8">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-secondary mb-2">To</label>
                  <input 
                    value={to} 
                    onChange={(e) => setTo(e.target.value.toUpperCase())} 
                    className="input w-full" 
                    placeholder="BOM"
                  />
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="input w-full"
                />
              </div>

              {/* Passengers & Class */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Travelers & Class</label>
                <div className="flex gap-2">
                  <select 
                    value={passengers} 
                    onChange={(e) => setPassengers(parseInt(e.target.value))} 
                    className="input flex-1"
                  >
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <select 
                    value={classType} 
                    onChange={(e) => setClassType(e.target.value)} 
                    className="input flex-1"
                  >
                    {['Economy', 'Premium', 'Business', 'First'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <select 
                  value={airlineFilter} 
                  onChange={(e) => setAirlineFilter(e.target.value)} 
                  className="input"
                >
                  <option value="All">All Airlines</option>
                  {airlines.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)} 
                  className="input"
                >
                  <option value="price">Sort by Price</option>
                  <option value="duration">Sort by Duration</option>
                </select>
              </div>
              <button 
                onClick={search} 
                className="btn btn-primary w-full md:w-auto"
              >
                Search Flights
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container py-12">
        <AnimatePresence>
          {queryResults.length === 0 ? (
            <motion.div 
              initial={{opacity: 0}} 
              animate={{opacity: 1}} 
              exit={{opacity: 0}} 
              className="text-center"
            >
              <div className="max-w-md mx-auto">
                <img src="/empty-state.svg" alt="No results" className="w-48 h-48 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-2">No Flights Found</h3>
                <p className="text-secondary">Try RPR → BOM, BOM → DXB, or leave empty to see all flights</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{opacity: 0, y: 20}} 
              animate={{opacity: 1, y: 0}} 
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold">Available Flights</h2>
                <p className="text-secondary">{queryResults.length} flights found</p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {queryResults.map((f, idx) => (
                  <motion.div 
                    key={f.id} 
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.07 }}
                  >
                    <FlightCard f={f} onBook={(flight) => setActiveFlight(flight)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Booking Flow Modal */}
      {activeFlight && (
        <BookingFlow 
          flight={activeFlight} 
          passengers={passengers}
          classType={classType}
          onComplete={(b) => { setBooking(b); setActiveFlight(null) }} 
          onClose={() => setActiveFlight(null)} 
        />
      )}

      {/* Booking Confirmation */}
      <BookingConfirmation booking={booking} />
    </div>
  )
}
