import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MOCK_FLIGHTS } from '../utils/mockFlights'
import { motion } from 'framer-motion'
import BookingFlow from '../components/BookingFlow'

function useQuery(){
  return new URLSearchParams(useLocation().search)
}

export default function PackageDetails(){
  const query = useQuery()
  const id = query.get('id')
  const navigate = useNavigate()
  const [pkg, setPkg] = useState<any|null>(null)
  const [openBooking, setOpenBooking] = useState(false)

  useEffect(()=>{
    // For demo: if id present, try to find a mock flight matching id, else fall back to first
    if(id){
      const found = MOCK_FLIGHTS.find(f=>f.id === id)
      if(found) setPkg(found)
      else setPkg(MOCK_FLIGHTS[0])
    } else {
      setPkg(MOCK_FLIGHTS[0])
    }
  },[id])

  if(!pkg) return <div className="container py-20">Loading...</div>

  return (
    <div className="container py-12">
      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="rounded-xl overflow-hidden mb-6">
            <motion.img src="/destinations/dubai.jpg" alt="package" className="w-full h-72 object-cover" layoutId={`image-${pkg.id}`} />
          </div>

          <h1 className="text-3xl font-semibold mb-2">{pkg.airline} — Exclusive Package</h1>
          <p className="text-secondary mb-6">Curated experience with transfers, hotel options and premium support.</p>

          <div className="mb-6 glass-card p-4 rounded-xl glow-border glow-animated">
            <h3 className="text-xl font-semibold mb-2">What's included</h3>
            <ul className="list-disc pl-6 text-secondary">
              <li>Roundtrip flight</li>
              <li>Hotel options (3-5 star)</li>
              <li>Local transfers, guided tours</li>
              <li>Group split payments available</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Itinerary</h3>
            <div className="text-secondary">
              <p className="mb-2">Day 1: Arrival and transfer to hotel.</p>
              <p className="mb-2">Day 2: City tour and leisure.</p>
              <p className="mb-2">Day 3: Free day and departure.</p>
            </div>
          </div>
        </div>

  <aside className="bg-white p-6 rounded-xl shadow-card glow-animated">
          <h3 className="text-lg font-semibold mb-4">Package Details</h3>
          <div className="mb-4 text-secondary">
            <div className="flex justify-between"><span>Price</span><strong>₹{pkg.price.toLocaleString()}</strong></div>
            <div className="flex justify-between"><span>Duration</span><span>{Math.floor(pkg.durationMin/60)}h {pkg.durationMin%60}m</span></div>
            <div className="flex justify-between"><span>Seats</span><span>Available</span></div>
          </div>

          <button className="btn btn-primary w-full mb-3" onClick={()=>setOpenBooking(true)}>Book Package</button>
          <button className="btn btn-outline w-full" onClick={()=>navigate('/flights')}>Back to Flights</button>
        </aside>
      </motion.div>

      {openBooking && <BookingFlow flight={pkg} onComplete={(b)=>{ localStorage.setItem('tv_last_booking', JSON.stringify(b)); setOpenBooking(false) }} onClose={()=> setOpenBooking(false)} passengers={1} classType={'Economy'} />}
    </div>
  )
}
