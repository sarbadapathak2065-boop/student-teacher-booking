// ===== IMPORTS =====
import { app } from "./firebaseconfig.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc } 
  from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const db = getFirestore(app);

// ===== CREATE BOOKING (Student) =====
export async function showStudentBookingUI(studentId) {
  const bookingSection = document.getElementById("bookingSection");

  // Load all teachers for dropdown
  const usersSnap = await getDocs(collection(db, "users"));
  const teachers = [];
  usersSnap.forEach(doc => {
    const data = doc.data();
    if (data.role === "teacher") teachers.push({ id: doc.id, name: data.name });
  });

  let teacherOptions = teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join("");

  bookingSection.innerHTML = `
    <h3>Book a Session</h3>
    <select id="teacherSelect">
      <option value="">Select Teacher</option>
      ${teacherOptions}
    </select>
    <input type="date" id="bookingDate">
    <input type="time" id="bookingTime">
    <button id="createBookingBtn">Book Now</button>
    <div id="bookingList" style="margin-top:20px;"></div>
  `;

  document.getElementById("createBookingBtn").addEventListener("click", async () => {
    const teacherId = document.getElementById("teacherSelect").value;
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;

    if (!teacherId || !date || !time) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        studentId: studentId,
        teacherId: teacherId,
        date: date,
        time: time,
        status: "pending" // default status
      });
      alert("Booking created!");
      loadStudentBookings(studentId);
    } catch (error) {
      alert(error.message);
    }
  });

  loadStudentBookings(studentId);
}

// ===== LOAD STUDENT BOOKINGS =====
async function loadStudentBookings(studentId) {
  const bookingList = document.getElementById("bookingList");
  bookingList.innerHTML = "<h4>Your Bookings:</h4>";

  const q = query(collection(db, "bookings"), where("studentId", "==", studentId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    bookingList.innerHTML += "<p>No bookings yet.</p>";
    return;
  }

  for (const docItem of snapshot.docs) {
    const b = docItem.data();
    const teacherSnap = await getDocs(query(collection(db, "users"), where("__name__", "==", b.teacherId)));
    let teacherName = b.teacherId;
    teacherSnap.forEach(tDoc => { teacherName = tDoc.data().name; });

    // Color code
    let color = "yellow";
    if (b.status === "confirmed") color = "green";
    else if (b.status === "cancelled") color = "red";

    bookingList.innerHTML += `
      <div style="border:1px solid #fff; padding:8px; margin:5px; border-radius:6px; background: rgba(255,255,255,0.1); color:${color};">
        Teacher: ${teacherName} | Date: ${b.date} | Time: ${b.time} | Status: ${b.status}
      </div>
    `;
  }
}

// ===== TEACHER DASHBOARD =====
export async function showTeacherBookingUI(teacherId) {
  const bookingSection = document.getElementById("bookingSection");
  bookingSection.innerHTML = `<h3>Your Bookings</h3><div id="teacherBookingList"></div>`;
  loadTeacherBookings(teacherId);
}

// ===== LOAD TEACHER BOOKINGS =====
async function loadTeacherBookings(teacherId) {
  const bookingList = document.getElementById("teacherBookingList");
  bookingList.innerHTML = "";

  const q = query(collection(db, "bookings"), where("teacherId", "==", teacherId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    bookingList.innerHTML = "<p>No bookings yet.</p>";
    return;
  }

  for (const docItem of snapshot.docs) {
    const b = docItem.data();
    const docRef = doc(db, "bookings", docItem.id);

    const studentSnap = await getDocs(query(collection(db, "users"), where("__name__", "==", b.studentId)));
    let studentName = b.studentId;
    studentSnap.forEach(sDoc => { studentName = sDoc.data().name; });

    // Color code
    let color = "yellow";
    if (b.status === "confirmed") color = "green";
    else if (b.status === "cancelled") color = "red";

    bookingList.innerHTML += `
      <div style="border:1px solid #fff; padding:8px; margin:5px; border-radius:6px; background: rgba(255,255,255,0.1); color:${color}; display:flex; justify-content:space-between; align-items:center;">
        <span>Student: ${studentName} | Date: ${b.date} | Time: ${b.time} | Status: ${b.status}</span>
        <div>
          <button class="confirmBtn" data-id="${docItem.id}">Confirm</button>
          <button class="cancelBtn" data-id="${docItem.id}">Cancel</button>
        </div>
      </div>
    `;
  }

  // Add button listeners
  document.querySelectorAll(".confirmBtn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await updateDoc(doc(db, "bookings", id), { status: "confirmed" });
      loadTeacherBookings(teacherId);
    });
  });

  document.querySelectorAll(".cancelBtn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await updateDoc(doc(db, "bookings", id), { status: "cancelled" });
      loadTeacherBookings(teacherId);
    });
  });
}
