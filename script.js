// === Global Variables ===
let currentDifficulty = 'normal';
let score = 0;
let dropSize = 25;
let gameRunning = false;
let drops = [];
let spawnIntervalId;
let difficultyIntervalId;

let gameArea;
let scoreDisplay;
let messageDisplay;
let resetBtn;
let currentHighscoreDisplay;
let gameWidth;
let gameHeight;
let dropSpeed;
let spawnInterval;

// === Difficulty Settings ===
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

// === Highscore Functions ===
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

// === Page Load Initialization ===
window.addEventListener('DOMContentLoaded', () => {
  initHighscores();

  // Select elements
  gameArea = document.getElementById("gameArea");
  scoreDisplay = document.getElementById("score");
  messageDisplay = document.getElementById("message");
  resetBtn = document.getElementById("resetBtn");
  currentHighscoreDisplay = document.getElementById("currentHighscore");
  gameWidth = gameArea.offsetWidth;
  gameHeight = gameArea.offsetHeight;

  // Difficulty buttons
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click
