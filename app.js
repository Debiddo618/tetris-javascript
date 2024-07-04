const gameBoard = document.querySelector('.game-board');
const score = document.querySelector('.score');
const startBtn = document.querySelector('.start');

const ROW = 20;
const COL = 10;
let startPosition = [5,0];
// let currentTetromino = tetrominoes[Math.floor(Math.random()*tetrominoes.length)];
let currentTetromino = null;
let runGame = null;
let oPiece = false;

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


// remove tetromino
function removeTetromino(piece) {
    for (let i = 0; i < piece.length; i++) {
        let x = piece[i][0];
        let y = piece[i][1];
        getCell(x, y).classList.remove('tetromino');
    }
}


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
        checkCompleteRows();
    } else {
        clearInterval(runGame);
        placeTetromino(currentTetromino);
        checkCompleteRows();
    }
}

function moveLeft(){
    let newPosition = currentTetromino.map(index => [index[0] - 1, index[1]]);
    removeTetromino(currentTetromino);
    if (!outOfBound(newPosition)) {
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        placeTetromino(currentTetromino);
    }

}
function moveRight(){
    let newPosition = currentTetromino.map(index => [index[0] + 1, index[1]]);
    removeTetromino(currentTetromino);
    if (!outOfBound(newPosition)) {
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        placeTetromino(currentTetromino);
    }
}

function dropDown(){
    let newPosition = currentTetromino.map(index => [index[0], index[1]+1]);
    removeTetromino(currentTetromino);
    if (!outOfBound(newPosition)) {
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
          console.log(gameBoard)
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
          let currentCell = getCell(x, y);
          let cellAbove = getCell(x, y - 1);
          // Copy the class from the cell above
          if (cellAbove.classList.contains('tetromino')) {
              currentCell.classList.add('tetromino');
              cellAbove.classList.remove('tetromino');
          } else {
              currentCell.classList.remove('tetromino');
          }
      }
  }
  
  // Clear the top row
  for (let x = 0; x < COL; x++) {
      getCell(x, 0).classList.remove('tetromino');
  }
}
function startGame() {
    currentTetromino = [].concat(tetrominoes[Math.floor(Math.random() * tetrominoes.length)]);
    // currentTetromino = [].concat(tetrominoes[3]);
    // currentTetromino = oTetromino;
    if(currentTetromino[0]===oTetromino[0]){
      oPiece=true;
    }else{
      console.log("it is false")
      oPiece=false;
    }
    origin(currentTetromino);
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
    if (event.key === 'ArrowDown') {
        dropDown();
    }
    if (event.key === 'ArrowUp') {
        rotate();
    }
});





