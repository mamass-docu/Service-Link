import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOndErzcVbIpf6NWvacPQuv35rJnJ8VNs",
  authDomain: "servicelink-d960c.firebaseapp.com",
  projectId: "servicelink-d960c",
  storageBucket: "servicelink-d960c.firebasestorage.app",
  messagingSenderId: "780467063427",
  appId: "1:780467063427:web:65e0e758052f85d0cca9b6",
  databaseURL: "https://servicelink-d960c-default-rtdb.firebaseio.com", // Add this if you have Realtime Database
};

const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

const auth = getAuth(app);

const db = getFirestore(app);

export { db, auth };
