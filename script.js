const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const messageDisplay = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");

let score = 0;

const dropSize = 25;
const gameWidth = gameArea.offsetWidth;
const gameHeight = gameArea.offsetHeight;
let dropSpeed = 2;
let spawnInterval = 1000;
let gameRunning = true;

setInterval(() => {
  if (gameRunning) {
    dropSpeed += 0.5;
    if (spawnInterval > 300) spawnInterval -= 50;
  }
}, 15000);

let drops = [];

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
  }
  requestAnimationFrame(gameLoop);
}

let spawnIntervalId = setInterval(spawnDrop, spawnInterval);

gameLoop();

resetBtn.addEventListener("click", () => {
  score = 0;
  scoreDisplay.textContent = score;
  messageDisplay.textContent = "Collect clean water. Avoid pollution!";

  drops.forEach(drop => {
    try {
      gameArea.removeChild(drop.element);
    } catch (e) {}
  });
  drops = [];
  
  dropSpeed = 2;
  spawnInterval = 1000;
  gameRunning = true;
  clearInterval(spawnIntervalId);
  spawnIntervalId = setInterval(spawnDrop, spawnInterval);
});
