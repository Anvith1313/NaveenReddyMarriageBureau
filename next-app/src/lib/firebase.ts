'use client'

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDWg8XpuuQGp-aPYMW-ESiUh74Gj-hdKHg',
  authDomain: 'reddy-elite-matrimony.firebaseapp.com',
  databaseURL: 'https://reddy-elite-matrimony-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'reddy-elite-matrimony',
  storageBucket: 'reddy-elite-matrimony.firebasestorage.app',
  messagingSenderId: '178761286445',
  appId: '1:178761286445:web:c83d9456a359565e3649a4',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const rtdb = getDatabase(app)
export const storage = getStorage(app)
