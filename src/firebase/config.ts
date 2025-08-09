// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSrdDb_U6IEvbfeKG7593L87Olb-fAH1Q",
  authDomain: "nuimovelfree.firebaseapp.com",
  projectId: "nuimovelfree",
  storageBucket: "nuimovelfree.firebasestorage.app",
  messagingSenderId: "17777913327",
  appId: "1:17777913327:web:1fb623d28821540f30da1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;