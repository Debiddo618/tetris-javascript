const gameBoard = document.querySelector('.game-board');
const scoreDisplay = document.querySelector('.score');
const startBtn = document.querySelector('.start');

const ROW = 20;
const COL = 10;
let startPosition = [5,0];
// let currentTetromino = tetrominoes[Math.floor(Math.random()*tetrominoes.length)];
let currentTetromino = null;
let runGame = null;
let oPiece = false;
let score = 0;

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
    return gameBoard.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

const cells = Array.from(document.querySelectorAll('.cell'));

// Tetrominoes
const iTetromino = [[0, 1],[0,0],[0,2],[0,3]];
const jTetromino = [[0, 1],[0, 0],[0, 2],[-1, 2]];
const lTetromino = [[0, 1],[0, 0],[0, 2],[1, 2]];
const oTetromino = [[0, 0],[1, 0],[0, 1],[1, 1]];
const sTetromino = [[-1, 2],[-1, 1],[0, 1],[-2, 2]];
const tTetromino = [[0, 1],[-1, 1],[1, 1],[0, 2]];
const zTetromino = [[0, 2],[-1, 1],[0, 1],[1, 2]];

const tetrominoes = [iTetromino,jTetromino,lTetromino,oTetromino,sTetromino,tTetromino,zTetromino];


// place at origin
function origin(piece) {
    currentTetromino = piece.map(([x, y]) => [x + startPosition[0], y + startPosition[1]]);
    if (checkGameOver(currentTetromino)) {
        gameOver();
    } else {
        placeTetromino(currentTetromino);
    }
}

//place tetromino
function placeTetromino(piece){
    piece.forEach(([x, y]) => {
        getCell(x, y).classList.add('tetromino');
    });
}


// remove tetromino
function removeTetromino(piece) {
    piece.forEach(([x, y]) => {
        getCell(x, y).classList.remove('tetromino');
    });
}


// check if tetrominoes are out of bound
function outOfBound(piece) {
    return piece.some(([x, y]) => x < 0 || x >= COL || y >= ROW);
}

function spaceAvailable(piece){
    return piece.every(([x, y]) => !getCell(x, y).classList.contains('tetromino'));
}

// move down one cell
function moveDown(){
    removeTetromino(currentTetromino);
    const newPosition = currentTetromino.map(([x, y]) => [x, y + 1]);
    if (!outOfBound(newPosition) && spaceAvailable(newPosition)) {
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        placeTetromino(currentTetromino);
        checkCompleteRows();
        startNewTetromino();
    }
}

function moveLeft(){
    const newPosition = currentTetromino.map(([x, y]) => [x - 1, y]);
    removeTetromino(currentTetromino);
    if (!outOfBound(newPosition) && spaceAvailable(newPosition)) {
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        placeTetromino(currentTetromino);
    }

}
function moveRight(){
    const newPosition = currentTetromino.map(([x, y]) => [x + 1, y]);
    removeTetromino(currentTetromino);
    if (!outOfBound(newPosition) && spaceAvailable(newPosition)) {
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        placeTetromino(currentTetromino);
    }
}

function dropDown() {
    const newPosition = currentTetromino.map(([x, y]) => [x, y + 1]);
    removeTetromino(currentTetromino);
    if (!outOfBound(newPosition) && spaceAvailable(newPosition)) {
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        placeTetromino(currentTetromino);
    }
}

function rotate() {

  if(oPiece) return;
  
  // Find the center of rotation
  const [cx, cy] = currentTetromino[0];

  // Calculate the new positions after rotation
  let newPosition = currentTetromino.map(([x, y]) => {
      const newX = cx - (y - cy);
      const newY = cy + (x - cx);
      return [newX, newY];
  });

  removeTetromino(currentTetromino);

  // Check if the new positions are out of bounds or collide with existing tetrominoes
  if (!outOfBound(newPosition) && spaceAvailable(newPosition)) {
      currentTetromino = newPosition;
      placeTetromino(currentTetromino);
  } else {
      placeTetromino(currentTetromino);
  }
}

// Check and clear complete rows
function checkCompleteRows() {
  for (let y = 0; y < ROW; y++) {
    if (isRowComplete(y)) {
        clearRow(y);
        shiftRowsDown(y);
        score += 100;
        updateScore();
    }
  }
}

function isRowComplete(y) {
  for (let x = 0; x < COL; x++) {
      if (!getCell(x, y).classList.contains('tetromino')) {
          return false;
      }
  }
  return true;
}

function clearRow(y) {
  for (let x = 0; x < COL; x++) {
      getCell(x, y).classList.remove('tetromino');
  }
  shiftRowsDown(y);
}

function shiftRowsDown(fromRow) {
    for (let y = fromRow; y > 0; y--) {
        for (let x = 0; x < COL; x++) {
            const cell = getCell(x, y);
            const cellAbove = getCell(x, y - 1);
            cell.classList.toggle('tetromino', cellAbove.classList.contains('tetromino'));
        }
    }
    for (let x = 0; x < COL; x++) {
        getCell(x, 0).classList.remove('tetromino');
    }
}

function startNewTetromino() {
    const nextTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    oPiece = nextTetromino === oTetromino;
    origin(nextTetromino);
}

function checkGameOver(tetromino) {
    return tetromino.some(([x, y]) => {
        const adjustedX = x + startPosition[0];
        const adjustedY = y + startPosition[1];
        const cell = getCell(adjustedX, adjustedY);
        return cell && cell.classList.contains('tetromino');
    });
}

function gameOver() {
    clearInterval(runGame);
    alert('Game Over!');
}
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}



function startGame() {
    score = 0;
    updateScore();
    currentTetromino = [].concat(tetrominoes[Math.floor(Math.random() * tetrominoes.length)]);
    if (currentTetromino[0] === oTetromino[0]) {
        oPiece = true;
    } else {
        oPiece = false;
    }
    if (checkGameOver(currentTetromino)) {
        gameOver();
    } else {
        origin(currentTetromino);
        runGame = setInterval(moveDown, 1000);
    }
}


startBtn.addEventListener('click', startGame);

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        moveLeft();
    }
    if (event.key === 'ArrowRight') {
        moveRight();
    }
    if (event.key === 'ArrowDown') {
        dropDown();
    }
    if (event.key === 'ArrowUp') {
        rotate();
    }
});





