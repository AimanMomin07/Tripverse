import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navbarBg = isHome
    ? isScrolled
      ? 'bg-white shadow-md'
      : 'bg-transparent'
    : 'bg-white shadow-md'

  const textColor = isHome
    ? isScrolled
      ? 'text-primary'
      : 'text-white'
    : 'text-primary'

  const links = [
    { path: '/', label: 'Home' },
    { path: '/flights', label: 'Flights' },
    { path: '/my-trips', label: 'My Trips' },
    { path: '/ai-planner', label: 'AI Planner' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}
    >
      <div className='container flex items-center justify-between py-4'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-3'>
          <motion.div whileHover={{ scale: 1.05 }} className='relative w-10 h-10 rounded-lg overflow-hidden'>
            <img
              src='https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=48&h=48&q=80'
              alt='TripVerse'
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-r from-accent/30 to-transparent' />
          </motion.div>
          <span className={`font-display text-xl font-bold ${textColor}`}>TripVerse</span>
        </Link>

        {/* Desktop nav */}
        <nav className='hidden md:flex items-center gap-8'>
          {links.map((link, i) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={i}
                to={link.path}
                className={`font-medium transition-colors ${isActive ? 'text-accent' : textColor + ' hover:text-accent'}`}
              >
                {link.label}
              </Link>
            )
          })}

          {user && (
            <div className='flex items-center gap-4'>
              <div className={`text-sm font-medium ${textColor}`}>
                {user.displayName || user.email}
              </div>
              <button
                onClick={() => logout()}
                className='btn btn-outline'
              >
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button className='md:hidden p-2' onClick={() => setMenuOpen(!menuOpen)}>
          <svg className={`w-6 h-6 ${textColor}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className='fixed top-0 right-0 w-3/4 h-full z-40 flex flex-col p-6 md:hidden
                       backdrop-blur-lg bg-white/60 shadow-lg'
          >
            {links.map((link, i) => {
              const isActive = location.pathname === link.path
              return (
                <motion.div
                  key={i}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`font-medium py-3 text-lg ${isActive ? 'text-accent' : 'text-primary'}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              )
            })}

            <div className='mt-auto'>
              {user && (
                <>
                  <div className='text-primary mb-4'>{user.displayName || user.email}</div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className='btn btn-outline w-full'
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
