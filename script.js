let currentDifficulty = 'normal';
const difficultySettings = {
  easy: { dropSpeed: 1, spawnInterval: 1500, difficultyIncrease: 0.2, spawnIntervalDecrease: 20 },
  normal: { dropSpeed: 2, spawnInterval: 1000, difficultyIncrease: 0.5, spawnIntervalDecrease: 50 },
  hard: { dropSpeed: 3, spawnInterval: 600, difficultyIncrease: 0.8, spawnIntervalDecrease: 80 }
};

// Highscores
function initHighscores() {
  if (!localStorage.getItem('charityWaterHighscores')) {
    localStorage.setItem('charityWaterHighscores', JSON.stringify({ easy:0, normal:0, hard:0 }));
  }
  displayHighscores();
}

function displayHighscores() {
  const hs = JSON.parse(localStorage.getItem('charityWaterHighscores'));
  document.getElementById('easyHighscore').textContent = hs.easy;
  document.getElementById('normalHighscore').textContent = hs.normal;
  document.getElementById('hardHighscore').textContent = hs.hard;
}

function updateHighscore(score) {
  const hs = JSON.parse(localStorage.getItem('charityWaterHighscores'));
  if(score > hs[currentDifficulty]){
    hs[currentDifficulty] = score;
    localStorage.setItem('charityWaterHighscores', JSON.stringify(hs));
    displayHighscores();
    return true;
  }
  return false;
}

initHighscores();

// Difficulty buttons
document.querySelectorAll('.difficulty-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{ 
    currentDifficulty = btn.dataset.difficulty;
    startGame();
  });
});

document.getElementById('menuBtn').addEventListener('click', ()=>goToMenu());

let gameArea, scoreDisplay, messageDisplay, resetBtn, currentHighscoreDisplay;
let score=0, drops=[], gameRunning=false, dropSize=25, spawnInterval, dropSpeed;
let spawnIntervalId, difficultyIntervalId;

function startGame(){
  document.getElementById('startPage').classList.add('hidden');
  document.getElementById('gamePage').classList.remove('hidden');
  initializeGame();
}

function goToMenu(){
  stopGame();
  document.getElementById('gamePage').classList.add('hidden');
  document.getElementById('startPage').classList.remove('hidden');
  displayHighscores();
}

function initializeGame(){
  gameArea = document.getElementById("gameArea");
  scoreDisplay = document.getElementById("score");
  messageDisplay = document.getElementById("message");
  resetBtn = document.getElementById("resetBtn");
  currentHighscoreDisplay = document.getElementById("currentHighscore");

  const settings = difficultySettings[currentDifficulty];
  dropSpeed = settings.dropSpeed;
  spawnInterval = settings.spawnInterval;

  score=0;
  scoreDisplay.textContent=score;
  const hs = JSON.parse(localStorage.getItem('charityWaterHighscores'));
  currentHighscoreDisplay.textContent=hs[currentDifficulty];
  drops=[]; gameRunning=true;

  // Remove previous drops
  gameArea.querySelectorAll('.drop').forEach(d=>d.remove());

  resetBtn.onclick = resetGame;

  spawnIntervalId = setInterval(spawnDrop, spawnInterval);

  difficultyIntervalId = setInterval(()=>{
    dropSpeed += settings.difficultyIncrease;
    if(spawnInterval>300) spawnInterval -= settings.spawnIntervalDecrease;
    clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(spawnDrop, spawnInterval);
  },15000);

  gameLoop();
}

function stopGame(){
  gameRunning=false;
  clearInterval(spawnIntervalId);
  clearInterval(difficultyIntervalId);
  drops.forEach(d=>d.element.remove());
  drops=[];
}

function spawnDrop(){
  if(!gameRunning) return;

  const drop = document.createElement("div");
  drop.classList.add("drop");
  drop.classList.add(Math.random()<0.7 ? "clean":"bad");
  const leftPos = Math.random()*(gameArea.offsetWidth-dropSize);
  drop.style.left = leftPos + "px";
  drop.style.top = "0px";

  const dropObj = {element: drop, top:0, isClean: drop.classList.contains("clean")};

  drop.addEventListener("click", (e)=>{
    e.stopPropagation();
    score += dropObj.isClean ? 10 : -5;
    messageDisplay.textContent = dropObj.isClean ? "Great! +10 points!" : "Oops! -5 points!";
    scoreDisplay.textContent = score;
    currentHighscoreDisplay.textContent = Math.max(score, parseInt(currentHighscoreDisplay.textContent));
    drop.remove();
    drops = drops.filter(d => d!==dropObj);
  });

  gameArea.appendChild(drop);
  drops.push(dropObj);
}

function updateDrops(){
  drops = drops.filter(d=>{
    d.top += dropSpeed;
    d.element.style.top = d.top + "px";
    if(d.top>gameArea.offsetHeight){ d.element.remove(); return false; }
    return true;
  });
}

function gameLoop(){
  if(gameRunning){
    updateDrops();
    requestAnimationFrame(gameLoop);
  }
}

function resetGame(){
  if(updateHighscore(score)){
    messageDisplay.textContent="🏆 NEW HIGH SCORE! 🏆";
  }
  score=0; scoreDisplay.textContent=score;
  setTimeout(()=>{messageDisplay.textContent="Collect clean water. Avoid pollution!";},2000);
  drops.forEach(d=>d.element.remove());
  drops=[];
  const settings=difficultySettings[currentDifficulty];
  dropSpeed=settings.dropSpeed;
  spawnInterval=settings.spawnInterval;
  gameRunning=true;
  clearInterval(spawnIntervalId); clearInterval(difficultyIntervalId);
  spawnIntervalId = setInterval(spawnDrop, spawnInterval);
  difficultyIntervalId = setInterval(()=>{
    dropSpeed += settings.difficultyIncrease;
    if(spawnInterval>300) spawnInterval -= settings.spawnIntervalDecrease;
    clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(spawnDrop, spawnInterval);
  },15000);
  gameLoop();
}
