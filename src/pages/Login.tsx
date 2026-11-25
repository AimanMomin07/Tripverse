import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const { loginEmail, signupEmail, loginGoogle, resetPassword, user } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const params = new URLSearchParams(window.location.search);
      const from = params.get('from_url') || '/';
      navigate(from);
    }
  }, [user]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      if (mode === 'login') await loginEmail(email, password);
      else await signupEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Auth error');
    }
  };

  const handleGoogle = async () => {
    try {
      await loginGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign-in error');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return setError('Please enter your email first');
    try {
      setError('');
      await resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Error sending password reset email');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side */}
      <div className="flex-1 bg-gradient-to-br from-primary to-accent flex flex-col justify-center items-center p-8 text-white">
        <div className="flex items-center gap-3 mb-6">
          <img src="/hero-images/logo.png.png" alt="TripVerse Logo" className="w-12 h-12 rounded-lg object-cover" />
          <h1 className="text-4xl font-bold">TripVerse</h1>
        </div>
        <p className="text-lg text-white/80 mb-6">
          Explore flights, plan trips, and book luxury adventures seamlessly.
        </p>
        <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80" alt="Travel illustration" className="rounded-xl shadow-lg w-full max-w-md h-auto" />
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-primary">Sign {mode === 'login' ? 'in' : 'up'}</h2>

          <form onSubmit={handleEmail} className="space-y-4">
            {/* Email input */}
            <div className="relative w-full">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full pr-10 p-3 rounded bg-gray-100 border border-gray-300" />
              <img src="/icons/mail.svg" alt="Email Icon" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>

            {/* Password input */}
            <div className="relative w-full">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full pr-10 p-3 rounded bg-gray-100 border border-gray-300" />
              <img src={showPassword ? '/icons/unlock.svg' : '/icons/lock.svg'} alt="Password Icon" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
            </div>

            {/* Forgot password */}
            {mode === 'login' && (
              <div className="text-right">
                <button type="button" onClick={handleForgotPassword} className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}

            <div className="flex justify-between items-center">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-sm text-primary hover:underline">
                Switch to {mode === 'login' ? 'Sign up' : 'Login'}
              </button>
              <button type="submit" className="btn bg-gold text-black font-semibold">
                {mode === 'login' ? 'Login' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="my-4 text-center text-gray-400">or</div>
          <button onClick={handleGoogle} className="btn bg-gray-100 text-black w-full flex items-center justify-center gap-2 py-2 rounded shadow">
            <img src="/icons/google.svg" alt="Google logo" className="w-5 h-5" />
            Continue with Google
          </button>
        </motion.div>
      </div>
    </div>
  );
}
