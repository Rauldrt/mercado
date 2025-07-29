// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "mercado-argentino-online",
  appId: "1:986534409565:web:2267108c210a31c98364b4",
  storageBucket: "mercado-argentino-online.firebasestorage.app",
  apiKey: "AIzaSyBHbCbynS3EIcHcU6Ib_iVEcNSh-K4rJDQ",
  authDomain: "mercado-argentino-online.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "986534409565",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
