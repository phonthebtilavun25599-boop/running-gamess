const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let player = {
    x: 50,
    y: canvas.height - 60,
    width: 40,
    height: 50,
    dy: 0,
    gravity: 1,
    jumpPower: -15,
    onGround: true
};

let obstacles = [];
let obstacleTimer = 0;
let speed = 5;
let level = 1;
let score = 0;

function createObstacle() {
    let size = Math.random() * 30 + 20 + level * 5;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - size,
        width: size,
        height: size
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = 'green';
    obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obs.width, obs.height));

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function update() {
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }

    obstacles.forEach(obs => obs.x -= speed);
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

    obstacleTimer++;
    if (obstacleTimer > 90) {
        createObstacle();
        obstacleTimer = 0;
    }

    obstacles.forEach(obs => {
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            alert('Game Over! Score: ' + score);
            document.location.reload();
        }
    });

    score++;
    if (score % 200 === 0) {
        level++;
        speed += 0.5;
    }
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space' && player.onGround) {
        player.dy = player.jumpPower;
        player.onGround = false;
    }
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
