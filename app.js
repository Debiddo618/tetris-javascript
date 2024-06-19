const grid = document.querySelector('.grid');
const score = document.querySelector('.score');
const start = document.querySelector('.start');
const width = 10;



// adding 200 tetrominoes into the grid
for(let i=0;i<200;i++){
    const newDiv = document.createElement('div');
    grid.appendChild(newDiv);
}

const squares = Array.from(document.querySelectorAll('.grid div'));
console.log(squares);

// Tetrominoes
const iTetromino = [[0, 1], [1, 1], [2, 1], [3, 1]];
const jTetromino = [[0, 0], [1, 0], [2, 0], [2, 1]];
const lTetromino = [[0, 0], [1, 0], [2, 0], [0, 1]];
const oTetromino = [[0, 0], [1, 0], [0, 1], [1, 1]];
const sTetromino = [[1, 0], [2, 0], [0, 1], [1, 1]];
const tTetromino = [[0, 0], [1, 0], [2, 0], [1, 1]];
const zTetromino = [[0, 0], [1, 0], [1, 1], [2, 1]];



