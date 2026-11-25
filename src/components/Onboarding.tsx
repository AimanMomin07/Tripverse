import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export default function Onboarding({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [open])

  const handleGetStarted = async () => {
    try {
      if (user) {
        await setDoc(doc(db, 'users', user.uid), { onboardingCompleted: true }, { merge: true })
      }
      onClose()
      navigate('/')
    } catch (err) {
      console.error('Error completing onboarding:', err)
    }
  }

  const handleExploreFlights = () => {
    onClose()
    navigate('/flights')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            ref={containerRef}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-gradient-to-br from-black/70 to-gray-900 glass p-8 rounded-2xl max-w-lg text-center border"
          >
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--gold)' }}>
              Welcome to TripVerse
            </h2>
            <p className="text-gray-300 mb-6">
              Experience curated luxury trips and white-glove booking.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={handleGetStarted} className="btn bg-white text-black">
                Get Started
              </button>
              <button onClick={handleExploreFlights} className="btn border border-white text-white">
                Explore Flights
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
