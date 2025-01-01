// Function to change the score (increment/decrement)
    function changeScore(scoreId, increment) {
      const scoreInput = document.getElementById(scoreId);
      let currentScore = parseInt(scoreInput.value) || 0; // Get current score or default to 0 if empty
      currentScore += increment;
      scoreInput.value = currentScore;
    }

    // Function to reset the score for a player
    function resetScore(scoreId) { 

const scoreInput = document.getElementById(scoreId);
      scoreInput.value = 0; // Reset the score to 0
    }

   // Function to add a new player form dynamically
    function addPlayer() {
      const playerCount = document.querySelectorAll('.player-form').length + 1;

      const playerForm = document.createElement('div');
      playerForm.classList.add('player-form');
      
      playerForm.innerHTML = `
        <input type="text" id="name${playerCount}" placeholder="Player ${playerCount} Name">
        <input type="number" class="score" id="score${playerCount}" placeholder="0">
        <button onclick="changeScore('score${playerCount}', 1)">+</button>
        <button onclick="changeScore('score${playerCount}', -1)">-</button>
        <input type="reset" value="Reset" onclick="resetScore('score${playerCount}')">
      `;


      // Append the new player form to the body
      document.body.appendChild(playerForm);
    }

