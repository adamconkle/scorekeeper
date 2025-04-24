// ========== RESET SCORE FUNCTION ==========
function resetScore(buttonElement) {
  const playerForm = buttonElement.closest('.player-form');
  const scores = playerForm.querySelectorAll('input[type="number"]');
  scores.forEach(input => input.value = 0);
}

// ========== ADD PLAYER ==========
function addPlayer() {
  const playerIndex = document.querySelectorAll('.player-form').length;

  const playerForm = document.createElement('div');
  playerForm.classList.add('player-form');

  playerForm.innerHTML = `
    <input type="text" id="name${playerIndex + 1}" placeholder="Player ${playerIndex + 1} Name">
    <input type="number" inputmode="numeric" class="score" id="score${playerIndex + 1}_1" placeholder="0">
    <button class="resetScore" data-tooltip="Reset all scores to 0">&#8634;</button>
  `;

  const resetButton = playerForm.querySelector('.resetScore');
  resetButton.addEventListener('click', function () {
    resetScore(this);
  });

  document.getElementById("scores").appendChild(playerForm);
  setupDragEvents();
}

// ========== ADD SCORE COLUMN ==========
function addScoreColumn() {
  const allPlayers = document.querySelectorAll(".player-form");

  allPlayers.forEach((playerForm, playerIndex) => {
    const existingScores = playerForm.querySelectorAll('input[type="number"]');
    const newColIndex = existingScores.length + 1;
    const scoreId = `score${playerIndex + 1}_${newColIndex}`;

    const newScoreInput = document.createElement("input");
    newScoreInput.type = "number";
    newScoreInput.inputMode = "numeric";
    newScoreInput.id = scoreId;
    newScoreInput.classList.add("score");
    newScoreInput.placeholder = "0";

    const resetButton = playerForm.querySelector('.resetScore');
    playerForm.insertBefore(newScoreInput, resetButton);
  });

  setupDragEvents();
}

// ========== LIGHT/DARK MODE ==========
document.getElementById("lightDark").addEventListener("click", function () {
  document.body.classList.toggle("light-mode");
  this.textContent = document.body.classList.contains("light-mode") ? "☽" : "☀︎";
  applySavedBackground();
});

// ========== DRAG TO ADJUST SCORE ==========
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

let totalDelta = 0;
function adjustScore(input, delta) {
  totalDelta += delta;
  const threshold = 500;

  if (Math.abs(totalDelta) >= threshold) {
    let current = parseInt(input.value) || 0;
    current += totalDelta > 0 ? 1 : -1;
    input.value = current;
    totalDelta += totalDelta > 0 ? -threshold : threshold;
  }
}

// ========== RESET BUTTON INITIALIZER ==========
document.querySelectorAll('.resetScore').forEach(button => {
  button.addEventListener('click', function () {
    resetScore(this);
  });
});

// ========== CUSTOM BACKGROUND COLOR PICKER ==========
const bgColorPicker = document.getElementById("bgColorPicker");
const colorIcon = document.getElementById("colorIcon");

function applySavedBackground() {
  const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
  const savedColor = localStorage.getItem(`bgColor-${mode}`);
  if (savedColor) {
    document.body.style.backgroundColor = savedColor;
  } else {
    document.body.style.backgroundColor = mode === "light" ? "white" : "#121212";
  }
}

colorIcon.addEventListener("click", () => {
  bgColorPicker.click();
});

bgColorPicker.addEventListener("input", () => {
  const color = bgColorPicker.value;
  const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem(`bgColor-${mode}`, color);
  document.body.style.backgroundColor = color;
});

// ========== INITIAL SETUP ==========
applySavedBackground();
setupDragEvents();
