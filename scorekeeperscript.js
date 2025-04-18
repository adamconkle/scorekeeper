// Reset score
function resetScore(scoreId) {
  document.getElementById(scoreId).value = 0;
}

// Add a new player form dynamically
function addPlayer() {
  const playerCount = document.querySelectorAll('.player-form').length + 1;

  const playerForm = document.createElement('div');
  playerForm.classList.add('player-form');

  playerForm.innerHTML = `
    <input type="text" id="name${playerCount}" placeholder="Player ${playerCount} Name">
    <input type="number" inputmode="numeric" class="score" id="score${playerCount}" placeholder="0">
    <input type="reset" value="Reset" onclick="resetScore('score${playerCount}')">
  `;

  document.getElementById("scores").appendChild(playerForm);
  setupDragEvents(); // apply drag listeners to new input
}

// Light/Dark mode toggle
document.getElementById("lightDark").addEventListener("click", function () {
  document.body.classList.toggle("light-mode");
  this.textContent = document.body.classList.contains("light-mode") ? "☽" : "☀︎";
});

// Drag-to-adjust functionality
function setupDragEvents() {
  const scores = document.querySelectorAll(".score");
  scores.forEach(scoreInput => {
    let startY = null;
    let dragging = false;

    // Touch
    scoreInput.addEventListener("touchstart", e => {
      startY = e.touches[0].clientY;
    });

    scoreInput.addEventListener("touchmove", e => {
      if (startY === null) return;
      const currentY = e.touches[0].clientY;
      const delta = startY - currentY;
      adjustScore(scoreInput, delta);
      e.preventDefault();
    });

    scoreInput.addEventListener("touchend", () => {
      startY = null;
    });

    // Mouse
    scoreInput.addEventListener("mousedown", e => {
      dragging = true;
      startY = e.clientY;
    });

    document.addEventListener("mousemove", e => {
      if (!dragging || startY === null) return;
      const delta = startY - e.clientY;
      adjustScore(scoreInput, delta);
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
      startY = null;
    });
  });
}

function adjustScore(input, delta) {
  if (Math.abs(delta) >= 20) {
    let current = parseInt(input.value) || 0;
    current += delta > 0 ? 1 : -1;
    input.value = current;
    // reset base point so it increments smoothly
    if (delta > 0) startY -= 20;
    else startY += 20;
  }
}

// Setup drag events on page load
setupDragEvents();


// local storage up to 2 hours
// Save state to localStorage with timestamp
function saveToLocalStorage() {
  const players = [];
  document.querySelectorAll(".player-form").forEach((form, index) => {
    const name = form.querySelector(`#name${index + 1}`)?.value || "";
    const score = form.querySelector(`#score${index + 1}`)?.value || "0";
    players.push({ name, score });
  });

  const data = {
    players,
    timestamp: new Date().getTime()
  };

  localStorage.setItem("scorekeeperData", JSON.stringify(data));
}

// Load state from localStorage if not expired
function loadFromLocalStorage() {
  const stored = localStorage.getItem("scorekeeperData");
  if (!stored) return;

  const data = JSON.parse(stored);
  const now = new Date().getTime();

  // 2 hours = 2 * 60 * 60 * 1000 ms
  if (now - data.timestamp > 2 * 60 * 60 * 1000) {
    localStorage.removeItem("scorekeeperData");
    return;
  }

  data.players.forEach((player, index) => {
    if (index > 3) addPlayer();
    const nameInput = document.querySelector(`#name${index + 1}`);
    const scoreInput = document.querySelector(`#score${index + 1}`);
    if (nameInput) nameInput.value = player.name;
    if (scoreInput) scoreInput.value = player.score;
  });
}

// Save after score or name changes
document.addEventListener("input", () => {
  saveToLocalStorage();
});

// Load saved data on page load
window.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
});

