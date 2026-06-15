// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfM7Bkzxs1iZ8XIddgXRoytbZqAS00fLc",
  authDomain: "vidayalaya-8fbf7.firebaseapp.com",
  projectId: "vidayalaya-8fbf7",
  storageBucket: "vidayalaya-8fbf7.firebasestorage.app",
  messagingSenderId: "554707773483",
  appId: "1:554707773483:web:9c4164a08e07fe21dbe26e",
  measurementId: "G-QC2N4LH4TE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);