import { initializeApp, type FirebaseOptions } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const firebaseConfig: FirebaseOptions = {
  apiKey: requireEnv('VITE_FIREBASE_API_KEY', import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID', import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: requireEnv('VITE_FIREBASE_APP_ID', import.meta.env.VITE_FIREBASE_APP_ID)
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// Safe logout function
export const logout = async () => {
  try {
    await signOut(auth)
    window.location.href = '/login'
  } catch (err) {
    console.error('Logout error:', err)
  }
}

export default app
