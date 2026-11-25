import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { googleProvider } from '../firebase/firebase';

type User = any;

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  loginEmail: (email: string, password: string) => Promise<any>;
  signupEmail: (email: string, password: string) => Promise<any>;
  loginGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginEmail = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const signupEmail = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  const loginGoogle = () => signInWithPopup(auth, googleProvider);

  const logout = () => signOut(auth);

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider value={{ user, loading, loginEmail, signupEmail, loginGoogle, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
