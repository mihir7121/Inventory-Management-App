// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVtLhhjx-1obK7h1At594v_HawNo7l4Do",
  authDomain: "inventory-management-app-f0bbd.firebaseapp.com",
  projectId: "inventory-management-app-f0bbd",
  storageBucket: "inventory-management-app-f0bbd.appspot.com",
  messagingSenderId: "1053219634348",
  appId: "1:1053219634348:web:fb1805ba0afc34a0a5f309",
  measurementId: "G-2RS6CJPX5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };