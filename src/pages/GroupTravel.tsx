import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function GroupTravel() {
  const features = [
    { title: 'Split Payments', description: 'Easily split costs among group members.', icon: '💰' },
    { title: 'Custom Itineraries', description: 'Create itineraries tailored to your group’s interests.', icon: '🗺️' },
    { title: 'Group Discounts', description: 'Save more when booking for a group.', icon: '🎟️' },
    { title: 'Seamless Booking', description: 'Manage flights, hotels, and activities in one place.', icon: '✈️' }
  ];

  return (
    <div className="container py-20">
      <h1 className="text-3xl font-bold mb-6">Group Travel</h1>
      <p className="text-secondary mb-12">Plan trips for your friends, family, or colleagues with ease. TripVerse makes group travel effortless and enjoyable.</p>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-secondary">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* How It Works Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ol className="list-decimal ml-6 space-y-2 text-secondary">
          <li>Create your group and add members.</li>
          <li>Select your destinations and dates.</li>
          <li>Split payments and confirm bookings.</li>
          <li>Enjoy a stress-free group trip!</li>
        </ol>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <Link
          to="/flights"
          className="inline-block px-8 py-3 rounded-lg font-semibold text-white"
          style={{ backgroundColor: "#C5A56F" }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = "#bfa56b"}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#C5A56F"}
        >
          Start Your Group Trip
        </Link>
      </div>
    </div>
  );
}
