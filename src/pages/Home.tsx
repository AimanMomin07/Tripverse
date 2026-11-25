import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroCarousel from '../components/HeroCarousel';
import { DESTINATIONS } from '../data/destinations';

export default function Home() {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const handleDestinationClick = (name: string) => {
    setSelectedDestination(name);
    // Scroll smoothly to detail panel after a tiny delay to allow animation render
    setTimeout(() => {
      const el = document.getElementById('destination-detail');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCloseDetail = () => setSelectedDestination(null);

  const destinationDetail = selectedDestination
    ? DESTINATIONS.find(d => d.name === selectedDestination)
    : null;

  return (
    <div className="bg-warm-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] bg-cover bg-center overflow-hidden">
        <HeroCarousel />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="container text-center text-white">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="heading-1 mb-6"
            >
              Discover Luxury Travel
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Experience seamless group travel planning with our premium booking platform
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                className="btn btn-primary"
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
              >
                Start Your Journey
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <section className="container py-20">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="heading-2 text-center mb-16"
        >
          Popular Destinations
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS.map((destination, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative h-80 rounded-xl overflow-hidden glow-border glow-animated cursor-pointer"
              onClick={() => handleDestinationClick(destination.name)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:via-black/50 transition-all duration-300" />
              <motion.img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {destination.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Destination Detail Panel */}
      <AnimatePresence>
        {destinationDetail && (
          <motion.section
            id="destination-detail"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="container py-20 bg-white rounded-3xl shadow-xl mx-auto px-4 md:px-0"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Right side video */}
              <div className="relative md:w-1/2 rounded-2xl overflow-hidden shadow-xl">
                <video
                  src={destinationDetail.video}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h2 className="text-white text-4xl md:text-5xl font-bold">{destinationDetail.name}</h2>
                </div>
              </div>

              {/* Left side details */}
              <div className="flex-1 space-y-4">
                <button
                  className="btn bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                  onClick={handleCloseDetail}
                >
                  &larr; Back
                </button>

                <p className="text-gray-700">{destinationDetail.description}</p>
                <p className="font-semibold">Estimated Budget: <span className="text-black">{destinationDetail.budget}</span></p>
                <h3 className="text-xl font-semibold mt-4">Activities</h3>
                <ul className="list-disc list-inside space-y-1">
                  {destinationDetail.activities.map((act, i) => <li key={i}>{act}</li>)}
                </ul>
                <h3 className="text-xl font-semibold mt-4">Famous Spots</h3>
                <ul className="list-disc list-inside space-y-1">
                  {destinationDetail.famousSpots.map((spot, i) => <li key={i}>{spot}</li>)}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 w-full md:w-auto btn bg-gold text-black font-semibold px-8 py-3 rounded-lg text-lg shadow-lg hover:shadow-2xl transition"
                  onClick={() => window.location.href = `/flights?to=${destinationDetail.name}`}
                >
                  Book Flight
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
