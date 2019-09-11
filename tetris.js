
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const box = 20;

let newShape;

let play = true;

let speed = 500;

const leftSide = 20;
const rightSide = 20;
const upSide = 100;
const downSide = 20;

let rows = [];
for (let i=0; i<(canvas.height-(upSide+downSide))/box; i++){
    rows.push([]);
    for (j=0; j<(canvas.width-(rightSide+leftSide))/box; j++){
        rows[i].push({y: upSide+box*i, x: leftSide+box*j, color: '#bbbbbb', endPoint: false});
    }
}

//making mew shape
let shapes = {
    square: {
        x: [Math.floor(rows[0].length/2), Math.floor(rows[0].length/2)+1,
        Math.floor(rows[0].length/2), Math.floor(rows[0].length/2)+1],
        y: [0, 0, 1, 1],
        color: '#ff0000'
    },
    line: {
        x: [Math.floor(rows[0].length/2), Math.floor(rows[0].length/2),
        Math.floor(rows[0].length/2), Math.floor(rows[0].length/2)],
        y: [0, 1, 2, 3],
        color: '#8f00ff'
    },
    T: {
        x: [Math.floor(rows[0].length/2), Math.floor(rows[0].length/2),
        Math.floor(rows[0].length/2), Math.floor(rows[0].length/2)+1],
        y: [0, 1, 2, 1],
        color: '#0004ff'
    },
    RL: {
        x: [Math.floor(rows[0].length/2), Math.floor(rows[0].length/2),
        Math.floor(rows[0].length/2), Math.floor(rows[0].length/2)+1],
        y: [0, 1, 2, 2],
        color: '#ff6800'
    },
    LL: {
        x: [Math.floor(rows[0].length/2), Math.floor(rows[0].length/2),
        Math.floor(rows[0].length/2), Math.floor(rows[0].length/2)-1],
        y: [0, 1, 2, 2],
        color: '#ff00f3'
    },
    S: {
        x: [Math.floor(rows[0].length/2), Math.floor(rows[0].length/2)+1,
        Math.floor(rows[0].length/2), Math.floor(rows[0].length/2)-1],
        y: [0, 0, 1, 1],
        color: '#fbff00'
    },
    Z: {
        x: [Math.floor(rows[0].length/2), Math.floor(rows[0].length/2)-1,
        Math.floor(rows[0].length/2), Math.floor(rows[0].length/2)+1],
        y: [0, 0, 1, 1],
        color: '#26bf1f'
    }
}

function Shape(type) {
    this.color = shapes[type].color;
    this.x = [...shapes[type].x];
    this.y = [...shapes[type].y];

    // chech if game over
    for (let i=0; i<4; i++){
        if (rows[this.y[i]][this.x[i]].endPoint === true) { 
            gameOver();
        }
    }
}


function makeNewShape() {
    switch (Math.floor(Math.random()*7)) {
        case 0:
            newShape = new Shape('line');    
          break;
        case 1:
            newShape = new Shape('square');    
          break;
        case 2:
            newShape = new Shape('T');    
          break;
        case 3:
            newShape = new Shape('LL');   
          break;
        case 4:
            newShape = new Shape('RL');  
          break;
        case 5:
            newShape = new Shape('S');    
          break;
        case 6:
            newShape = new Shape('Z');    
          break;
        default:
            newShape = new Shape('square');    
    }
}

//make first shape
makeNewShape();
for (let i=0; i<4; i++) {
    try {
        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
    } catch(error) {
        console.log(error)
    };
};

let score = 0;

function canGoDown() {
    //shape stoping
    for (let i=0; i<4; i++) {
        if (newShape.y[i] === rows.length-1 ||
            rows[newShape.y[i]+1][newShape.x[i]].endPoint !== false) return false
    }
    return true
}

function canGoLeft() {
    //shape stoping
    for (let i=0; i<4; i++) {
        if (newShape.x[i] === 0 ||
            rows[newShape.y[i]][newShape.x[i]-1].endPoint === true) return false
    }
    return true
}

function canGoRight() {
    //shape stoping
    for (let i=0; i<4; i++) {
        if (newShape.x[i] === rows[0].length-1 ||
            rows[newShape.y[i]][newShape.x[i]+1].endPoint === true) return false
    }
    return true
}

// check if row is full
function fullRow(){
    for (let i=0; i<rows.length; i++){
        let temp = rows[i].filter(cube => cube.endPoint === false)
        if (temp.length === 0){
            score++;
            if (score % 5 === 0){
                speed = speed*(9/10)
            }

            for (let k=i; k>0; k--){
                if (k ===0){
                    for (let j=0; j<rows[k].length; j++)
                    rows[k][j].color = '#bbbbbb'
                    rows[k][j].endPoint = false
                } else { 
                    for (let j=0; j<rows[k].length; j++){
                    //solve prob
                        if (rows[k][j].endPoint === true){
                            rows[k][j].color = rows[k-1][j].color;
                            rows[k][j].endPoint = rows[k-1][j].endPoint;
                        
                        }
                        if (rows[k-1][j].endPoint === true){
                            rows[k][j].color = rows[k-1][j].color;
                            rows[k][j].endPoint = rows[k-1][j].endPoint;
                        }
                    }
                }
            }
        }
    }
};

function drawBoard() {
    //draw board
    ctx.fillStyle = '#5a5a5a';
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

    //draw game
    for (let i=0; i<rows.length; i++){
        for (let j=0; j<rows[i].length; j++) {
            let boxInf = rows[i][j];
            ctx.fillStyle = boxInf.color;
            ctx.textAlign = "left";
            ctx.fillRect(boxInf.x, boxInf.y, box, box);
            ctx.strokeRect(boxInf.x , boxInf.y, box, box);
        }
    }
}

function drawScore() {
    // draw score
    ctx.font = "30px Lucida Console";
    ctx.textAlign = "left";
    ctx.fillStyle = '#e32323';
    ctx.fillText(`score: ${score}`, leftSide, upSide/2); 
}

// moving
document.addEventListener("keydown", function(event){
    // going left
    if (event.keyCode === 37 && canGoLeft() && play === true) {
        let oldShape = newShape;
        for (let i=0; i<4; i++) {
            rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
        };
        for (let i=0; i<4; i++) {
            newShape.x[i]--;
            rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
        };
        window.requestAnimationFrame(drawBoard)
        window.requestAnimationFrame(drawScore)
    }
    // turning shape
    if (event.keyCode === 38 && play === true) {
        //square don't change
        //line
        if (newShape.color === '#8f00ff'){   
            if (newShape.x[0] === newShape.x[1] &&
                rows[newShape.y[1]][newShape.x[1]+1].endPoint === false &&
                rows[newShape.y[1]][newShape.x[1]-1].endPoint === false &&
                rows[newShape.y[1]][newShape.x[1]-2].endPoint === false ){
                let oldShape = newShape;
                for (let i=0; i<4; i++) {
                    if (i !== 1) {
                        rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
                    }
                } 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]++;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]--;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.x[i]--;
                        newShape.x[i]--;
                        newShape.y[i]--;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            }
            else if (newShape.y[0] === newShape.y[1]){
                let oldShape = newShape;
                for (let i=0; i<4; i++) {
                    if (i !== 1){
                        rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
                    }
                } 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]--;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]++;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.x[i]++;
                        newShape.x[i]++;
                        newShape.y[i]++;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            }
        }
        //T
        if (newShape.color === '#0004ff'){
            if (newShape.y[1] === newShape.y[0]+1 &&
                rows[newShape.y[1]][newShape.x[1]-1].endPoint === false ){
                let oldShape = newShape;
                rows[oldShape.y[2]][oldShape.x[2]].color = '#bbbbbb'; 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]--;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]++;
                        newShape.y[i]--;
                    }
                    if (i === 3) {
                        newShape.x[i]--;
                        newShape.y[i]--;
                    }
                };    
            }
            else if (newShape.x[1] === newShape.x[0]+1 &&
                rows[newShape.y[1]+1][newShape.x[1]].endPoint === false ){
                let oldShape = newShape;
                rows[oldShape.y[2]][oldShape.x[2]].color = '#bbbbbb'; 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]++;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]--;
                        newShape.y[i]--;
                    }
                    if (i === 3) {
                        newShape.x[i]--;
                        newShape.y[i]++;
                    }
                };    
            }
            else if (newShape.y[1] === newShape.y[0]-1 &&
                rows[newShape.y[1]][newShape.x[1]+1].endPoint === false ){
                let oldShape = newShape;
                rows[oldShape.y[2]][oldShape.x[2]].color = '#bbbbbb'; 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]++;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]--;
                        newShape.y[i]++;
                    }
                    if (i === 3) {
                        newShape.x[i]++;
                        newShape.y[i]++;
                    }
                };    
            }
            else if (newShape.x[1] === newShape.x[0]-1 &&
                rows[newShape.y[1]-1][newShape.x[1]].endPoint === false ){
                let oldShape = newShape;
                rows[oldShape.y[2]][oldShape.x[2]].color = '#bbbbbb'; 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]--;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]++;
                        newShape.y[i]++;
                    }
                    if (i === 3) {
                        newShape.x[i]++;
                        newShape.y[i]--;
                    }
                };    
            }
        }
        //RL
        if (newShape.color === '#ff6800'){
            if (newShape.y[1] === newShape.y[0]+1 &&
                rows[newShape.y[1]][newShape.x[1]-1].endPoint === false &&
                rows[newShape.y[1]][newShape.x[1]+1].endPoint === false &&
                rows[newShape.y[1]-1][newShape.x[1]+1].endPoint === false ){
                let oldShape = newShape;
                for (let i=0; i<4; i++) {
                    if (i !== 1) {
                        rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
                    }
                } 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]--;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]++;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.y[i]--;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            }
            else if (newShape.x[1] === newShape.x[0]+1 &&
                    rows[newShape.y[1]+1][newShape.x[1]].endPoint === false &&
                    rows[newShape.y[1]-1][newShape.x[1]].endPoint === false &&
                    rows[newShape.y[1]-1][newShape.x[1]-1].endPoint === false ){
                let oldShape = newShape;
                for (let i=0; i<4; i++) {
                    if (i !== 1) {
                        rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
                    }
                } 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]++;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]--;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.x[i]--;
                        newShape.x[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            } 
            else if (newShape.y[1] === newShape.y[0]-1 &&
                    rows[newShape.y[1]][newShape.x[1]+1].endPoint === false &&
                    rows[newShape.y[1]][newShape.x[1]-1].endPoint === false &&
                    rows[newShape.y[1]+1][newShape.x[1]-1].endPoint === false ){
                let oldShape = newShape;
                for (let i=0; i<4; i++) {
                    if (i !== 1){
                        rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
                    }
                } 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]++;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]--;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.y[i]++;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            } 
            else if (newShape.x[1] === newShape.x[0]-1 &&
                    rows[newShape.y[1]-1][newShape.x[1]].endPoint === false &&
                    rows[newShape.y[1]+1][newShape.x[1]].endPoint === false &&
                    rows[newShape.y[1]+1][newShape.x[1]+1].endPoint === false ){
                let oldShape = newShape;
                for (let i=0; i<4; i++) {
                    if (i !== 1){
                        rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
                    }
                } 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]--;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]++;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.x[i]++;
                        newShape.x[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            } 
        }
        //LL
        if (newShape.color === '#ff00f3'){
            if (newShape.y[1] === newShape.y[0]+1 &&
                rows[newShape.y[1]][newShape.x[1]-1].endPoint === false &&
                rows[newShape.y[1]][newShape.x[1]+1].endPoint === false &&
                rows[newShape.y[1]+1][newShape.x[1]+1].endPoint === false ){
                let oldShape = newShape;
                for (let i=0; i<4; i++) {
                    if (i !== 1) {
                        rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
                    }
                } 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]--;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]++;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.x[i]++;
                        newShape.x[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            }
            else if (newShape.x[1] === newShape.x[0]+1 &&
                    rows[newShape.y[1]+1][newShape.x[1]].endPoint === false &&
                    rows[newShape.y[1]-1][newShape.x[1]].endPoint === false &&
                    rows[newShape.y[1]-1][newShape.x[1]+1].endPoint === false ){
                let oldShape = newShape;
                for (let i=0; i<4; i++) {
                    if (i !== 1) {
                        rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
                    }
                } 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]++;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]--;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.y[i]--;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            } 
            else if (newShape.y[1] === newShape.y[0]-1 &&
                    rows[newShape.y[1]][newShape.x[1]+1].endPoint === false &&
                    rows[newShape.y[1]][newShape.x[1]-1].endPoint === false &&
                    rows[newShape.y[1]-1][newShape.x[1]-1].endPoint === false ){
                let oldShape = newShape;
                for (let i=0; i<4; i++) {
                    if (i !== 1) {
                        rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
                    }
                } 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]++;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]--;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.x[i]--;
                        newShape.x[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            } 
            else if (newShape.x[1] === newShape.x[0]-1 &&
                    rows[newShape.y[1]-1][newShape.x[1]].endPoint === false &&
                    rows[newShape.y[1]+1][newShape.x[1]].endPoint === false &&
                    rows[newShape.y[1]+1][newShape.x[1]-1].endPoint === false ){
                let oldShape = newShape;
                for (let i=0; i<4; i++) {
                    if (i !== 1) {
                        rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
                    }
                } 
                for (let i=0; i<4; i++) {
                    if (i === 0) {
                        newShape.x[i]--;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 2) {
                        newShape.x[i]++;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.y[i]++;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            } 
        }
        //S
        if (newShape.color === '#fbff00'){
            if (newShape.y[0] === newShape.y[1] &&
                rows[newShape.y[2]][newShape.x[2]+1].endPoint === false &&
                rows[newShape.y[2]+1][newShape.x[2]+1].endPoint === false  ){
                let oldShape = newShape;
                rows[oldShape.y[1]][oldShape.x[1]].color = '#bbbbbb';
                rows[oldShape.y[3]][oldShape.x[3]].color = '#bbbbbb';
                for (let i=0; i<4; i++) {
                    if (i === 1) {
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.x[i]++;
                        newShape.x[i]++;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            }
            else if (newShape.y[1] === newShape.y[2]&&
                    rows[newShape.y[0]][newShape.x[0]+1].endPoint === false &&
                    rows[newShape.y[2]][newShape.x[2]-1].endPoint === false){
                let oldShape = newShape;
                rows[oldShape.y[1]][oldShape.x[1]].color = '#bbbbbb';
                rows[oldShape.y[3]][oldShape.x[3]].color = '#bbbbbb';
                for (let i=0; i<4; i++) {
                    if (i === 1) {
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.x[i]--;
                        newShape.x[i]--;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            }
        }
        //Z
        if (newShape.color === '#26bf1f'){
            if (newShape.y[0] === newShape.y[1] &&
                rows[newShape.y[2]][newShape.x[2]-1].endPoint === false &&
                rows[newShape.y[2]+1][newShape.x[2]-1].endPoint === false  ){
                let oldShape = newShape;
                rows[oldShape.y[1]][oldShape.x[1]].color = '#bbbbbb';
                rows[oldShape.y[3]][oldShape.x[3]].color = '#bbbbbb';
                for (let i=0; i<4; i++) {
                    if (i === 1) {
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.x[i]--;
                        newShape.x[i]--;
                        newShape.y[i]++;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            }
            else if (newShape.y[1] === newShape.y[2]&&
                    rows[newShape.y[0]][newShape.x[0]-1].endPoint === false &&
                    rows[newShape.y[2]][newShape.x[2]+1].endPoint === false){
                let oldShape = newShape;
                rows[oldShape.y[1]][oldShape.x[1]].color = '#bbbbbb';
                rows[oldShape.y[3]][oldShape.x[3]].color = '#bbbbbb';
                for (let i=0; i<4; i++) {
                    if (i === 1) {
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                    if (i === 3) {
                        newShape.x[i]++;
                        newShape.x[i]++;
                        newShape.y[i]--;
                        rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
                    }
                };    
            }
        }
        window.requestAnimationFrame(drawBoard)
        window.requestAnimationFrame(drawScore)
    }
    // going right
    if (event.keyCode === 39 && canGoRight() && play === true) {
        let oldShape = newShape;
        for (let i=0; i<4; i++) {
            rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
        };
        for (let i=0; i<4; i++) {
            newShape.x[i]++;
            rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
        };
        window.requestAnimationFrame(drawBoard)
        window.requestAnimationFrame(drawScore)
    }

    // going faster: down
    if (event.keyCode === 40 && play === true) {
        draw();
    }    
});

function draw(){
    window.requestAnimationFrame(drawBoard)

    if (canGoDown()) {
        //shape going down
        let oldShape = newShape;
        for (let i=0; i<4; i++) {
            rows[oldShape.y[i]][oldShape.x[i]].color = '#bbbbbb';
        };
        for (let i=0; i<4; i++) {
            newShape.y[i]++;
            rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
        };
    } else {
        for (let i=0; i<4; i++) {
            rows[newShape.y[i]][newShape.x[i]].endPoint = true;
        }

        makeNewShape()

        for (let i=0; i<4; i++) {
            rows[newShape.y[i]][newShape.x[i]].color = newShape.color;
        };

        fullRow()
    };
    window.requestAnimationFrame(drawScore)
};

let game = setInterval(draw, speed);

function gameOver(){
    play = false;
    clearInterval(game);
    window.requestAnimationFrame(function(){
        ctx.font = "30px Arial Black";
        ctx.fillStyle = "#ed0202";
        ctx.textAlign = "center";
        ctx.fillText(`Game Over`, canvas.width/2, canvas.height/2); 
    });

    document.addEventListener("keydown", function(event){
        if (event.keyCode === 13) {
            location.reload();
        }    
    }) 
}

/*
 * Immutable objects - how to copy an object ({...object}, [...array])
 */
