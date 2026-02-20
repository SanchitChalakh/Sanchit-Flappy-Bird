const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let pipeSpeed = 3;
let pipeGap = 180;
let gravity = 0.6;
let velocity = 0;
let score = 0;
let pipes = [];
let gameRunning = false;

const faceImg = new Image();
faceImg.src = "assets/face.png";

let bird = {
  x: 120,
  y: 300,
  width: 70,
  height: 70
};

function setDifficulty(level) {
  if(level === "easy"){ pipeSpeed = 2; pipeGap = 220; }
  if(level === "medium"){ pipeSpeed = 3; pipeGap = 180; }
  if(level === "hard"){ pipeSpeed = 5; pipeGap = 140; }

  document.getElementById("startScreen").style.display = "none";
  startGame();
}

function startGame() {
  pipes = [];
  score = 0;
  velocity = 0;
  bird.y = canvas.height / 2;
  gameRunning = true;
  createPipe();
  gameLoop();
}

function createPipe() {
  let topHeight = Math.random() * (canvas.height - pipeGap - 200) + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - pipeGap
  });
}

function drawBird() {
  if(faceImg.complete){
    ctx.drawImage(faceImg, bird.x, bird.y, bird.width, bird.height);
  } else {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  }
}

function drawPipes() {
  ctx.fillStyle = "#00ff88";

  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, 80, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 80, pipe.bottom);
  });
}

function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;

    if(pipe.x === bird.x){
      score++;
    }
  });

  if(pipes.length && pipes[pipes.length - 1].x < canvas.width - 300){
    createPipe();
  }
}

function checkCollision() {
  for(let pipe of pipes){
    if(
      bird.x < pipe.x + 80 &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ){
      gameRunning = false;
      alert("Game Over! Score: " + score);
      location.reload();
    }
  }

  if(bird.y > canvas.height || bird.y < 0){
    gameRunning = false;
    alert("Game Over! Score: " + score);
    location.reload();
  }
}

function gameLoop() {
  if(!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  velocity += gravity;
  bird.y += velocity;

  drawPipes();
  updatePipes();
  drawBird();

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 50, 50);

  checkCollision();

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function(e){
  if(e.code === "Space" && gameRunning){
    velocity = -12;
  }
});

document.addEventListener("click", function(){
  if(gameRunning){
    velocity = -12;
  }
});
