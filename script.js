const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restartBtn');
const homeBtn = document.getElementById('homeBtn');
const messageDisplay = document.getElementById('message');
const onePlayerBtn = document.getElementById('onePlayerBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const modeSelection = document.getElementById('modeSelection');
const board = document.querySelector('.board');
const buttonContainer = document.querySelector('.button-container');

let currentPlayer = 'X';
let gameActive = true;
let boardState = Array(9).fill(null);
let isOnePlayerMode = false; // Track the selected mode

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6]
];

// Event listeners for mode selection buttons
onePlayerBtn.addEventListener('click', () => startGame(true));
twoPlayerBtn.addEventListener('click', () => startGame(false));

// Start the game with the selected mode
function startGame(isOnePlayer) {
  isOnePlayerMode = isOnePlayer;
  modeSelection.classList.add('hidden');
  board.classList.remove('hidden');
  buttonContainer.classList.remove('hidden');
  messageDisplay.classList.remove('hidden');
  restartGame(); // Reset the game for the new session
}

// Handle player clicks
function handleClick(e) {
  const cell = e.target;
  const index = cell.getAttribute('data-index');

  if (boardState[index] || !gameActive) return;

  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkWin()) {
    gameActive = false;
    highlightWinningCells(); // Highlight the winning cells
    displayMessage(`${currentPlayer} wins!`);
  } else if (boardState.every(cell => cell !== null)) {
    gameActive = false;
    displayMessage("It's a draw!");
  } else {
    switchPlayer();

    // If it's one-player mode and it's now the computer's turn
    if (isOnePlayerMode && currentPlayer === 'O') {
      setTimeout(computerMove, 500); // Delay for a more natural feel
    }
  }
}

// Computer's move for one-player mode
function computerMove() {
  const availableCells = boardState
    .map((value, index) => (value === null ? index : null))
    .filter(index => index !== null);

  const randomIndex = Math.floor(Math.random() * availableCells.length);
  const cellIndex = availableCells[randomIndex];

  boardState[cellIndex] = currentPlayer;
  cells[cellIndex].textContent = currentPlayer;

  if (checkWin()) {
    gameActive = false;
    highlightWinningCells(); // Highlight the winning cells
    displayMessage(`${currentPlayer} wins!`);
  } else if (boardState.every(cell => cell !== null)) {
    gameActive = false;
    displayMessage("It's a draw!");
  } else {
    switchPlayer();
  }
}

// Switch between players X and O
function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  displayMessage(`It's ${currentPlayer}'s turn`);
}

// Check if the current player has won
function checkWin() {
  return winningCombinations.some(combination =>
    combination.every(index => boardState[index] === currentPlayer)
  );
}

// Highlight the winning cells
function highlightWinningCells() {
  const winningCombination = winningCombinations.find(combination =>
    combination.every(index => boardState[index] === currentPlayer)
  );

  winningCombination.forEach(index => {
    cells[index].classList.add('winning-cell');
  });
}

// Display game messages
function displayMessage(message) {
  messageDisplay.textContent = message;
}

// Restart the game
function restartGame() {
  boardState.fill(null);
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winning-cell'); // Remove highlight on restart
  });
  currentPlayer = 'X';
  gameActive = true;
  displayMessage('Start Game');
}

// Go back to the mode selection screen
homeBtn.addEventListener('click', () => {
  modeSelection.classList.remove('hidden');
  board.classList.add('hidden');
  buttonContainer.classList.add('hidden');
  messageDisplay.classList.add('hidden');
});

// Add event listeners to cells and restart button
cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
