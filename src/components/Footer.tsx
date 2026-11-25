import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Footer() {
  const navigate = useNavigate();

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    show: boolean;
    isError: boolean;
    message: string;
  }>({
    show: false,
    isError: false,
    message: ''
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ show: false, isError: false, message: '' });

    try {
      await addDoc(collection(db, 'contactRequests'), {
        ...contactForm,
        timestamp: serverTimestamp(),
        status: 'new'
      });

      setContactForm({ name: '', email: '', phone: '' });
      setSubmitStatus({
        show: true,
        isError: false,
        message: '✓ Form submitted successfully! Our team will contact you within 24 hours.'
      });

      setTimeout(() => {
        setSubmitStatus(prev => ({ ...prev, show: false }));
      }, 8000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        show: true,
        isError: true,
        message: 'Failed to submit form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Scroll to top when a link is clicked
  const scrollAndNavigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };

  return (
    <footer className="bg-light-gray">
      <div className="container py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <img src="../hero-images/logo.png.png" alt="TripVerse" className="h-8 mb-6" />
            <p className="text-secondary mb-4">
              TripVerse, a leading name in group travel solutions, is registered under the Companies Act with registration number CIN: U63040MH2023PLC123456. Licensed by the Ministry of Tourism (License No: TRV/DEL/2023/0123).
            </p>
            <p className="text-secondary mb-4">
              Registered Office: Level 21, World Trade Centre, Cuffe Parade, Mumbai 400005, Maharashtra, India
            </p>
            <div className="flex gap-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com/tripverse`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-accent transition-colors"
                >
                  <img 
                    src={`/social/${social}.svg`} 
                    alt={social} 
                    className="w-5 h-5"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Destinations', path: '/destinations' },
                { name: 'Group Travel', path: '/group-travel' },
                { name: 'FAQs', path: '/faqs' }
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollAndNavigate(link.path)}
                    className="text-secondary hover:text-accent transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {[
                'Flight Booking',
                'Group Planning',
                'Seat Selection',
                'Split Payments',
                'Travel Insurance',
                'Customer Support'
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-secondary hover:text-accent transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Contact Us</h3>
            <div className="text-secondary mb-4">
              <p className="mb-2">Customer Support: 1800-123-4567</p>
              <p className="mb-2">Email: support@tripverse.com</p>
              <p>Corporate Sales: +91 22 6789 0123</p>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                value={contactForm.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full input"
                disabled={isSubmitting}
                required
              />
              <input
                type="email"
                name="email"
                value={contactForm.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full input"
                disabled={isSubmitting}
                required
              />
              <input
                type="tel"
                name="phone"
                value={contactForm.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full input"
                disabled={isSubmitting}
                required
              />
              {submitStatus.show && (
                <div className={`p-3 rounded-lg text-sm font-medium transform transition-all duration-300 ${
                  submitStatus.isError 
                    ? 'bg-red-50 text-red-600 border border-red-200' 
                    : 'bg-green-50 text-green-600 border border-green-200'
                }`}>
                  {submitStatus.message}
                </div>
              )}
              <button 
                type="submit" 
                className={`w-full btn btn-primary relative ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="opacity-0">Request Callback</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </>
                ) : 'Request Callback'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-secondary text-sm">
          <div className="mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} TripVerse. All rights reserved.</p>
            <p className="mt-1">GST No: 27AABCT1234D1Z5 | IATA Code: 12-3-4567</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Cookie Policy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Cancellation Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
