import React from 'react'
import { motion } from 'framer-motion'

export default function BookingConfirmation({booking}:{booking:any}){
  if(!booking) return null
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className='fixed bottom-6 right-6 bg-gradient-to-br from-black/70 to-gray-900 glass p-4 rounded-lg border'>
      <div className='text-sm text-gray-300'>Booking confirmed</div>
      <div className='font-semibold' style={{color:'var(--gold)'}}>{booking.flight.airline} · {booking.id}</div>
      <div className='text-xs text-gray-400'>Seats: {booking.seats.join(', ')}</div>
    </motion.div>
  )
}
