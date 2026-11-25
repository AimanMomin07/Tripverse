import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DESTINATIONS } from '../data/destinations';

export default function DestinationDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const topRef = useRef<HTMLDivElement>(null);

  const params = new URLSearchParams(location.search);
  const name = params.get('name');
  const destination = DESTINATIONS.find(d => d.name === name);

  // Scroll to top on load
  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (!destination) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Destination not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  const handleBookFlight = () => {
    navigate(`/flights?to=${destination.name}`);
  };

  return (
    <div className="bg-warm-white min-h-screen" ref={topRef}>
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <button
          className="btn bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          onClick={() => navigate('/')}
        >
          &larr; Back
        </button>
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.8 }}
        className="relative w-full h-[60vh] overflow-hidden"
      >
        <motion.img 
          src={destination.image} 
          alt={destination.name} 
          className="w-full h-full object-cover scale-105"
          animate={{ scale: [1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white p-4">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-bold mb-2"
          >
            {destination.name}
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-2xl max-w-xl"
          >
            {destination.description}
          </motion.p>
        </div>
      </motion.div>

      {/* Summary Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="container mx-auto py-12 px-4 md:px-0"
      >
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">Budget & Activities</h2>
            <p className="text-gray-700 font-semibold">Estimated Budget: <span className="text-black">{destination.budget}</span></p>
            <h3 className="text-xl font-semibold">Activities</h3>
            <ul className="list-disc list-inside space-y-1">
              {destination.activities.map((act, i) => <li key={i}>{act}</li>)}
            </ul>
            <h3 className="text-xl font-semibold mt-4">Famous Spots</h3>
            <ul className="list-disc list-inside space-y-1">
              {destination.famousSpots.map((spot, i) => <li key={i}>{spot}</li>)}
            </ul>

            {/* Book Flight Button */}
            <motion.button
              onClick={handleBookFlight}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="mt-6 w-full md:w-auto btn bg-gold text-black font-semibold px-8 py-3 rounded-lg text-lg shadow-lg hover:shadow-2xl transition"
            >
              Book Flight
            </motion.button>
          </div>

          <div className="flex items-center justify-center">
            <motion.img 
              src={destination.image} 
              alt={destination.name} 
              className="rounded-2xl shadow-xl w-full max-w-md object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
