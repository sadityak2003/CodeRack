// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQOFQK0sjJAAo7tzwmovSUmT9z_WEJ1zE",
  authDomain: "px45-dc192.firebaseapp.com",
  projectId: "px45-dc192",
  storageBucket: "px45-dc192.firebasestorage.app",
  messagingSenderId: "614675499604",
  appId: "1:614675499604:web:d895d2e89a768af4367bc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };