const gameBoard = document.querySelector('.game-board');
const scoreDisplay = document.querySelector('.score');
const startBtn = document.querySelector('.start');
const resetBtn = document.querySelector('.reset');
const pauseBtn = document.querySelector('.pause');
const musicBtn = document.querySelector(".music-button");
const closeModalBtn = document.querySelector(".close-modal");
const modal = document.querySelector(".modal");
const modalContainer = document.querySelector(".modal-container");
const openModalBtn = document.querySelector(".rule-button");

const closeResultBtn = document.querySelector(".close-result");
const openResultBtn = document.querySelector(".result-button");
const resultModal = document.querySelector(".results-modal");
const resultContainer = document.querySelector(".results-container");

const resultMessage = document.querySelector("#result-message");
const resultTime = document.querySelector("#result-time");
const resultWrong = document.querySelector("#result-wrong");
const resultCorrect = document.querySelector("#result-correct");
const resultAccuracy = document.querySelector("#result-accuracy");


const ROW = 20;
const COL = 10;
let startPosition = [5, 0];
let currentTetromino = null;
let runGame = null;
let oPiece = false;
let score = 0;
let isPaused = false;
let isRunning = false;

// Create a game board
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
createGameBoard(gameBoard, COL, ROW);

// Get cell by coordinate
function getCell(x, y) {
    return gameBoard.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

// Tetrominoes
const iTetromino = { shape: [[0, 1], [0, 0], [0, 2], [0, 3]], color: 'cyan' };
const jTetromino = { shape: [[0, 1], [0, 0], [0, 2], [-1, 2]], color: 'blue' };
const lTetromino = { shape: [[0, 1], [0, 0], [0, 2], [1, 2]], color: 'orange' };
const oTetromino = { shape: [[0, 0], [1, 0], [0, 1], [1, 1]], color: 'yellow' };
const sTetromino = { shape: [[-1, 2], [-1, 1], [0, 1], [-2, 2]], color: 'green' };
const tTetromino = { shape: [[0, 1], [-1, 1], [1, 1], [0, 2]], color: 'purple' };
const zTetromino = { shape: [[0, 2], [-1, 1], [0, 1], [1, 2]], color: 'red' };

const tetrominoes = [iTetromino, jTetromino, lTetromino, oTetromino, sTetromino, tTetromino, zTetromino];

// Place at origin
function origin(piece) {
    const newPiece = {shape:piece.shape.map(([x, y]) => [x + startPosition[0], y + startPosition[1]]), color:piece.color};
    
    // Check if any cell of the new piece overlaps with an existing tetromino
    if (newPiece.shape.some(([x, y]) => {
        const cell = getCell(x, y);
        return cell && cell.classList.contains('tetromino');
    })) {
        gameOver();
        return;
    }
    
    currentTetromino = newPiece;
    placeTetromino(currentTetromino);
}

// Place tetromino
function placeTetromino(piece) {
    piece.shape.forEach(([x, y]) => {
        const cell = getCell(x, y);
        if (cell) {
            cell.classList.add('tetromino');
            cell.style.backgroundColor = piece.color;
        }
    });
}

// Remove tetromino
function removeTetromino(piece) {
    piece.shape.forEach(([x, y]) => {
        const cell = getCell(x, y);
        if (cell) {
            cell.classList.remove('tetromino');
            cell.style.backgroundColor = '';
        }
    });
}

// Check if tetrominoes are out of bounds
function outOfBound(piece) {
    return piece.some(([x, y]) => x < 0 || x >= COL || y >= ROW);
}

// Check if space is available
function spaceAvailable(piece) {
    return piece.every(([x, y]) => {
        const cell = getCell(x, y);
        return cell && !cell.classList.contains('tetromino');
    });
}

// Move down one cell
function moveDown() {
    removeTetromino(currentTetromino);
    const newPosition = {shape:currentTetromino.shape.map(([x, y]) => [x, y + 1]),color:currentTetromino.color};

    if (!outOfBound(newPosition.shape) && spaceAvailable(newPosition.shape)) {
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        placeTetromino(currentTetromino);
        checkCompleteRows();
        startNewTetromino();
    }
}

// Move left
function moveLeft() {
    const newPosition = {shape:currentTetromino.shape.map(([x, y]) => [x - 1, y]),color:currentTetromino.color};
    removeTetromino(currentTetromino);
    if (!outOfBound(newPosition.shape) && spaceAvailable(newPosition.shape)) {
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        placeTetromino(currentTetromino);
    }
}

// Move right
function moveRight() {
    const newPosition = {shape:currentTetromino.shape.map(([x, y]) => [x + 1, y]),color:currentTetromino.color};
    removeTetromino(currentTetromino);
    if (!outOfBound(newPosition.shape) && spaceAvailable(newPosition.shape)) {
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        placeTetromino(currentTetromino);
    }
}

// Drop down
function dropDown() {
    const newPosition = {shape:currentTetromino.shape.map(([x, y]) => [x, y + 1]),color:currentTetromino.color};
    removeTetromino(currentTetromino);
    if (!outOfBound(newPosition.shape) && spaceAvailable(newPosition.shape)) {
        currentTetromino = newPosition;
        placeTetromino(currentTetromino);
    } else {
        placeTetromino(currentTetromino);
    }
}

// Rotate
function rotate() {
    if (oPiece) return;
    const [cx, cy] = currentTetromino.shape[0];
    const newPosition = {shape:currentTetromino.shape.map(([x, y]) => {
        const newX = cx - (y - cy);
        const newY = cy + (x - cx);
        return [newX, newY];
    }),color:currentTetromino.color};

    removeTetromino(currentTetromino);
    if (!outOfBound(newPosition.shape) && spaceAvailable(newPosition.shape)) {
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

// Check if row is complete
function isRowComplete(y) {
    for (let x = 0; x < COL; x++) {
        if (!getCell(x, y).classList.contains('tetromino')) {
            return false;
        }
    }
    return true;
}

// Clear a row
function clearRow(y) {
    for (let x = 0; x < COL; x++) {
        const cell = getCell(x, y);
        cell.classList.remove('tetromino');
        cell.style.backgroundColor = '';
    }
}

// Shift rows down
function shiftRowsDown(fromRow) {
    for (let y = fromRow; y > 0; y--) {
        for (let x = 0; x < COL; x++) {
            const cell = getCell(x, y);
            const cellAbove = getCell(x, y - 1);
            cell.classList.toggle('tetromino', cellAbove.classList.contains('tetromino'));
            cell.style.backgroundColor = cellAbove.style.backgroundColor;
        }
    }
}

// Start a new tetromino
function startNewTetromino() {
    if(isRunning){
        const nextTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
        oPiece = nextTetromino === oTetromino;
        origin(nextTetromino);
    }
}

// Check game over
function checkGameOver(tetromino) {
    return tetromino.some(([x, y]) => {
        const cell = getCell(x, y);
        return cell && cell.classList.contains('tetromino');
    });
}

// Game over
function gameOver() {
    clearInterval(runGame);
    isRunning = false;
    resultMessage.innerText = `Score: ${score}`;
    resultCorrect.innerText = score/100;
    resultContainer.style.display = "flex";
    resultModal.style.display = "flex";
    openResultBtn.style.display = "inline-flex";
}

// Update score
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Start game
function startGame() {
    if (isRunning) return;
    isRunning = true;
    score = 0;
    updateScore();
    currentTetromino = null;
    startNewTetromino();
    runGame = setInterval(moveDown, 1000);
}

// clear game board
function clearGameBoard() {
    const cells = gameBoard.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('tetromino');
        cell.style.backgroundColor = '';
    });
}

// Reset game function
function resetGame() {
    clearInterval(runGame);
    score = 0;
    updateScore();
    clearGameBoard();
    currentTetromino = null;
    isPaused = false;
    isRunning = false;
    pauseBtn.textContent = 'Pause';
}

// Pause game
function togglePause() {
    if (isPaused) {
        runGame = setInterval(moveDown, 1000);
        pauseBtn.textContent = 'Pause';
    } else {
        clearInterval(runGame);
        pauseBtn.textContent = 'Resume';
    }
    isPaused = !isPaused;
}

// play or mute music
function muteMusic() {
    if (document.querySelector("#audio").paused) {
      document.querySelector("#audio").play();
      musicBtn.innerText = "Mute Music";
    } else {
      document.querySelector("#audio").pause();
      musicBtn.innerText = "Play Music";
    }
}

// close modal and start the game
closeModalBtn.addEventListener("click", () => {
    console.log("licked")
    modal.style.display = "none";
    modalContainer.style.display = "none";
});

// open modal and pause the game
openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    modalContainer.style.display = "flex";
});

// close result modal
closeResultBtn.addEventListener("click", () => {
    resultContainer.style.display = "none";
    resultModal.style.display = "none";
});

// open result modal
openResultBtn.addEventListener("click", () => {
resultContainer.style.display = "flex";
resultModal.style.display = "flex";
});

musicBtn.addEventListener("click", muteMusic);
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
pauseBtn.addEventListener('click', togglePause)


document.addEventListener('keydown', function(event) {
    if (!isPaused) {
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
    }
});
