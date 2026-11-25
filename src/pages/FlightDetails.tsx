import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_FLIGHTS } from '../utils/mockFlights'
import BookingFlow from '../components/BookingFlow'

export default function FlightDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const flight = MOCK_FLIGHTS.find(f=>f.id === id)
  const [booking, setBooking] = useState<any|null>(null)
  const [openBooking, setOpenBooking] = useState(false)

  if(!flight) return (
    <div className="container py-20">
      <h2 className="text-2xl font-semibold">Flight not found</h2>
      <p className="text-secondary">Return to <a onClick={()=>navigate('/flights')} className="text-accent cursor-pointer">search</a></p>
    </div>
  )

  const fareBreakdown = () => {
    const base = flight.price
    const taxes = Math.round(base * 0.12)
    const fees = 500
    const total = base + taxes + fees
    return { base, taxes, fees, total }
  }

  const f = fareBreakdown()

  return (
    <div className="container py-20">
      <div className="grid md:grid-cols-3 gap-8">
        <motion.div className="md:col-span-2 bg-white p-6 rounded-xl shadow-card" initial={{opacity:0, y:8}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
          <h1 className="text-2xl font-semibold mb-4">{flight.airline} · {flight.id}</h1>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-3xl font-bold">{new Date(flight.depart).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
              <div className="text-sm text-secondary">{flight.from}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-secondary">Duration</div>
              <div className="font-medium">{Math.floor(flight.durationMin/60)}h {flight.durationMin%60}m</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{new Date(flight.arrive).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
              <div className="text-sm text-secondary">{flight.to}</div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Journey Details</h3>
          <p className="text-secondary mb-4">{flight.description || `Operated by ${flight.airline}. ${flight.stops === 0 ? 'Direct flight' : `${flight.stops} stop(s)`}.`}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-secondary">Aircraft: <span className="text-primary font-medium">{flight.aircraft || 'N/A'}</span></div>
            <div className="text-secondary">Baggage: <span className="text-primary font-medium">{flight.baggage || 'N/A'}</span></div>
            <div className="text-secondary">Rating: <span className="text-primary font-medium">{flight.rating || '—'}</span></div>
          </div>

          {flight.amenities && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Amenities</h4>
              <div className="flex gap-3">
                {flight.amenities.map(a=> (
                  <div key={a} className="px-3 py-1 bg-gray-100 rounded text-sm text-secondary">{a}</div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h4 className="font-semibold mb-2">Included</h4>
            <ul className="list-disc pl-6 text-secondary">
              <li>Seat selection</li>
              <li>Standard baggage</li>
              <li>In-flight snack</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button onClick={()=>setOpenBooking(true)} className="btn btn-primary">Book Now</button>
            <button onClick={()=>navigate('/flights')} className="btn btn-outline">Back to Search</button>
          </div>
  </motion.div>

  <motion.aside className="bg-white p-6 rounded-xl shadow-card" initial={{opacity:0, y:8}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
          <h3 className="text-lg font-semibold mb-4">Fare Breakdown</h3>
          <div className="space-y-2 text-secondary mb-4">
            <div className="flex justify-between"><span>Base Fare</span><span>₹{f.base.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Taxes</span><span>₹{f.taxes.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Fees</span><span>₹{f.fees.toLocaleString()}</span></div>
            <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span>₹{f.total.toLocaleString()}</span></div>
          </div>
          <p className="text-xs text-secondary">Prices are indicative (mock data).</p>
  </motion.aside>
      </div>

      {openBooking && (
        <BookingFlow
          flight={flight!}
          passengers={1}
          classType={'Economy'}
          onComplete={(b) => { setBooking(b); setOpenBooking(false) }}
          onClose={() => setOpenBooking(false)}
        />
      )}

    </div>
  )
}