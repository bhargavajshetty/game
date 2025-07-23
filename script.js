const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle properties
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 20;
const PADDLE_SPEED = 5;

// Ball properties
const BALL_SIZE = 12;
const BALL_SPEED = 5;

// Game state
let leftPaddle = {
    x: PADDLE_MARGIN,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

let rightPaddle = {
    x: WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

let ball = {
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    vx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    vy: BALL_SPEED * (Math.random() * 2 - 1)
};

// Scores
let leftScore = 0;
let rightScore = 0;

// Mouse control for left paddle
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Clamp within canvas
    leftPaddle.y = Math.max(0, Math.min(HEIGHT - leftPaddle.height, leftPaddle.y));
});

function resetBall() {
    ball.x = WIDTH / 2 - BALL_SIZE / 2;
    ball.y = HEIGHT / 2 - BALL_SIZE / 2;
    ball.vx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = BALL_SPEED * (Math.random() * 2 - 1);
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
}

function drawText(text, x, y, size = 36) {
    ctx.fillStyle = '#fff';
    ctx.font = `${size}px Arial`;
    ctx.fillText(text, x, y);
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw center line
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, '#0f0');
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, '#f00');

    // Draw ball
    drawCircle(ball.x + ball.size / 2, ball.y + ball.size / 2, ball.size / 2, '#fff');

    // Draw scores
    drawText(leftScore, WIDTH / 4, 50);
    drawText(rightScore, WIDTH * 3 / 4, 50);
}

function update() {
    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collision
    if (ball.y < 0) {
        ball.y = 0;
        ball.vy *= -1;
    }
    if (ball.y + ball.size > HEIGHT) {
        ball.y = HEIGHT - ball.size;
        ball.vy *= -1;
    }

    // Paddle collision
    // Left paddle
    if (ball.x < leftPaddle.x + leftPaddle.width &&
        ball.y + ball.size > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height) {
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.vx *= -1;
        // Make ball direction depend on where it hit
        let hitPoint = (ball.y + ball.size / 2) - (leftPaddle.y + leftPaddle.height / 2);
        ball.vy = hitPoint * 0.15;
    }
    // Right paddle
    if (ball.x + ball.size > rightPaddle.x &&
        ball.y + ball.size > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height) {
        ball.x = rightPaddle.x - ball.size;
        ball.vx *= -1;
        let hitPoint = (ball.y + ball.size / 2) - (rightPaddle.y + rightPaddle.height / 2);
        ball.vy = hitPoint * 0.15;
    }

    // Score
    if (ball.x < 0) {
        rightScore += 1;
        resetBall();
    }
    if (ball.x + ball.size > WIDTH) {
        leftScore += 1;
        resetBall();
    }

    // AI for right paddle: move toward ball
    let paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    if (paddleCenter < ball.y + ball.size / 2 - 10) {
        rightPaddle.y += PADDLE_SPEED;
    } else if (paddleCenter > ball.y + ball.size / 2 + 10) {
        rightPaddle.y -= PADDLE_SPEED;
    }
    // Clamp within canvas
    rightPaddle.y = Math.max(0, Math.min(HEIGHT - rightPaddle.height, rightPaddle.y));
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();