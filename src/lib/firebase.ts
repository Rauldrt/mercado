// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "mercado-argentino-online",
  "appId": "1:986534409565:web:2267108c210a31c98364b4",
  "storageBucket": "mercado-argentino-online.firebasestorage.app",
  "apiKey": "AIzaSyBHbCbynS3EIcHcU6Ib_iVEcNSh-K4rJDQ",
  "authDomain": "mercado-argentino-online.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "986534409565"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
