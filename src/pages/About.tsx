import React from 'react';

export default function About() {
  return (
    <div className="container py-20">
      <h1 className="text-3xl font-bold mb-8">About TripVerse</h1>

      {/* What We Do */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">What We Do</h2>
        <p className="text-secondary">
          TripVerse is a premium group travel booking platform that simplifies your travel experience. 
          We connect travelers with curated group tours, exclusive deals, and seamless booking services 
          to make every journey memorable.
        </p>
      </section>

      {/* Our Goals */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Our Goals</h2>
        <p className="text-secondary">
          Our mission is to make group travel effortless and enjoyable. We aim to provide personalized 
          experiences, foster community among travelers, and ensure safety, convenience, and affordability 
          in every trip we organize.
        </p>
      </section>

      {/* Join Us */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
        <p className="text-secondary mb-4">
          Whether you’re a traveler seeking amazing experiences or a partner wanting to collaborate, 
          TripVerse welcomes you. Join our community and explore the world with like-minded adventurers.
        </p>
        <a 
          href="mailto:aiman.momin007@gmail.com" 
          className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition"
          style={{
            backgroundColor: "#C5A56F",  // luxury gold from your website
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = "#bfa56b"} // slightly darker on hover
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#C5A56F"}
        >
          Join Us
        </a>
      </section>
    </div>
  );
}
