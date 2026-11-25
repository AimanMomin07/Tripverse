import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQs() {
  const faqs = [
    { question: "How do I book a flight?", answer: "You can search for your desired destination and dates, then select your flight and complete payment securely." },
    { question: "Can I split payments for a group?", answer: "Yes! TripVerse allows seamless split payments for group bookings." },
    { question: "Do you offer travel packages?", answer: "Yes, we offer curated travel packages including flights, hotels, and activities." },
    { question: "How can I cancel or modify my booking?", answer: "You can cancel or modify your bookings through your TripVerse account. Policies depend on airline and hotel rules." },
    { question: "Is my payment secure?", answer: "Absolutely! We use secure payment gateways with industry-standard encryption to protect your data." }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container py-20">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <p className="text-secondary mb-12">Find answers to the most common questions about TripVerse and group travel.</p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="border rounded-xl p-5 cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{faq.question}</h3>
              <span className="text-[#C5A56F] text-2xl">{openIndex === index ? "−" : "+"}</span>
            </div>
            <AnimatePresence>
              {openIndex === index && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 text-secondary"
                >
                  {faq.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
