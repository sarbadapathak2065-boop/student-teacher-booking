// firebaseconfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDa9ueKKtuwRviWK6BWph0uCjSjCrjJV5Y",
  authDomain: "project-2-7a770.firebaseapp.com",
  projectId: "project-2-7a770",
  storageBucket: "project-2-7a770.firebasestorage.app",
  messagingSenderId: "538945089257",
  appId: "1:538945089257:web:1b5b16626056a1fb400a78",
  measurementId: "G-CK8DJZE21W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
