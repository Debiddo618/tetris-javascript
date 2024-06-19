const grid = document.querySelector('.grid');


// adding 200 tetrominoes into the grid
for(let i=0;i<200;i++){
    const newDiv = document.createElement('div');
    grid.appendChild(newDiv);
}