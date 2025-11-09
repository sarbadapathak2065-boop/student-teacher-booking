// ===== IMPORTS =====
import { app } from "./firebaseconfig.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } 
  from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

// ===== SIGN UP =====
export async function signUp(name, email, password, role) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), { name, email, role });

    // Go straight to dashboard
    showDashboard(user.uid);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("Email already registered. Please login.");
      document.getElementById("signupSection").style.display = "none";
      document.getElementById("loginSection").style.display = "block";
    } else {
      alert(error.message);
    }
  }
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
  await signOut(auth);
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("signupSection").style.display = "block";
  document.getElementById("loginSection").style.display = "none";
}

// ===== AUTH STATE =====
onAuthStateChanged(auth, (user) => {
  if (user) showDashboard(user.uid);
});

// ===== DASHBOARD =====
async function showDashboard(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return;

  const userData = userDoc.data();

  // Hide signup/login
  document.getElementById("signupSection").style.display = "none";
  document.getElementById("loginSection").style.display = "none";

  const dash = document.getElementById("dashboard");
  dash.style.display = "block";
  dash.innerHTML = `
    <h2>Welcome, ${userData.name}!</h2>
    <p>Role: ${userData.role}</p>
    <div id="bookingSection"></div>
    <button id="logoutBtn">Log Out</button>
  `;

  document.getElementById("logoutBtn").addEventListener("click", logOut);

  // Load booking UI depending on role
  if (userData.role === "student") {
    import("./firestore.js").then(module => module.showStudentBookingUI(uid));
  } else {
    import("./firestore.js").then(module => module.showTeacherBookingUI(uid));
  }
}

// ===== BUTTON LISTENERS =====
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
