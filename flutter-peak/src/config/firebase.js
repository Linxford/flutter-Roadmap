import { initializeApp } from 'firebase/app';
import { initializeFirestore, connectFirestoreEmulator, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBniVs7JGWrlMmr28Xi1R2cAdLV9nt9yFQ",
  authDomain: "jekeai.firebaseapp.com",
  projectId: "jekeai",
  storageBucket: "jekeai.firebasestorage.app",
  messagingSenderId: "387510047811",
  appId: "1:387510047811:web:7c2f357861a95c7fb330f6",
  measurementId: "G-M9NS858BJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
  cacheSizeBytes: 50 * 1024 * 1024 // 50 MB cache size
});

// Initialize other services
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

// Enable offline persistence for Firestore
try {
  enableMultiTabIndexedDbPersistence(db);
} catch (err) {
  console.warn('Persistence failed:', err);
}

// Set auth persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Auth persistence error:', error);
  });

// Enable emulators for development
if (process.env.NODE_ENV === 'development') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  } catch (err) {
    console.warn('Emulator connection failed:', err);
  }
}

export { db, auth, analytics, storage };

// Optional: Track page views
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    logEvent(analytics, 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  });
}

// Helper function for analytics events
export const logAnalyticsEvent = (eventName, eventParams = {}) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};
