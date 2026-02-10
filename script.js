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

setInterval(() => {
  dropSpeed += 0.5;
  if (spawnInterval > 300) spawnInterval -= 50;
}, 15000);

let drops = [];

function spawnDrop() {
  const drop = document.createElement("div");
  drop.classList.add("drop");

  if (Math.random() < 0.7) {
    drop.classList.add("clean");
  } else {
    drop.classList.add("bad");
  }

  drop.style.left = Math.random() * (gameWidth - dropSize) + "px";
  drop.style.top = "-" + dropSize + "px";

  drop.addEventListener("click", function() {
    if (drop.classList.contains("clean")) {
      score += 10;
      messageDisplay.textContent = "Great! +10 points!";
    } else {
      score -= 5;
      messageDisplay.textContent = "Oops! -5 points!";
    }
    scoreDisplay.textContent = score;
    drop.remove();
  });

  gameArea.appendChild(drop);
  drops.push({
    element: drop,
    top: -dropSize,
    isClean: drop.classList.contains("clean")
  });
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
  updateDrops();
  requestAnimationFrame(gameLoop);
}

let spawnIntervalId = setInterval(spawnDrop, spawnInterval);

gameLoop();

resetBtn.addEventListener("click", () => {
  score = 0;
  scoreDisplay.textContent = score;
  messageDisplay.textContent = "Collect clean water. Avoid pollution!";

  drops.forEach(drop => gameArea.removeChild(drop.element));
  drops = [];
  
  dropSpeed = 2;
  spawnInterval = 1000;
  clearInterval(spawnIntervalId);
  spawnIntervalId = setInterval(spawnDrop, spawnInterval);
});
// Existing content to be retrieved before updating.
