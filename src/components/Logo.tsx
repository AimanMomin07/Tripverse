import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative w-8 h-8"
      >
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=32&h=32&q=80" 
          alt="TripVerse Logo"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-transparent rounded-lg" />
      </motion.div>
      <span className="font-display text-xl font-bold">TripVerse</span>
    </Link>
  )
}