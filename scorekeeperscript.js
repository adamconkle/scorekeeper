// Change score manually
function changeScore(scoreId, increment) {
  const scoreInput = document.getElementById(scoreId);
  let currentScore = parseInt(scoreInput.value) || 0;
  currentScore += increment;
  scoreInput.value = currentScore;
}

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
    <button onclick="changeScore('score${playerCount}', 1)">+</button>
    <button onclick="changeScore('score${playerCount}', -1)">-</button>
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
