let currentDifficulty = 'normal';

// Difficulty settings
const difficultySettings = {
  easy: { dropSpeed: 1, spawnInterval: 1500, difficultyIncrease: 0.2, spawnIntervalDecrease: 20 },
  normal: { dropSpeed: 2, spawnInterval: 1000, difficultyIncrease: 0.5, spawnIntervalDecrease: 50 },
  hard: { dropSpeed: 3, spawnInterval: 600, difficultyIncrease: 0.8, spawnIntervalDecrease: 80 }
};

// Initialize highscores
function initHighscores() {
  if (!localStorage.getItem('charityWaterHighscores')) {
    localStorage.setItem('charityWaterHighscores', JSON.stringify({ easy: 0, normal: 0, hard: 0 }));
  }
  displayHighscores();
}

function displayHighscores() {
  const highscores = JSON.parse(localStorage.getItem('charityWaterHighscores'));
  document.getElementById('easyHighscore').textContent = highscores.easy;
  document.getElementById('normalHighscore').textContent = highscores.normal;
  document.getElementById('hardHighscore').textContent = highscores.hard;
}

function updateHighscore(score) {
  const highscores = JSON.parse(localStorage.getItem('charityWaterHighscores'));
  if (score > highscores[currentDifficulty]) {
    highscores[currentDifficulty] = score;
    localStorage.setItem('charityWaterHighscores', JSON.stringify(highscores));
    displayHighscores();
    return true;
  }
  return false;
}

// Game variables
let gameArea, scoreDisplay, messageDisplay, resetBtn, currentHighscoreDisplay;
let score = 0;
let dropSize = 25;
let gameWidth, gameHeight, dropSpeed, spawnInterval;
let gameRunning = false;
let drops = [];
let spawnIntervalId, difficultyIntervalId;

// Initialize highscores
initHighscores();

// Setup difficulty buttons
document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.onclick = () => {
    currentDifficulty = btn.dataset.difficulty;
    resetGame();
  };
});

// Start game
initializeGame();

function initializeGame() {
  gameArea = document.getElementById("gameArea");
  scoreDisplay = document.getElementById("score");
  messageDisplay = document.getElementById("message");
  resetBtn = document.getElementById("resetBtn");
  currentHighscoreDisplay = document.getElementById("currentHighscore");

  gameWidth = gameArea.offsetWidth;
  gameHeight = gameArea.offsetHeight;

  const settings = difficultySettings[currentDifficulty];
  dropSpeed = settings.dropSpeed;
  spawnInterval = settings.spawnInterval;

  score = 0;
  scoreDisplay.textContent = score;
  const highscores = JSON.parse(localStorage.getItem('charityWaterHighscores'));
  currentHighscoreDisplay.textContent = highscores[currentDifficulty];

  messageDisplay.textContent = "Collect clean water. Avoid pollution!";
  drops = [];
  gameRunning = true;

  // Clear any existing drops
  gameArea.querySelectorAll('.drop').forEach(drop => drop.remove());

  resetBtn.onclick = resetGame;

  spawnIntervalId = setInterval(spawnDrop, spawnInterval);

  // Increase difficulty over time
  difficultyIntervalId = setInterval(() => {
    dropSpeed += settings.difficultyIncrease;
    if (spawnInterval > 300) spawnInterval -= settings.spawnIntervalDecrease;
    clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(spawnDrop, spawnInterval);
  }, 15000);

  gameLoop();
}

function spawnDrop() {
  if (!gameRunning) return;

  const drop = document.createElement("div");
  drop.classList.add("drop");

  const isClean = Math.random() < 0.7;
  drop.classList.add(isClean ? "clean" : "bad");

  drop.style.left = Math.random() * (gameWidth - dropSize) + "px";
  drop.style.top = "0px";

  const dropObj = { element: drop, top: 0, isClean };

  // Fix: click always works
  drop.addEventListener("click", (e) => {
    e.stopPropagation();
    score += isClean ? 10 : -5;
    messageDisplay.textContent = isClean ? "Great! +10 points!" : "Oops! -5 points!";
    scoreDisplay.textContent = score;
    currentHighscoreDisplay.textContent = Math.max(score, parseInt(currentHighscoreDisplay.textContent));
    drop.remove();
    drops = drops.filter(d => d !== dropObj);
  });

  gameArea.appendChild(drop);
  drops.push(dropObj);
}

function updateDrops() {
  drops = drops.filter(drop => {
    drop.top += dropSpeed;
    drop.element.style.top = drop.top + "px";
    if (drop.top > gameHeight) {
      drop.element.remove();
      return false;
    }
    return true;
  });
}

function gameLoop() {
  if (gameRunning) {
    updateDrops();
    requestAnimationFrame(gameLoop);
  }
}

function resetGame() {
  const isNewHighscore = updateHighscore(score);
  messageDisplay.textContent = isNewHighscore ? "🏆 NEW HIGH SCORE! 🏆" : "Game reset!";

  score = 0;
  scoreDisplay.textContent = score;

  drops.forEach(drop => drop.element.remove());
  drops = [];

  const settings = difficultySettings[currentDifficulty];
  dropSpeed = settings.dropSpeed;
  spawnInterval = settings.spawnInterval;

  clearInterval(spawnIntervalId);
  clearInterval(difficultyIntervalId);

  spawnIntervalId = setInterval(spawnDrop, spawnInterval);

  difficultyIntervalId = setInterval(() => {
    dropSpeed += settings.difficultyIncrease;
    if (spawnInterval > 300) spawnInterval -= settings.spawnIntervalDecrease;
    clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(spawnDrop, spawnInterval);
  }, 15000);

  gameLoop();
}
