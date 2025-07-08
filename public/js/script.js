// ==== TYPEWRITER EFFECT ====
const typeEl = document.querySelector(".typewriter");
const phrases = typeEl.getAttribute("data-text").split("||");

let i = 0, j = 0, current = "", isDeleting = false;

function typeLoop() {
  typeEl.innerHTML = current;

  if (!isDeleting && j <= phrases[i].length) {
    current = phrases[i].substring(0, j++);
  } else if (isDeleting && j >= 0) {
    current = phrases[i].substring(0, j--);
  }

  if (j === phrases[i].length + 1) isDeleting = true;
  if (j < 0) {
    isDeleting = false;
    i = (i + 1) % phrases.length;
  }

  setTimeout(typeLoop, isDeleting ? 50 : 100);
}

typeLoop();



// ==== LIGHTBOX for carousel ====
document.querySelectorAll('.carousel-img').forEach(img => {
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top:0; left:0; width:100%; height:100%;
      background: rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:9999;
    `;
    const bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.style.cssText = 'max-width:90%; max-height:90%; border-radius:10px;';
    overlay.appendChild(bigImg);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
  });
});



// ==== FILTER DEPARTMENTS ====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const dept = btn.getAttribute('data-dept');
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.course-card').forEach(card => {
      if (dept === 'all' || card.dataset.dept === dept) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ==== COURSE MODAL POPUP ====
const modal = document.getElementById('courseModal');
const modalTitle = document.getElementById('modalTitle');
const modalFaculty = document.getElementById('modalFaculty');
const modalSyllabus = document.getElementById('modalSyllabus');
const closeModal = document.querySelector('.modal-close');

document.querySelectorAll('.view-course').forEach(btn => {
  btn.addEventListener('click', () => {
    modalTitle.textContent = btn.dataset.title;
    modalFaculty.textContent = btn.dataset.faculty;
    modalSyllabus.textContent = btn.dataset.syllabus;
    modal.style.display = 'flex';
  });
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});




// ==== ELIGIBILITY CHECKER ====
document.getElementById('eligibilityForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const marks = parseFloat(document.getElementById('marks').value);
  const result = document.getElementById('eligibilityResult');
  result.textContent = marks >= 60
    ? "✅ You are eligible to apply!"
    : "❌ Minimum 60% required for admission.";
});

// ==== FEE CALCULATOR ====
document.getElementById('feeForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const years = parseInt(document.getElementById('years').value);
  const fee = parseFloat(document.getElementById('feePerYear').value);
  const total = years * fee;
  document.getElementById('feeResult').textContent = `Total Fee: ₹${total.toLocaleString()}`;
});

// ==== SCHOLARSHIP COUNTDOWN ====
const countdownEl = document.getElementById("countdown");
const deadline = new Date(document.getElementById("deadline").textContent).getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const gap = deadline - now;

  if (gap < 0) {
    countdownEl.textContent = "⛔ Deadline passed!";
    return;
  }

  const days = Math.floor(gap / (1000 * 60 * 60 * 24));
  const hours = Math.floor((gap / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((gap / (1000 * 60)) % 60);
  const secs = Math.floor((gap / 1000) % 60);

  countdownEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
}
setInterval(updateCountdown, 1000);
updateCountdown();


// === ROLE-BASED LOGIN (REAL) ===
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    document.getElementById("loginForm").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("userRole").textContent = data.role.toUpperCase();
    loadDashboard(data.role);
  } else {
    document.getElementById("loginStatus").textContent = data.msg || "Login failed.";
  }
});

// === Logout Cleanup ===
function logout() {
  localStorage.clear();
  document.getElementById("loginForm").reset();
  document.getElementById("loginForm").style.display = "flex";
  document.getElementById("dashboard").style.display = "none";
}


function loadDashboard(role) {
  const dashboardContent = document.getElementById("dashboardContent");
  dashboardContent.innerHTML = "";

  if (role === "student") {
    dashboardContent.innerHTML = `
      <ul>
        <li>📚 My Courses</li>
        <li>📈 Grades</li>
        <li>📅 Attendance Tracker</li>
        <li>🔔 Notifications</li>
      </ul>
    `;
  } else if (role === "faculty") {
    dashboardContent.innerHTML = `
      <ul>
        <li>👥 Class Rosters</li>
        <li>📤 Submit Grades</li>
        <li>📢 Post Notices</li>
      </ul>
    `;
  } else if (role === "admin") {
    dashboardContent.innerHTML = `
      <ul>
        <li>👤 User Management</li>
        <li>⚙️ System Settings</li>
        <li>📡 Logs & Reports</li>
      </ul>
    `;
  }
}

function logout() {
  document.getElementById("loginForm").reset();
  document.getElementById("loginForm").style.display = "flex";
  document.getElementById("dashboard").style.display = "none";
}



// ==== DIRECTORY SEARCH ====
const directoryData = [
  { name: "Prof. Meena", room: "Lab 101", type: "faculty" },
  { name: "Dr. Arjun Singh", room: "Admin Office", type: "admin" },
  { name: "AI Robotics Lab", room: "Block C", type: "lab" },
];

document.getElementById("directorySearch").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const results = directoryData.filter(entry =>
    entry.name.toLowerCase().includes(query) ||
    entry.room.toLowerCase().includes(query)
  );
  const resultList = document.getElementById("directoryResults");
  resultList.innerHTML = results.map(r => `<li>${r.name} - ${r.room}</li>`).join('') || "<li>No match found</li>";
});

// ==== ROLL NUMBER VERIFIER ====
const validRolls = ["ENG2301", "SCI2212", "AI2455"];

function verifyRoll() {
  const input = document.getElementById("rollInput").value.trim().toUpperCase();
  const result = document.getElementById("rollResult");
  if (validRolls.includes(input)) {
    result.textContent = "✅ Roll Number is valid!";
  } else {
    result.textContent = "❌ Invalid Roll Number.";
  }
}

// ==== FEEDBACK FORM ====
document.getElementById("feedbackForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("userName").value.trim();
  const feedback = document.getElementById("userFeedback").value.trim();

  // (Future) Send to MongoDB
  console.log("Feedback Submitted:", name, feedback);
  document.getElementById("feedbackMsg").textContent = "✅ Thank you for your feedback!";
  this.reset();
});

// ==== AI CHATBOT (frontend only) ====
function sendChat() {
  const input = document.getElementById("chatInput");
  const chat = input.value.trim();
  if (!chat) return;

  const display = document.getElementById("chatDisplay");
  display.innerHTML += `<p class="user">${chat}</p>`;

  let reply = "🤖 I'm still learning. Please contact support.";

  if (chat.toLowerCase().includes("fee")) reply = "💰 You can use the fee calculator in the Admissions section.";
  else if (chat.toLowerCase().includes("apply")) reply = "📝 Visit the Admissions Hub to apply for courses.";
  else if (chat.toLowerCase().includes("result")) reply = "📊 Use the Result Verifier tool above.";

  display.innerHTML += `<p class="bot">${reply}</p>`;
  input.value = "";
  display.scrollTop = display.scrollHeight;
}

// === SUBMIT FEEDBACK TO BACKEND ===
document.getElementById("feedbackForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = document.getElementById("userName").value.trim();
  const message = document.getElementById("userFeedback").value.trim();

  const res = await fetch("http://localhost:5000/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message })
  });

  const data = await res.json();
  document.getElementById("feedbackMsg").textContent = data.msg || "Feedback submitted!";
  this.reset();
});



// === SUBMIT CONTACT TO BACKEND ===
document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const [name, email, message] = Array.from(this.elements).map(el => el.value.trim());

  const res = await fetch("http://localhost:5000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message })
  });

  const data = await res.json();
  alert(data.msg || "Message sent!");
  this.reset();
});


const jwt = require("jsonwebtoken");

// Middleware to verify admin
function isAdmin(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ msg: "Access denied" });
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

// GET All Users (Admin Only)
router.get("/users", isAdmin, async (req, res) => {
  const users = await User.find({}, { password: 0 }); // exclude password
  res.json(users);
});



function loadDashboard(role) {
  if (role === "admin") {
    document.getElementById("adminPanel").style.display = "block";
  }
}



const token = localStorage.getItem("token");

async function loadUsers() {
  const res = await fetch("http://localhost:5000/api/auth/users", {
    headers: { Authorization: token }
  });
  const users = await res.json();
  showAdminData("Users", users);
}

async function loadFeedbacks() {
  const res = await fetch("http://localhost:5000/api/feedback");
  const data = await res.json();
  showAdminData("Feedback", data);
}

async function loadContacts() {
  const res = await fetch("http://localhost:5000/api/contact");
  const data = await res.json();
  showAdminData("Contact Messages", data);
}

function showAdminData(title, data) {
  const out = document.getElementById("adminOutput");
  out.innerHTML = `<h4>${title}</h4><ul>` + 
    data.map(d => `<li>${JSON.stringify(d)}</li>`).join('') +
    `</ul>`;
}



// === NEW: Verify Result from DB ===
async function verifyRoll() {
  const roll = document.getElementById("rollInput").value.trim().toUpperCase();
  const output = document.getElementById("rollResult");
  output.innerHTML = "⏳ Fetching...";

  const res = await fetch(`http://localhost:5000/api/results/${roll}`);
  const data = await res.json();

  if (data.msg === "Result not found") {
    output.innerHTML = "❌ No result found.";
  } else {
    output.innerHTML = `
      <strong>Name:</strong> ${data.name}<br>
      <strong>Department:</strong> ${data.department}<br>
      <strong>Marks:</strong> ${data.marks}<br>
      <strong>Grade:</strong> ${data.grade}<br>
      <strong>Status:</strong> ${data.status}
    `;
  }
}


document.getElementById("uploadResultForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const result = {
    roll: document.getElementById("resRoll").value.toUpperCase(),
    name: document.getElementById("resName").value,
    department: document.getElementById("resDept").value,
    marks: document.getElementById("resMarks").value,
    grade: document.getElementById("resGrade").value,
    status: document.getElementById("resStatus").value
  };

  const res = await fetch("http://localhost:5000/api/results", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify(result)
  });

  const data = await res.json();
  document.getElementById("uploadStatus").textContent = data.msg || "Uploaded!";
  this.reset();
});
