const nameEl = document.getElementById('name');
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const roleEl = document.getElementById('role');
const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const messageEl = document.getElementById('message');

const USERS_KEY = 'users';

function loadUsers() { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function setCurrentUser(user) { localStorage.setItem('currentUser', JSON.stringify(user)); }

function showMessage(text, color='green') {
  messageEl.innerText = text;
  messageEl.style.color = color;
  setTimeout(()=>{ messageEl.innerText=''; }, 2000);
}

// SIGNUP
signupBtn.addEventListener('click', ()=>{
  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const password = passwordEl.value;
  const role = roleEl.value;
  if(!name || !email || !password || password.length<6) {
    showMessage('Fill all fields. Password min 6 chars.', 'crimson');
    return;
  }
  const users = loadUsers();
  if(users.find(u=>u.email===email)) {
    showMessage('Email already exists.', 'crimson');
    return;
  }
  const newUser = { name, email, password, role };
  users.push(newUser); saveUsers(users); setCurrentUser(newUser);
  nameEl.value=''; emailEl.value=''; passwordEl.value='';
  showMessage('Signup successful!');
  setTimeout(()=>{ window.location.href='dashboard.html'; }, 1000);
});

// LOGIN
loginBtn.addEventListener('click', ()=>{
  const email = emailEl.value.trim();
  const password = passwordEl.value;
  const users = loadUsers();
  const user = users.find(u=>u.email===email && u.password===password);
  if(!user) { showMessage('Email or password incorrect.', 'crimson'); return; }
  setCurrentUser(user);
  nameEl.value=''; emailEl.value=''; passwordEl.value='';
  showMessage('Login successful!');
  setTimeout(()=>{ window.location.href='dashboard.html'; }, 1000);
});
