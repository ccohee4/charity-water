let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

// Game Variables
let drops = [];
let score = 0;
let gameState = 'running'; // other states: 'paused', 'gameOver'

// Classes
class Drop {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'clean' or 'pollutant'
        this.size = 20;
        this.speed = 2;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.type === 'clean' ? 'blue' : 'red';
        ctx.fill();
        ctx.closePath();
    }
}

// Game Functions
function spawnDrop() {
    const x = Math.random() * canvas.width;
    const type = Math.random() < 0.7 ? 'clean' : 'pollutant'; // 70% clean water
    drops.push(new Drop(x, 0, type));
}

function updateGame() {
    if (gameState === 'running') {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw drops
        drops.forEach((drop, index) => {
            drop.update();
            drop.draw();

            // Check for collision with base
            if (drop.y + drop.size > canvas.height) {
                drops.splice(index, 1); // Remove drop at bottom
            }
        });
    }
}

function checkCollisions(mouseX, mouseY) {
    drops.forEach((drop, index) => {
        const dx = drop.x - mouseX;
        const dy = drop.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < drop.size) {
            if (drop.type === 'clean') {
                score += 10;
                showFeedback('You collected clean water!');
            } else {
                score -= 25;
                showFeedback('Oh no! You collected a pollutant!');
            }
            drops.splice(index, 1); // Remove collected drop
        }
    });
}

function showFeedback(message) {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(message, 10, 30);
}

// Event Listeners
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    checkCollisions(mouseX, mouseY);
});

// Game Loop
setInterval(() => {
    updateGame();
    if (gameState === 'running') spawnDrop(); // Spawn drops
}, 1000 / 60); // 60 FPS