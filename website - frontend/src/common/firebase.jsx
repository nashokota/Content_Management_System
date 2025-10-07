// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHQHmXfRFNm0rDWW2DV78RL3cYZwPrpz0",
  authDomain: "cms-website-a771e.firebaseapp.com",
  projectId: "cms-website-a771e",
  storageBucket: "cms-website-a771e.firebasestorage.app",
  messagingSenderId: "267817048623",
  appId: "1:267817048623:web:7812ac521cf2c399a404da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Googgle authentication
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () =>{
    let user = null;

    await signInWithPopup(auth, provider).then((result) => {
        user = result.user;
    }).catch((error) => {
        console.log(error);
    });

    return user;
}