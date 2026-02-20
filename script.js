const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pipeSpeed = 3;
let pipeGap = 180;
let gravity = 0.5;
let velocity = 0;
let score = 0;
let pipes = [];

const faceImg = new Image();
faceImg.src = "assets/face.png";

let bird = {
  x: 100,
  y: canvas.height / 2,
  width: 60,
  height: 60
};

function setDifficulty(level){
  if(level === "easy"){ pipeSpeed = 2; pipeGap = 220; }
  if(level === "medium"){ pipeSpeed = 3; pipeGap = 180; }
  if(level === "hard"){ pipeSpeed = 5; pipeGap = 140; }

  document.getElementById("startScreen").style.display = "none";
  startGame();
}

function startGame(){
  pipes = [];
  score = 0;
  bird.y = canvas.height / 2;
  velocity = 0;
  createPipe();
  gameLoop();
}

function createPipe(){
  let topHeight = Math.random() * (canvas.height - pipeGap - 200) + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - pipeGap
  });
}

function drawPipes(){
  ctx.fillStyle = "#00ff88";

  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, 80, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 80, pipe.bottom);
  });
}

function updatePipes(){
  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;

    if(pipe.x === canvas.width / 2){
      score++;
    }
  });

  if(pipes.length && pipes[pipes.length - 1].x < canvas.width - 300){
    createPipe();
  }
}

function checkCollision(){
  for(let pipe of pipes){
    if(
      bird.x < pipe.x + 80 &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ){
      alert("Game Over! Score: " + score);
      location.reload();
    }
  }
}

function gameLoop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  velocity += gravity;
  bird.y += velocity;

  drawPipes();
  updatePipes();

  ctx.drawImage(faceImg, bird.x, bird.y, bird.width, bird.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 50, 50);

  checkCollision();

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function(e){
  if(e.code === "Space"){
    velocity = -10;
  }
});
