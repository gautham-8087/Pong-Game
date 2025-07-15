const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const PADDLE_MARGIN = 12;

// Ball settings
const BALL_SIZE = 14;

// Game state
let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballSpeedX = 5;
let ballSpeedY = 4;

let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle inside canvas
    playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
});

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw paddles
    ctx.fillStyle = '#fff';
    // Player (left)
    ctx.fillRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    // AI (right)
    ctx.fillRect(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Ball movement and collisions
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top/bottom wall collision
    if (ballY < 0) {
        ballY = 0;
        ballSpeedY *= -1;
    } else if (ballY + BALL_SIZE > HEIGHT) {
        ballY = HEIGHT - BALL_SIZE;
        ballSpeedY *= -1;
    }

    // Left paddle collision (player)
    if (
        ballX < PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH;
        ballSpeedX *= -1.1;
        // Add some "spin" based on where it hit the paddle
        let hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * 0.15;
    }

    // Right paddle collision (AI)
    if (
        ballX + BALL_SIZE > WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
        ballSpeedX *= -1.1;
        let hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * 0.15;
    }

    // Score check
    if (ballX < 0) {
        aiScore++;
        resetBall(-1);
        updateScoreboard();
    } else if (ballX + BALL_SIZE > WIDTH) {
        playerScore++;
        resetBall(1);
        updateScoreboard();
    }

    // AI paddle (simple tracking)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    let ballCenter = ballY + BALL_SIZE / 2;
    let speed = Math.min(8, Math.abs(ballCenter - aiCenter) * 0.2);
    if (aiCenter < ballCenter) {
        aiY += speed;
    } else if (aiCenter > ballCenter) {
        aiY -= speed;
    }
    aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));
}

function resetBall(direction) {
    ballX = WIDTH / 2 - BALL_SIZE / 2;
    ballY = HEIGHT / 2 - BALL_SIZE / 2;
    ballSpeedX = direction * (5 + Math.random() * 2);
    ballSpeedY = (Math.random() < 0.5 ? 1 : -1) * (3 + Math.random() * 2);
}

function updateScoreboard() {
    document.getElementById('playerScore').textContent = `Player: ${playerScore}`;
    document.getElementById('aiScore').textContent = `AI: ${aiScore}`;
}

// Main loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start
updateScoreboard();
gameLoop();