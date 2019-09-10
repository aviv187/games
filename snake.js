const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const box = 10;

const leftSide = 20;
const rightSide = 20;
const upSide = 80;
const downSide = 20;

const wBoxNum = (canvas.width-(leftSide+rightSide))/box;
const hBoxNum = (canvas.height-(upSide+downSide))/box;

let snake = [];
let board = [];
let dir;
let canTurn = true;

let cubs = [];

// make all the cubes
for(i=0; i<wBoxNum; i++){
    for(j=0; j<hBoxNum; j++){
        cubs.push({
            x: leftSide + i*box,
            y: upSide + j*box
        })
    } 
} 


let snakeH = Math.floor(Math.random()*cubs.length);

snake.push(cubs[snakeH]);
cubs.splice(snakeH, 1);

let food = {
    x: Math.floor(Math.random()*wBoxNum)*box + leftSide,
    y: Math.floor(Math.random()*hBoxNum)*box + upSide
};

let score = 0;

// moving
document.addEventListener("keydown", function(event){
    if (event.keyCode === 37 && dir !== 'right' && canTurn === true) {
        dir = 'left';
        canTurn = false;
    }
    if (event.keyCode === 38 && dir !== 'down' && canTurn === true) {
        dir = 'up';
        canTurn = false;
    }
    if (event.keyCode === 39 && dir !== 'left' && canTurn === true) {
        dir = 'right';
        canTurn = false;
    }
    if (event.keyCode === 40 && dir !== 'up' && canTurn === true) {
        dir = 'down';
        canTurn = false;
    }
});

// function board drawing
function boardD(){
    ctx.fillStyle = "#4ce265";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (i=0; i<cubs.length; i++) {
        ctx.fillStyle = "#fad299";
        ctx.fillRect(cubs[i].x, cubs[i].y, box, box);
    }
};

// function snake drawing
function snakeD(){
    for (i=0; i<snake.length; i++){
        ctx.fillStyle = "#ff0070";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
};

// function food drawing
function foodD(){
    ctx.fillStyle = "#85258f";
    ctx.fillRect(food.x, food.y, box, box);
};

// function scoure drawing
function scoureD(){
    ctx.font = "30px Arial Black";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(`score: ${score}`, leftSide, upSide/2); 
}

// amination 
function draw() {
    //board drawing
    window.requestAnimationFrame(boardD);

    //snake drawing
    window.requestAnimationFrame(snakeD);
    
    // food drawing
    window.requestAnimationFrame(foodD);
    
    // making temp head
    let snakeX = snake[0].x
    let snakeY = snake[0].y
    
    // snake moving
    if (dir === 'left'){
        snakeX -= box;
        if (snakeX < leftSide){
            snakeX = canvas.width-(rightSide+box);
        }
    }
    if (dir === 'up'){
        snakeY -= box;
        if (snakeY < upSide){
            snakeY = canvas.height-(downSide+box);
        }
    }
    if (dir === 'right'){
        snakeX += box;
        if (snakeX > canvas.width-(rightSide+box)){
            snakeX = leftSide;
        }
    }
    if (dir === 'down'){
        snakeY += box;
        if (snakeY > canvas.width-(downSide+box)){
            snakeY = upSide;
        }
    }

    // eating senerio 
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        let random = Math.floor(Math.random()*cubs.length);
        food = {x: cubs[random].x, y: cubs[random].y}
    } else {
        //pop tail
        let tail = snake.pop();
        cubs.push(tail)
    }

    // detect end of game
    for (i=0; i<snake.length; i++){
        if (snakeX === snake[i].x && snakeY === snake[i].y) {
            gameOver();
        }
    }

    //new head make
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    for (i=0; i<cubs.length; i++){
        if (newHead.x === cubs[i].x && newHead.y === cubs[i].y){
            cubs.splice(i, 1)
        }
    }

    snake.unshift(newHead);

    //score draw
    window.requestAnimationFrame(scoureD);

    canTurn = true;
};

let game = setInterval(draw, 100);

function gameOver(){
    clearInterval(game);
    window.requestAnimationFrame(function(){
        ctx.font = "30px Arial Black";
        ctx.fillStyle = "#ed0202";
        ctx.textAlign = "center";
        ctx.fillText(`Game Over`, canvas.width/2, upSide + 40); 
    });
    
    document.addEventListener("keydown", function(event){
        if (event.keyCode === 13) {
            location.reload();
        }    
    }) 
}

/* food placing, and snake moving*/