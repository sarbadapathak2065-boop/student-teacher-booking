// firebaseconfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDa9ueKKtuwRviWK6BWph0uCjSjCrjJV5Y",
  authDomain: "project-2-7a770.firebaseapp.com",
  projectId: "project-2-7a770",
  storageBucket: "project-2-7a770.appspot.com",
  messagingSenderId: "538945089257",
  appId: "1:538945089257:web:1b5b16626056a1fb400a78"
};

// initialize firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
