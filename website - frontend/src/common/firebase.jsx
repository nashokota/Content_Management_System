// src/common/firebase.jsx
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHQHmXfRFNm0rDWW2DV78RL3cYZwPrpz0",
  authDomain: "cms-website-a771e.firebaseapp.com",
  projectId: "cms-website-a771e",
  storageBucket: "cms-website-a771e.firebasestorage.app",
  messagingSenderId: "267817048623",
  appId: "1:267817048623:web:7812ac521cf2c399a404da"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app); // ✅ Pass app

export const authWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken(); // ✅ Get ID token
    return { idToken }; // ✅ Return only what you need
  } catch (error) {
    console.error("Google sign-in error:", error);
    return null;
  }
};