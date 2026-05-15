let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// SAVE
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD TASK
function addNewTask() {
  let input = document.getElementById("taskInput");
  if (input.value === "") return;

  tasks.push({
    name: input.value,
    status: "toStart"
  });

  input.value = "";
  saveTasks();
  renderTasks();
}

// RENDER TASKS
function renderTasks() {
  let toStart = document.getElementById("toStart");
  let active = document.getElementById("active");
  let completed = document.getElementById("completed");

  if (!toStart) return;

  toStart.innerHTML = "";
  active.innerHTML = "";
  completed.innerHTML = "";

  tasks.forEach((task, index) => {
    let li = document.createElement("li");

    // TEXT + DELETE BUTTON
    li.innerHTML = `
      📌 ${task.name}
      <span onclick="deleteTask(${index})" style="color:red; float:right; cursor:pointer;">🗑</span>
    `;

    li.onclick = () => moveTask(index);

    if (task.status === "toStart") toStart.appendChild(li);
    else if (task.status === "active") active.appendChild(li);
    else completed.appendChild(li);
  });

  updateStats();
}

// MOVE TASK
function moveTask(index) {
  if (tasks[index].status === "toStart") {
    tasks[index].status = "active";
  }
  else if (tasks[index].status === "active") {
    tasks[index].status = "completed";
    // TRACK DAILY COMPLETION
    let today = new Date().toDateString();

    let stats = JSON.parse(localStorage.getItem("dailyStats")) || {};

    stats[today] = (stats[today] || 0) + 1;

    localStorage.setItem("dailyStats", JSON.stringify(stats));

    // 🎮 GIVE XP
    xp = parseInt(xp) + 10;

    // 🔼 LEVEL UP SYSTEM
    if (xp >= level * 50) {
      level++;
      alert("🎉 Level Up! You are now Level " + level);
    }

    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
  }

  saveTasks();
  renderTasks();
}

// DELETE TASK
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// UPDATE STATS
function updateStats() {
  let xpDisplay = document.getElementById("xpDisplay");
  let levelDisplay = document.getElementById("levelDisplay");

  if (xpDisplay) {
    xpDisplay.innerText = "✨ XP: " + xp;
    levelDisplay.innerText = "🚀 Level: " + level;
  }
}

updateStats();

// 🔥 IMPORTANT FIX
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  updateStats();
}
);
function showStreak() {
  let streakCount = document.getElementById("streakCount");

  if (streakCount) {
    streakCount.innerText = "🔥 Current Streak: " + streak;
  }
}

function restoreStreak() {
  alert("😈 Complete a HARD task today!");
  document.getElementById("streakActions").style.display = "none";
}

function resetStreak() {
  streak = 0;
  localStorage.setItem("streak", streak);
  showStreak();
}

// Run on load
document.addEventListener("DOMContentLoaded", () => {
  showStreak();
  renderGraph();
  loadProjects();
  loadTodayTasks();
});
// PROFILE SYSTEM

function selectAvatar(src) {
  document.getElementById("avatar").src = src;
  localStorage.setItem("avatar", src);
}

function saveProfile() {
  let name = document.getElementById("username").value;
  localStorage.setItem("username", name);
  displayProfile();
}

function displayProfile() {
  let name = localStorage.getItem("username");
  let avatar = localStorage.getItem("avatar");

  if (name) {
    document.getElementById("displayName").innerText = "👋 " + name;
  }

  if (avatar) {
    document.getElementById("avatar").src = avatar;
  }
}

document.addEventListener("DOMContentLoaded", displayProfile);
// CALENDAR SYSTEM

let currentDate = new Date();

function renderCalendar() {
  let calendar = document.getElementById("calendar");
  let monthYear = document.getElementById("monthYear");

  if (!calendar) return;

  calendar.innerHTML = "";

  let month = currentDate.getMonth();
  let year = currentDate.getFullYear();

  let firstDay = new Date(year, month, 1).getDay();
  let daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.innerText = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  // Empty spaces
  for (let i = 0; i < firstDay; i++) {
    let empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    let day = document.createElement("div");
    day.classList.add("day");
    day.innerText = i;

    let key = `${year}-${month}-${i}`;

    if (localStorage.getItem(key)) {
      day.classList.add("marked");
    }

    day.onclick = () => toggleMark(day, key);

    calendar.appendChild(day);
  }
}

function toggleMark(day, key) {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    day.classList.remove("marked");
  } else {
    localStorage.setItem(key, "marked");
    day.classList.add("marked");
  }
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

document.addEventListener("DOMContentLoaded", renderCalendar);
function showWelcome() {
  let name = localStorage.getItem("username");
  let msg = document.getElementById("welcomeMsg");

  if (msg) {
    msg.innerText = name
      ? "Ready to conquer your tasks, " + name + " 😈"
      : "Let’s get productive today 🚀";
  }
}

document.addEventListener("DOMContentLoaded", showWelcome);

//add graph
function renderGraph() {
  let graph = document.getElementById("graph");
  if (!graph) return;

  let stats = JSON.parse(localStorage.getItem("dailyStats")) || {};

  graph.innerHTML = "";

  let values = Object.values(stats).slice(-7);

  for (let i = 0; i < 7; i++) {
    let value = values[i] || 1;

    let bar = document.createElement("div");
    bar.classList.add("bar");

    bar.style.height = (value * 20) + "px";

    graph.appendChild(bar);
  }
}

//myprojects
function loadProjects() {
  let container = document.getElementById("projects");
  if (!container) return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  let projectTasks = tasks.filter(t => t.status === "toStart").slice(0, 5);

  container.innerHTML = "";

  projectTasks.forEach(task => {
    let div = document.createElement("div");
    div.className = "project-card";

    div.innerHTML = `📁<br>${task.name}`;

    div.onclick = () => {
      window.location.href = "task.html";
    };

    container.appendChild(div);
  });
}

//today's tasks
function loadTodayTasks() {
  let container = document.getElementById("todayTasks");
  if (!container) return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  let activeTasks = tasks.filter(t => t.status === "active");

  container.innerHTML = "";

  activeTasks.forEach(task => {
    let div = document.createElement("div");
    div.className = "project-card";

    div.innerHTML = `🔥<br>${task.name}`;

    div.onclick = () => {
      window.location.href = "task.html";
    };

    container.appendChild(div);
  });
}

//search tasks
function searchTasks() {
  let query = document.getElementById("searchInput").value.toLowerCase();

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  let results = tasks.filter(t => t.name.toLowerCase().includes(query));

  alert("Results:\n" + results.map(r => r.name).join("\n"));
}