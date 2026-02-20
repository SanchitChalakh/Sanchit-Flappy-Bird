const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// GAME VARIABLES
let gravity = 0.6;
let velocity = 0;
let pipeSpeed = 3;
let pipeGap = 180;
let score = 0;
let pipes = [];
let gameRunning = true;

let rotation = 0;
let lastTap = 0;

const faceImg = new Image();
faceImg.src = "face.png"; // same folder madhe image theva

let bird = {
  x: 120,
  y: 300,
  width: 70,
  height: 70
};

// CREATE PIPE
function createPipe(){
  let topHeight = Math.random() * (canvas.height - pipeGap - 200) + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - pipeGap,
    passed: false
  });
}

// DRAW BIRD
function drawBird(){
  ctx.save();

  ctx.translate(
    bird.x + bird.width/2,
    bird.y + bird.height/2
  );

  rotation += 0.05;
  ctx.rotate(rotation);

  if(faceImg.complete){
    ctx.drawImage(
      faceImg,
      -bird.width/2,
      -bird.height/2,
      bird.width,
      bird.height
    );
  } else {
    ctx.fillStyle="yellow";
    ctx.fillRect(
      -bird.width/2,
      -bird.height/2,
      bird.width,
      bird.height
    );
  }

  ctx.restore();
}

// DRAW PIPES
function drawPipes(){
  ctx.fillStyle="#00cc66";

  pipes.forEach(pipe=>{
    ctx.fillRect(pipe.x,0,80,pipe.top);
    ctx.fillRect(pipe.x,canvas.height-pipe.bottom,80,pipe.bottom);
  });
}

// UPDATE PIPES
function updatePipes(){
  pipes.forEach(pipe=>{
    pipe.x -= pipeSpeed;

    if(!pipe.passed && pipe.x + 80 < bird.x){
      score++;
      pipe.passed = true;
    }
  });

  pipes = pipes.filter(pipe=>pipe.x > -80);

  if(pipes.length === 0 || pipes[pipes.length-1].x < canvas.width - 300){
    createPipe();
  }
}

// COLLISION
function checkCollision(){
  for(let pipe of pipes){
    if(
      bird.x < pipe.x + 80 &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ){
      gameOver();
    }
  }

  if(bird.y > canvas.height || bird.y < 0){
    gameOver();
  }
}

// GAME OVER
function gameOver(){
  gameRunning = false;
  alert("Game Over! Score: " + score);
  location.reload();
}

// GAME LOOP
function gameLoop(){
  if(!gameRunning) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  velocity += gravity;
  bird.y += velocity;

  drawPipes();
  updatePipes();
  drawBird();

  ctx.fillStyle="black";
  ctx.font="30px Arial";
  ctx.fillText("Score: " + score,50,50);

  checkCollision();

  requestAnimationFrame(gameLoop);
}

// TAP CONTROL
document.addEventListener("click", function(){

  let currentTime = new Date().getTime();
  let tapLength = currentTime - lastTap;

  if(gameRunning){

    if(tapLength < 300 && tapLength > 0){
      // DOUBLE TAP
      velocity = -18;
    } else {
      // SINGLE TAP
      velocity = -12;
    }

  }

  lastTap = currentTime;
});

// KEYBOARD CONTROL
document.addEventListener("keydown", function(e){
  if(e.code === "Space"){
    velocity = -12;
  }
});

// START GAME
createPipe();
gameLoop();
