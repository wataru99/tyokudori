import { initializeApp, getApps, getApp } from 'firebase/app'
import type { Firestore } from 'firebase/firestore'
import type { FirebaseStorage } from 'firebase/storage'
import type { Auth } from 'firebase/auth'
import type { Database } from 'firebase/database'
import type { Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyCaNNE51TpuT5oFtq8rkPHfOBtV1Lpa_aY",
  authDomain: "tyokudori-1f66a.firebaseapp.com",
  databaseURL: "https://tyokudori-1f66a-default-rtdb.firebaseio.com",
  projectId: "tyokudori-1f66a",
  storageBucket: "tyokudori-1f66a.firebasestorage.app",
  messagingSenderId: "220130072022",
  appId: "1:220130072022:web:f2cc5bd1f08ca51ef50077",
  measurementId: "G-8XKNTKRT1K"
}

// Initialize Firebase app only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Lazy-loaded Firebase services
let _db: Firestore | null = null
let _rtdb: Database | null = null
let _storage: FirebaseStorage | null = null
let _auth: Auth | null = null
let _analytics: Analytics | null = null

// Lazy getters for Firebase services
export const getDb = async () => {
  if (!_db) {
    const { getFirestore } = await import('firebase/firestore')
    _db = getFirestore(app)
  }
  return _db
}

export const getRtdb = async () => {
  if (!_rtdb) {
    const { getDatabase } = await import('firebase/database')
    _rtdb = getDatabase(app)
  }
  return _rtdb
}

export const getStorageService = async () => {
  if (!_storage) {
    const { getStorage } = await import('firebase/storage')
    _storage = getStorage(app)
  }
  return _storage
}

export const getAuthService = async () => {
  if (!_auth) {
    const { getAuth } = await import('firebase/auth')
    _auth = getAuth(app)
  }
  return _auth
}

export const getAnalyticsService = async () => {
  if (!_analytics && typeof window !== 'undefined') {
    const { getAnalytics, isSupported } = await import('firebase/analytics')
    const supported = await isSupported()
    if (supported) {
      _analytics = getAnalytics(app)
    }
  }
  return _analytics
}

// For backward compatibility - these will be removed in future
export const db = null as any
export const rtdb = null as any
export const storage = null as any
export const auth = null as any
export const analytics = null as any

export default app