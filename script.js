let currentDifficulty = 'normal';

// Difficulty settings
const difficultySettings = {
  easy: {
    dropSpeed: 1,
    spawnInterval: 1500,
    difficultyIncrease: 0.2,
    spawnIntervalDecrease: 20
  },
  normal: {
    dropSpeed: 2,
    spawnInterval: 1000,
    difficultyIncrease: 0.5,
    spawnIntervalDecrease: 50
  },
  hard: {
    dropSpeed: 3,
    spawnInterval: 600,
    difficultyIncrease: 0.8,
    spawnIntervalDecrease: 80
  }
};

// Initialize highscores from localStorage
function initHighscores() {
  if (!localStorage.getItem('charityWaterHighscores')) {
    localStorage.setItem('charityWaterHighscores', JSON.stringify({
      easy: 0,
      normal: 0,
      hard: 0
    }));
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

// Initialize on page load
initHighscores();

// Start page event listeners
document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    currentDifficulty = this.dataset.difficulty;
    startGame();
  });
});

// Menu button
document.getElementById('menuBtn').addEventListener('click', () => {
  goToMenu();
});

function startGame() {
  document.getElementById('startPage').classList.add('hidden');
  document.getElementById('gamePage').classList.remove('hidden');
  initializeGame();
}

function goToMenu() {
  document.getElementById('gamePage').classList.add('hidden');
  document.getElementById('startPage').classList.remove('hidden');
  displayHighscores();
  stopGame();
}

// Game variables
let gameArea;
let scoreDisplay;
let messageDisplay;
let resetBtn;
let currentHighscoreDisplay;
let score = 0;
let dropSize = 25;
let gameWidth;
let gameHeight;
let dropSpeed;
let spawnInterval;
let gameRunning = false;
let drops = [];
let spawnIntervalId;
let difficultyIntervalId;

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
  
  resetBtn.addEventListener('click', resetGame);
  
  spawnIntervalId = setInterval(spawnDrop, spawnInterval);
  
  // Increase difficulty over time
  difficultyIntervalId = setInterval(() => {
    const settings = difficultySettings[currentDifficulty];
    dropSpeed += settings.difficultyIncrease;
    if (spawnInterval > 300) spawnInterval -= settings.spawnIntervalDecrease;
    clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(spawnDrop, spawnInterval);
  }, 15000);
  
  gameLoop();
}

function stopGame() {
  gameRunning = false;
  clearInterval(spawnIntervalId);
  clearInterval(difficultyIntervalId);
  drops.forEach(drop => {
    try {
      drop.element.remove();
    } catch (e) {}
  });
  drops = [];
}

function spawnDrop() {
  if (!gameRunning) return;
  
  const drop = document.createElement("div");
  drop.classList.add("drop");

  if (Math.random() < 0.7) {
    drop.classList.add("clean");
  } else {
    drop.classList.add("bad");
  }

  const leftPos = Math.random() * (gameWidth - dropSize);
  drop.style.left = leftPos + "px";
  drop.style.top = "0px";

  const dropObj = {
    element: drop,
    top: 0,
    isClean: drop.classList.contains("clean")
  };

  drop.addEventListener("click", function(e) {
    e.stopPropagation();
    if (drop.classList.contains("clean")) {
      score += 10;
      messageDisplay.textContent = "Great! +10 points!";
    } else {
      score -= 5;
      messageDisplay.textContent = "Oops! -5 points!";
    }
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
  // Check if score beats highscore
  const isNewHighscore = updateHighscore(score);
  
  if (isNewHighscore) {
    messageDisplay.textContent = "🏆 NEW HIGH SCORE! 🏆";
  }
  
  score = 0;
  scoreDisplay.textContent = score;
  
  setTimeout(() => {
    messageDisplay.textContent = "Collect clean water. Avoid pollution!";
  }, 2000);

  drops.forEach(drop => {
    try {
      gameArea.removeChild(drop.element);
    } catch (e) {}
  });
  drops = [];
  
  const settings = difficultySettings[currentDifficulty];
  dropSpeed = settings.dropSpeed;
  spawnInterval = settings.spawnInterval;
  gameRunning = true;
  
  clearInterval(spawnIntervalId);
  clearInterval(difficultyIntervalId);
  
  spawnIntervalId = setInterval(spawnDrop, spawnInterval);
  
  difficultyIntervalId = setInterval(() => {
    const settings = difficultySettings[currentDifficulty];
    dropSpeed += settings.difficultyIncrease;
    if (spawnInterval > 300) spawnInterval -= settings.spawnIntervalDecrease;
    clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(spawnDrop, spawnInterval);
  }, 15000);
  
  gameLoop();
}
