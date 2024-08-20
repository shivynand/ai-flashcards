// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdgUpXKuRtXGnf3kZTKctnbdtg_CX-ELY",
  authDomain: "ai-flashcards-1a633.firebaseapp.com",
  projectId: "ai-flashcards-1a633",
  storageBucket: "ai-flashcards-1a633.appspot.com",
  messagingSenderId: "535241623714",
  appId: "1:535241623714:web:009e25ee0b4cbed0eeeffb",
  measurementId: "G-KDYMS341NE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export {db}