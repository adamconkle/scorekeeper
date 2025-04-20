function resetScore(buttonElement) {
  const playerForm = buttonElement.closest('.player-form');
  const scores = playerForm.querySelectorAll('input[type="number"]');
  scores.forEach(input => input.value = 0);
}

function addPlayer() {
  const playerIndex = document.querySelectorAll('.player-form').length + 1;

  const playerForm = document.createElement('div');
  playerForm.classList.add('player-form');

  playerForm.innerHTML = `
    <input type="text" id="name${playerIndex}" placeholder="Player ${playerIndex} Name">
    <input type="number" inputmode="numeric" class="score" id="score${playerIndex}_1" placeholder="0">
    <button class="resetScore" data-tooltip="Reset all scores to 0">&#8634;</button>
  `;

  const resetButton = playerForm.querySelector('.resetScore');
  resetButton.addEventListener('click', function () {
    resetScore(this);
  });

  document.getElementById("scores").appendChild(playerForm);
  setupDragEvents();
}

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

// Light/Dark toggle
document.getElementById("lightDark").addEventListener("click", function () {
  document.body.classList.toggle("light-mode");
  this.textContent = document.body.classList.contains("light-mode") ? "☽" : "☀︎";
  applySavedBackground();
});

// Background color picker
const colorWheelTrigger = document.getElementById("colorWheelTrigger");
const bgColorPicker = document.getElementById("bgColorPicker");

colorWheelTrigger.addEventListener("click", () => {
  bgColorPicker.click();
});

bgColorPicker.addEventListener("input", (e) => {
  const color = e.target.value;
  const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem(`bgColor-${mode}`, color);
  document.body.style.backgroundColor = color;
});

function applySavedBackground() {
  const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
  const savedColor = localStorage.getItem(`bgColor-${mode}`);
  document.body.style.backgroundColor = savedColor || (mode === "light" ? "white" : "#121212");
}
applySavedBackground();

// Score drag logic
function setupDragEvents() {
  const scores = document.querySelectorAll(".score");

  scores.forEach(scoreInput => {
    let dragging = false;
    let startY = 0;
    let localDelta = 0;

    // TOUCH
    scoreInput.addEventListener("touchstart", e => {
      startY = e.touches[0].clientY;
      dragging = true;
    });

    scoreInput.addEventListener("touchmove", e => {
      if (!dragging) return;
      e.preventDefault();
      const deltaY = startY - e.touches[0].clientY;
      localDelta += deltaY;
      startY = e.touches[0].clientY;

      if (Math.abs(localDelta) >= 30) {
        let val = parseInt(scoreInput.value) || 0;
        val += localDelta > 0 ? 1 : -1;
        scoreInput.value = val;
        localDelta = 0;
      }
    }, { passive: false });

    scoreInput.addEventListener("touchend", () => {
      dragging = false;
      localDelta = 0;
    });

    // MOUSE
    scoreInput.addEventListener("mousedown", e => {
      startY = e.clientY;
      dragging = true;
    });

    document.addEventListener("mousemove", e => {
      if (!dragging) return;
      const deltaY = startY - e.clientY;
      localDelta += deltaY;
      startY = e.clientY;

      if (Math.abs(localDelta) >= 30) {
        let val = parseInt(scoreInput.value) || 0;
        val += localDelta > 0 ? 1 : -1;
        scoreInput.value = val;
        localDelta = 0;
      }
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
      localDelta = 0;
    });
  });
}

setupDragEvents();

// Init reset buttons
document.querySelectorAll('.resetScore').forEach(button => {
  button.addEventListener('click', function () {
    resetScore(this);
  });
});

document.querySelector(".addPlayer").addEventListener("click", addPlayer);
document.querySelector(".addColumn").addEventListener("click", addScoreColumn);
