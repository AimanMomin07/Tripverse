import React from 'react'
import { Link } from 'react-router-dom'
import { Flight } from '../utils/mockFlights'
import { motion } from 'framer-motion'

export default function FlightCard({f, onBook}:{f:Flight,onBook:(f:Flight)=>void}){
  // resolve airline logo path: use explicit map for known files, else slug fallback
  const getAirlineLogo = (name: string) => {
    const map: Record<string,string> = {
      'Aurora Air': '/airlines/air-india-seeklogo.png',
      'Regal Wings': '/airlines/king.png',
      'Emirates': '/airlines/emirates-airlines-1.svg',
      'Lufthansa': '/airlines/luftg.png',
      'Indigo Airlines': '/airlines/indigo-seeklogo.png',
      'British Airways': '/airlines/bair.png',
      'Singapore Airlines': '/airlines/sing.png'
    }
    if(map[name]) return map[name]
    const slug = name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'')
    return `/airlines/${slug}.svg`
  }

  const logoSrc = getAirlineLogo(f.airline)

  return (
    <motion.div 
      layout 
      layoutId={`card-${f.id}`}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }} 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      viewport={{ once: true }}
      className="glass-card rounded-xl shadow-card hover:shadow-hover transition-shadow duration-300 overflow-hidden border border-gray-100 glow-animated"
    >
      <div className="p-6">
        {/* Airline Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.img 
              src={logoSrc} 
              alt={f.airline} 
              className="w-12 h-12 object-contain"
              layoutId={`image-${f.id}`}
            />
            <div>
              <div className="text-lg font-semibold text-primary">{f.airline}</div>
              <div className="text-sm text-secondary">{f.id}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">₹{f.price.toLocaleString()}</div>
            <div className="text-sm text-accent">Best Deal</div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="flex items-center justify-between mb-6">
          {/* Departure */}
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">
              {new Date(f.depart).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
            </div>
            <div className="text-sm font-medium text-primary">{f.from}</div>
            <div className="text-xs text-secondary">
              {new Date(f.depart).toLocaleDateString([], {
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Flight Path */}
          <div className="flex-1 mx-6">
            <div className="relative flex items-center justify-center">
              <div className="border-t-2 border-gray-200 w-full"></div>
              <div className="absolute w-full flex justify-center">
                <div className="bg-white px-4 text-sm text-secondary">
                  {Math.floor(f.durationMin/60)}h {f.durationMin%60}m
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="text-xs text-secondary">
                {f.stops === 0 ? 'Direct' : `${f.stops} ${f.stops === 1 ? 'stop' : 'stops'}`}
              </div>
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">
              {new Date(f.arrive).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
            </div>
            <div className="text-sm font-medium text-primary">{f.to}</div>
            <div className="text-xs text-secondary">
              {new Date(f.arrive).toLocaleDateString([], {
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Features & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['wifi', 'meal', 'entertainment', 'usb', 'baggage'].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-secondary bg-gray-50 rounded-full px-3 py-1">
                <img 
                  src={`/icons/${feature}.svg`} 
                  alt={feature} 
                  className="w-4 h-4"
                />
                <span className="text-xs capitalize font-medium">{feature}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to={`/flights/${f.id}`} className="text-sm text-secondary hover:text-accent">View Details</Link>
            <button 
              onClick={() => onBook(f)} 
              className="btn btn-primary"
            >
              Select Flight
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
