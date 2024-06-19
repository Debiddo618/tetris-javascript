const gameBoard = document.querySelector('.game-board');
const score = document.querySelector('.score');
const start = document.querySelector('.start');

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
createGameBoard(gameBoard,10,20);

// get cell by coordinate
function getCell(x, y) {
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

let startPosition = [5,0];
let currentTetromino = tetrominoes[6];

//place tetromino
function placeTetromino(piece){
    piece.forEach(index =>{
        // index = [x,y]
        console.log({index})
        console.log({startPosition})
        getCell(index[0]+startPosition[0],index[1]+startPosition[1]).classList.add('tetromino');
    })
}

placeTetromino(tetrominoes[5]);

// remove tetromino
function removeTetromino(piece){
    piece.forEach(index =>{
        // index = [x,y]
        console.log({index})
        console.log({startPosition})
        getCell(index[0]+startPosition[0],index[1]+startPosition[1]).classList.remove('tetromino');
    })
}

removeTetromino(tetrominoes[5])

// place a random piece
// placeTetromino(tetrominoes[Math.floor(Math.random()*tetrominoes.length)]);


