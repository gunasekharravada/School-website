import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
// 1. Import getFirestore from the Firestore SDK
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object
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

// Initialize Firebase Auth
const auth = getAuth(app);

// 2. Initialize Firestore Database
const db = getFirestore(app);

// Enable local persistence so Admin stays logged in on reload/tab close
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase auth persistence set to local successfully.");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// 3. Export db alongside app and auth
export { app, auth, db };