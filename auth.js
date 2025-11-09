// ===== IMPORTS =====
import { app } from "./firebaseconfig.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDocs, 
  collection 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ===== INIT FIREBASE =====
const auth = getAuth(app);
const db = getFirestore(app);

// ===== SIGN UP =====
export async function signUp(name, email, password, role) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save extra info to Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      role: role
    });

    // Show Thank You message and stop auto-login
    showThankYouMessage(name);

  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("This email is already registered. Please log in instead.");
    } else {
      alert(error.message);
    }
  }
}

// ===== SHOW THANK YOU MESSAGE =====
function showThankYouMessage(name) {
  const signupSection = document.getElementById("signupSection");
  signupSection.innerHTML = `
    <h3>Thank you for signing up, ${name}!</h3>
    <p>You can now log in using your email and password.</p>
    <button id="goToLoginBtn">Go to Log In</button>
  `;

  // When clicked, show login form
  document.getElementById("goToLoginBtn").addEventListener("click", () => {
    signupSection.style.display = "none";
    document.getElementById("loginSection").style.display = "block";
  });
}

// ===== LOG IN =====
export async function logIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    showDashboard(user.uid);
  } catch (error) {
    alert(error.message);
  }
}

// ===== LOG OUT =====
export async function logOut() {
  try {
    await signOut(auth);
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("signupSection").style.display = "block";
  } catch (error) {
    alert(error.message);
  }
}

// ===== TRACK AUTH STATE =====
onAuthStateChanged(auth, (user) => {
  if (user) {
    showDashboard(user.uid);
  } else {
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("signupSection").style.display = "block";
  }
});

// ===== SHOW DASHBOARD =====
async function showDashboard(uid) {
  const docSnap = await getDocs(collection(db, "users"));
  let currentUser = null;
  docSnap.forEach((doc) => {
    if (doc.id === uid) currentUser = doc.data();
  });

  if (!currentUser) return;

  document.getElementById("dashboard").style.display = "block";
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("signupSection").style.display = "none";

  const dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = `<h2>Welcome, ${currentUser.name}!</h2>
                         <p>Role: ${currentUser.role}</p>
                         <div id="bookingSection" style="margin-top:20px;"></div>
                         <button id="logoutBtn">Log Out</button>`;

  // Attach logout button
  document.getElementById("logoutBtn").addEventListener("click", logOut);

  // Load booking UI depending on role
  if (currentUser.role === "student") {
    import("./firestore.js").then(module => module.showStudentBookingUI(uid));
  } else {
    import("./firestore.js").then(module => module.showTeacherBookingUI(uid));
  }
}

// ===== BUTTON EVENT LISTENERS =====
document.getElementById("signupBtn").addEventListener("click", () => {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const role = document.getElementById("signupRole").value;
  signUp(name, email, password, role);
});

document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  logIn(email, password);
});
