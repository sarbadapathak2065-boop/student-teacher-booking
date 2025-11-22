const dashboardContent = document.getElementById('dashboardContent');
const bookingSelect = document.getElementById('bookingSelect');
const timeInput = document.getElementById('timeInput');
const bookBtn = document.getElementById('bookBtn');
const logoutBtn = document.getElementById('logoutBtn');
const messageEl = document.getElementById('message');

const BOOKINGS_KEY = 'bookings';

function getCurrentUser() { return JSON.parse(localStorage.getItem('currentUser')); }
function clearCurrentUser() { localStorage.removeItem('currentUser'); }

function renderBookings(){
  const user = getCurrentUser();
  const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY))||[];
  const userBookings = bookings.filter(b => b.userEmail === user.email);
  messageEl.innerText = userBookings.length ? `Your bookings: ${userBookings.map(b=>b.with+' at '+b.time).join(' | ')}` : 'No bookings yet.';
}

function showDashboard(){
  const user = getCurrentUser();
  if(!user){ window.location.href='index.html'; return; }

  dashboardContent.innerHTML=`<p>Welcome, ${user.name} (${user.role})</p>`;
  bookingSelect.innerHTML='<option value="">--Select--</option>';
  if(user.role==='student') ['Teacher A','Teacher B','Teacher C'].forEach(t=>{
      const opt=document.createElement('option'); opt.value=t; opt.innerText=t; bookingSelect.appendChild(opt);
  });
  else ['Student A','Student B','Student C'].forEach(s=>{
      const opt=document.createElement('option'); opt.value=s; opt.innerText=s; bookingSelect.appendChild(opt);
  });
  renderBookings();
}

bookBtn.onclick = () => {
  const selected = bookingSelect.value;
  const time = timeInput.value.trim();
  const user = getCurrentUser();
  if(!selected||!time) return;
  const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY))||[];
  bookings.push({userEmail:user.email,with:selected,time});
  localStorage.setItem(BOOKINGS_KEY,JSON.stringify(bookings));
  bookingSelect.value=''; timeInput.value='';
  renderBookings();
};

logoutBtn.onclick = () => { clearCurrentUser(); window.location.href='index.html'; };

showDashboard();
