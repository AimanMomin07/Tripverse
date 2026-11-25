import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Flights from './pages/Flights';
import FlightDetails from './pages/FlightDetails';
import About from './pages/About';
import Support from './pages/Support';
import Destinations from './pages/Destinations';
import GroupTravel from './pages/GroupTravel';
import FAQs from './pages/FAQs';
import PackageDetails from './pages/PackageDetails';
import MyTrips from './pages/MyTrips';
import Login from './pages/Login';
import DestinationDetail from './pages/DestinationDetails';
import Header from './components/Header';
import AIPlanner from './pages/AIPlanner';
import Footer from './components/Footer';
import Onboarding from './components/Onboarding';
import { useAuth } from './auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebase';

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Checking login...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (!snap.exists() || !snap.data()?.onboardingCompleted) {
          setShowOnboarding(true);
        } else {
          setShowOnboarding(false);
        }
      } catch (err) {
        console.error('Error checking onboarding:', err);
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [user]);

  if (loading || checkingOnboarding)
    return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const showLayout = location.pathname !== '/login';

  return (
    <div className="min-h-screen flex flex-col app-glass">
      {showLayout && <Header />}

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Protected><Home /></Protected>} />
            <Route path="/flights" element={<Protected><Flights /></Protected>} />
            <Route path="/flights/:id" element={<Protected><FlightDetails /></Protected>} />
            <Route path="/my-trips" element={<Protected><MyTrips /></Protected>} />
            <Route path="/ai-planner" element={<Protected><AIPlanner /></Protected>} />
            <Route path="/about" element={<Protected><About /></Protected>} />
            <Route path="/support" element={<Protected><Support /></Protected>} />
            <Route path="/destinations" element={<Protected><Destinations /></Protected>} />
            <Route path="/group-travel" element={<Protected><GroupTravel /></Protected>} />
            <Route path="/faqs" element={<Protected><FAQs /></Protected>} />
            <Route path="/PackageDetails" element={<Protected><PackageDetails /></Protected>} />

            {/* New Destination Detail Route */}
            <Route path="/destination" element={<Protected><DestinationDetail /></Protected>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {showLayout && <Footer />}
      {showOnboarding && <Onboarding open={showOnboarding} onClose={() => setShowOnboarding(false)} />}
    </div>
  );
}
