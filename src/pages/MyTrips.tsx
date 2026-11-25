import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flight, FareClassType, FareClassDetails } from '../utils/mockFlights'

interface Trip {
  id: string
  flight: Flight
  seats: string[]
  classType: FareClassType
  createdAt: string
}

export default function MyTrips(){
  const [trips, setTrips] = useState<Trip[]>([])
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(()=>{
    const t = JSON.parse(localStorage.getItem('tv_my_trips')||'[]')
    setTrips(t)
  },[])

  return (
    <div className='container py-12'>
      <h1 className='text-2xl font-bold mb-6' style={{color:'var(--gold)'}}>My Trips</h1>
      {successMsg && (
        <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="mb-4 p-3 rounded-lg bg-green-50 text-green-800">
          {successMsg}
        </motion.div>
      )}
      {trips.length===0 ? <div className='text-gray-400'>No trips yet — book one from Flights page.</div> : (
        <div className='space-y-4'>
          {trips.map(tr=>(
            <motion.div key={tr.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className='glass p-4 rounded-lg border glow-animated'>
              <div className='flex justify-between items-center'>
                <div>
                  <div className='font-semibold'>{tr.flight.airline} · {tr.flight.id}</div>
                  <div className='text-sm text-gray-400'>{tr.flight.from} → {tr.flight.to}</div>
                  <div className='text-xs text-gray-500'>Booked on {new Date(tr.createdAt).toLocaleString()}</div>
                </div>
                <div className='text-right'>
                  <div className='font-semibold' style={{color:'var(--gold)'}}>₹{tr.flight.fareClasses?.find((fc: FareClassDetails) => fc.type === tr.classType)?.price.toLocaleString() || tr.flight.price?.toLocaleString()}</div>
                  <div className='text-xs text-gray-400'>
                    {tr.classType && (
                      <span className={`inline-block px-2 py-0.5 rounded text-xs mr-2 ${
                        tr.classType === 'Economy' ? 'bg-blue-100 text-blue-700' : 
                        tr.classType === 'Premium' ? 'bg-purple-100 text-purple-700' :
                        tr.classType === 'Business' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {tr.classType}
                      </span>
                    )}
                    Seats: {tr.seats.join(', ')}
                  </div>
                  <div className='text-xs text-gray-500'>
                    {tr.flight.fareClasses?.find((fc: FareClassDetails) => fc.type === tr.classType)?.baggage && 
                      `Baggage: ${tr.flight.fareClasses.find((fc: FareClassDetails) => fc.type === tr.classType)?.baggage}`
                    }
                  </div>
                  <div className='mt-2 flex gap-2 justify-end'>
                    <button className='btn btn-outline' onClick={() => {
                      // remove booking
                      const remaining = trips.filter(x=> x.id !== tr.id)
                      localStorage.setItem('tv_my_trips', JSON.stringify(remaining))
                      setTrips(remaining)
                      setSuccessMsg('Booking cancelled successfully')
                      setTimeout(()=>setSuccessMsg(null), 3000)
                    }}>Cancel Booking</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
