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
    <button class="resetScore" onclick="resetScore('score${playerCount}')" data-tooltip="Reset score to 0">🔄</button>
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

// function for adjusting score
let lastY = null;
let totalDelta = 0;

function adjustScore(input, delta) {
  totalDelta += delta;

  const threshold = 1000; // less sensitive

  if (Math.abs(totalDelta) >= threshold) {
    let current = parseInt(input.value) || 0;
    current += totalDelta > 0 ? 1 : -1;
    input.value = current;

    // Reduce the accumulated delta by threshold amount
    totalDelta += totalDelta > 0 ? -threshold : threshold;
  }
}


// Setup drag events on page load
setupDragEvents();


// show arrows on focus
function showArrows(input) {
  input.parentElement.classList.add("focused");
}

function hideArrows(input) {
  // Delay to allow button click before hiding
  setTimeout(() => {
    input.parentElement.classList.remove("focused");
  }, 200);
}

function adjustScoreById(id, delta) {
  const input = document.getElementById(id);
  let value = parseInt(input.value) || 0;
  input.value = value + delta;
}
