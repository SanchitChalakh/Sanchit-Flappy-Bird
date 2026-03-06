const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 0.6;
let jumpForce = -10;
let velocity = 0;

let score = 0;
let best = localStorage.getItem("best") || 0;

const scoreUI = document.getElementById("score");
const bestUI = document.getElementById("best");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOver");
const ui = document.getElementById("ui");

bestUI.innerText = "Best:" + best;

let gameStarted = false;
let gameOver = false;

const birdImg = new Image();
birdImg.src = "face.png";

let bird = {
x:120,
y:200,
width:50,
height:50,
rotation:0
};

let pipes = [];
let pipeWidth = 80;
let gap = 180;

let clouds = [
{x:100,y:100},
{x:400,y:60},
{x:700,y:120}
];

let groundX = 0;

function spawnPipe(){

let topHeight = Math.random()*300 + 50;

pipes.push({
x:canvas.width,
top:topHeight,
bottom:topHeight + gap,
passed:false
});

}

setInterval(()=>{
if(gameStarted && !gameOver){
spawnPipe();
}
},1800);

function update(){

velocity += gravity;
bird.y += velocity;

bird.rotation = velocity * 3;

clouds.forEach(c=>{
c.x -= 0.4;
if(c.x < -100){
c.x = canvas.width + 100;
}
});

groundX -= 3;
if(groundX < -canvas.width){
groundX = 0;
}

pipes.forEach(pipe=>{

pipe.x -= 3;

if(
bird.x < pipe.x + pipeWidth &&
bird.x + bird.width > pipe.x &&
(bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
){
endGame();
}

if(!pipe.passed && pipe.x + pipeWidth < bird.x){
pipe.passed = true;
score++;
scoreUI.innerText = score;
}

});

if(bird.y + bird.height > canvas.height - 80){
endGame();
}

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

clouds.forEach(c=>{
ctx.fillStyle="white";
ctx.beginPath();
ctx.arc(c.x,c.y,25,0,Math.PI2);
ctx.arc(c.x+30,c.y+10,20,0,Math.PI2);
ctx.arc(c.x-30,c.y+10,20,0,Math.PI*2);
ctx.fill();
});

pipes.forEach(pipe=>{

ctx.fillStyle="#2ecc71";

ctx.fillRect(pipe.x,0,pipeWidth,pipe.top);
ctx.fillRect(pipe.x,pipe.bottom,pipeWidth,canvas.height);

});

ctx.save();

ctx.translate(bird.x + bird.width/2 , bird.y + bird.height/2);
ctx.rotate(bird.rotation * Math.PI/180);

ctx.drawImage(birdImg,-bird.width/2,-bird.height/2,bird.width,bird.height);

ctx.restore();

ctx.fillStyle="#c19a6b";

ctx.fillRect(groundX,canvas.height-80,canvas.width,80);
ctx.fillRect(groundX+canvas.width,canvas.height-80,canvas.width,80);

}

function loop(){

if(gameStarted && !gameOver){
update();
draw();
}

requestAnimationFrame(loop);

}

function flap(){

if(!gameStarted) return;

velocity = jumpForce;

}

function startGame(){

startScreen.style.display="none";
ui.style.display="block";

gameStarted = true;

}

function endGame(){

gameOver = true;

document.getElementById("finalScore").innerText = "Score: " + score;

gameOverScreen.style.display="block";

if(score > best){
best = score;
localStorage.setItem("best",best);
bestUI.innerText="Best:"+best;
}

}

function restartGame(){

bird.y = 200;
velocity = 0;
pipes = [];
score = 0;

scoreUI.innerText = 0;

gameOver = false;

gameOverScreen.style.display="none";

}

document.getElementById("startBtn").onclick = startGame;
document.getElementById("restartBtn").onclick = restartGame;

window.addEventListener("touchstart", flap);
window.addEventListener("mousedown", flap);

loop();
