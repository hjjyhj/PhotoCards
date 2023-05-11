// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeX833jwqc8crsWomX7IZMyqLTVG05c3E",
  authDomain: "gallery-app-69311.firebaseapp.com",
  projectId: "gallery-app-69311",
  storageBucket: "gallery-app-69311.appspot.com",
  messagingSenderId: "564204691920",
  appId: "1:564204691920:web:fa31ce9d1229b6312459d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);