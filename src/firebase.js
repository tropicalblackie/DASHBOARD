import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxSnYrqZfIj1Sk78OH-E9XMxQiLDnBasI",
  authDomain: "elekta-re.firebaseapp.com",
  projectId: "elekta-re",
  storageBucket: "elekta-re.firebasestorage.app",
  messagingSenderId: "362885007697",
  appId: "1:362885007697:web:f3fb38b0c46626f1a36b70",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
