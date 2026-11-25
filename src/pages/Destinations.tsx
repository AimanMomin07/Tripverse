import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const destinations = [
  { id: 'TV100', name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', description: 'Experience luxury in the desert', region: 'Middle East', type: 'Luxury' },
  { id: 'TV101', name: 'Mumbai', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80', description: 'Gateway to India', region: 'Asia', type: 'City' },
  { id: 'TV102', name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80', description: 'Modern Asian marvel', region: 'Asia', type: 'City' },
  { id: 'TV103', name: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80', description: 'Historic British capital', region: 'Europe', type: 'City' },
  { id: 'TV104', name: 'Bangkok', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80', description: 'Thai cultural experience', region: 'Asia', type: 'Adventure' },
  { id: 'TV105', name: 'Hong Kong', image: '/destinations/hongkong.jpg', description: 'Where East meets West', region: 'Asia', type: 'Luxury' },
  { id: 'TV106', name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', description: 'City of Love & Lights', region: 'Europe', type: 'Luxury' },
  { id: 'TV107', name: 'Tokyo', image: '/destinations/tokyo.jpg', description: 'Blend of Tradition & Modernity', region: 'Asia', type: 'City' },
  { id: 'TV108', name: 'New York', image: '/destinations/newyork.jpg', description: 'The City That Never Sleeps', region: 'North America', type: 'City' },
  { id: 'TV109', name: 'Raipur', image: '/destinations/raipur.jpg', description: 'Capital city of Chhattisgarh, India', region: 'Asia', type: 'City' },
  { id: 'TV110', name: 'Sydney', image: '/destinations/sy.jpg', description: 'Iconic Opera House & Beaches', region: 'Australia', type: 'Luxury' },
   { id: 'TV111', name: 'Delhi', image: '/destinations/delhi.jpg', description: 'Capital city of India, rich in history and culture', region: 'Asia', type: 'City' }
];

const regions = ['All', 'Asia', 'Europe', 'Middle East'];
const types = ['All', 'Luxury', 'City', 'Adventure'];

export default function Destinations() {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const filteredDestinations = destinations.filter(dest => {
    return (selectedRegion === 'All' || dest.region === selectedRegion) &&
           (selectedType === 'All' || dest.type === selectedType);
  });

  const resetFilters = () => {
    setSelectedRegion('All');
    setSelectedType('All');
  };

  return (
    <div className="container py-20">
      <h1 className="text-3xl font-bold mb-4">Destinations</h1>
      <p className="text-secondary mb-8">Explore popular destinations and plan your next adventure with TripVerse.</p>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-12 items-center">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold">Region:</span>
          {regions.map(region => (
            <button
              key={region}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedRegion === region ? 'bg-[#C5A56F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold">Type:</span>
          {types.map(type => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedType === type ? 'bg-[#C5A56F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Reset Filters Button */}
        <button
          className="ml-auto px-5 py-2 rounded-lg font-semibold text-white transition"
          style={{ backgroundColor: "#C5A56F" }}
          onClick={resetFilters}
          onMouseOver={e => e.currentTarget.style.backgroundColor = "#bfa56b"}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#C5A56F"}
        >
          Reset Filters
        </button>
      </div>

      {/* Destinations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.length === 0 ? (
          <p className="text-gray-500 col-span-full">No destinations match your filter.</p>
        ) : (
          filteredDestinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <Link to={`/flights?to=${dest.name}`} className="absolute inset-0 z-10" aria-label={`View flights to ${dest.name}`} />
              
              <motion.img
                src={dest.image}
                alt={dest.name}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-6 left-6 text-white z-20">
                <h3 className="text-2xl font-bold mb-2">{dest.name}</h3>
                <p className="text-sm opacity-90 mb-4">{dest.description}</p>
                <a
                  href={`/flights?to=${dest.name}`}
                  className="inline-block px-5 py-2 rounded-lg font-semibold text-white"
                  style={{ backgroundColor: "#C5A56F" }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = "#bfa56b"}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = "#C5A56F"}
                >
                  View Flights
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
