import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjW5fM824BIoJ9m85n_wDHNYPkZEoHPqg",
  authDomain: "joy-windsurf-4979a.firebaseapp.com",
  projectId: "joy-windsurf-4979a",
  storageBucket: "joy-windsurf-4979a.firebasestorage.app",
  messagingSenderId: "53925701804",
  appId: "1:53925701804:web:5742aa80e5b0d0043c1709"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
