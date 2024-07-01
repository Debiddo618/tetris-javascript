const gameBoard = document.querySelector('.game-board');
const score = document.querySelector('.score');
const startBtn = document.querySelector('.start');

const ROW = 20;
const COL = 10;
let startPosition = [5,0];
// let currentTetromino = tetrominoes[Math.floor(Math.random()*tetrominoes.length)];
let currentTetromino = null;
let runGame = null;

// create a game board
function createGameBoard(board, cols, rows) {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            board.appendChild(cell);
        }
    }
}
createGameBoard(gameBoard,COL,ROW);

// get cell by coordinate
function getCell(x, y) {
    console.log(gameBoard.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`))
    return gameBoard.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

const cells = Array.from(document.querySelectorAll('.cell'));

// Tetrominoes
const iTetromino = [[0, 0],[0,1],[0,2],[0,3]];
const jTetromino = [[0, 0],[0, 1],[0, 2],[-1, 2]];
const lTetromino = [[0, 0],[0, 1],[0, 2],[1, 2]];
const oTetromino = [[0, 0],[1, 0],[0, 1],[1, 1]];
const sTetromino = [[-1, 1],[0, 1],[-2, 2],[-1, 2]];
const tTetromino = [[-1, 1],[0, 1],[1, 1],[0, 2]];
const zTetromino = [[-1, 1],[0, 1],[0, 2],[1, 2]];

const tetrominoes = [iTetromino,jTetromino,lTetromino,oTetromino,sTetromino,tTetromino,zTetromino];


// place at origin
function origin(piece) {
    for (let i = 0; i < piece.length; i++) {
        let x = piece[i][0] + startPosition[0];
        let y = piece[i][1] + startPosition[1];
        currentTetromino[i]=[x,y];
        getCell(x, y).classList.add('tetromino');
    }
}

//place tetromino
function placeTetromino(piece){
    piece.forEach(index => {
        // index = [x,y]
        getCell(index[0],index[1]).classList.add('tetromino');
    })
}

// placeTetromino(tetrominoes[5]);

// remove tetromino
function removeTetromino(piece) {
    for (let i = 0; i < piece.length; i++) {
        let x = piece[i][0];
        let y = piece[i][1];
        getCell(x, y).classList.remove('tetromino');
    }
}

// removeTetromino(tetrominoes[5])

// place a random piece
// placeTetromino(tetrominoes[Math.floor(Math.random()*tetrominoes.length)]);

// check if tetrominoes are out of bound
function outOfBound(piece) {
    for (let i = 0; i < piece.length; i++) {
        let x = piece[i][0];
        let y = piece[i][1];
        if (x < 0 || x >= COL || y < 0 || y >= ROW) {
            return true;
        }
    }
    return false;
}

function spaceAvailable(piece){
    for (let i = 0; i < piece.length; i++) {
        let x = piece[i][0];
        let y = piece[i][1];
        if(getCell(x,y).classList.contains('tetromino')){
            return false
        }
    }
    return true;
}

// move down one cell
function moveDown(){
    removeTetromino(currentTetromino);
    let newPosition = currentTetromino.map(index => [index[0], index[1] + 1]);
    if (!outOfBound(newPosition)) {
        if(spaceAvailable(newPosition)){
            currentTetromino = newPosition;
            placeTetromino(currentTetromino);
        }
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        clearInterval(runGame);
        placeTetromino(currentTetromino);
    }
}

function moveLeft(){
    console.log("moving to the left")
    let newPosition = currentTetromino.map(index => [index[0] - 1, index[1]]);
    removeTetromino(currentTetromino);
    console.log(newPosition);
    if (!outOfBound(newPosition)) {
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        placeTetromino(currentTetromino);
    }

}
function moveRight(){
    console.log("moving to the right")
    let newPosition = currentTetromino.map(index => [index[0] + 1, index[1]]);
    removeTetromino(currentTetromino);
    console.log(newPosition);
    if (!outOfBound(newPosition)) {
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        placeTetromino(currentTetromino);
    }

}

// const runGame = setInterval(moveDown,1000);

function startGame() {
    // currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    currentTetromino = jTetromino;
    console.log({currentTetromino})
    origin(currentTetromino);
    // placeTetromino(currentTetromino);
    runGame = setInterval(moveDown, 1000);
}


startBtn.addEventListener('click', startGame);

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        moveLeft();
    }
    if (event.key === 'ArrowRight') {
        moveRight();
    }
});





