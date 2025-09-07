// app/lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration type
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAGBX0yubbF77Qh8GqHjBU79f8RQ0mSBMQ",
  authDomain: "hyperlab-school-320c3.firebaseapp.com",
  projectId: "hyperlab-school-320c3",
  storageBucket: "hyperlab-school-320c3.firebasestorage.app",
  messagingSenderId: "1051027855010",
  appId: "1:1051027855010:web:28f82e6cdb690df93429fb"
};

// Debug logging
console.log('Firebase initialization with project ID:', firebaseConfig.projectId);

// Initialize Firebase
let app: FirebaseApp;

// Initialize Firebase only once (singleton pattern)
if (!getApps().length) {
  console.log('Initializing new Firebase app');
  app = initializeApp(firebaseConfig);
} else {
  console.log('Using existing Firebase app');
  app = getApps()[0];
}

const db = getFirestore(app);
console.log('Firestore initialized');

export { db };