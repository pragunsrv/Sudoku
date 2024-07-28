let timerInterval;
let difficulty = 'easy';

document.addEventListener('DOMContentLoaded', () => {
    generateGrid();
    startTimer();
});

const initialGrids = {
    easy: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    medium: [
        [0, 0, 3, 0, 2, 0, 6, 0, 0],
        [9, 0, 0, 3, 0, 5, 0, 0, 1],
        [0, 0, 1, 8, 0, 6, 4, 0, 0],
        [0, 0, 8, 1, 0, 2, 9, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 8],
        [0, 0, 6, 7, 0, 8, 2, 0, 0],
        [0, 0, 2, 6, 0, 9, 5, 0, 0],
        [8, 0, 0, 2, 0, 3, 0, 0, 9],
        [0, 0, 5, 0, 1, 0, 3, 0, 0]
    ],
    hard: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 0, 8, 5],
        [0, 0, 1, 0, 2, 0, 0, 0, 0],
        [0, 0, 0, 5, 0, 7, 0, 0, 0],
        [0, 0, 4, 0, 0, 0, 1, 0, 0],
        [0, 9, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 7, 3],
        [0, 0, 2, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 4, 0, 0, 0, 9]
    ]
};

function generateGrid() {
    const tbody = document.getElementById('sudoku-grid');
    tbody.innerHTML = '';
    const initialGrid = initialGrids[difficulty];

    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.oninput = () => validateInput(input);
            input.onfocus = () => highlightCells(i, j);
            input.onblur = () => clearHighlights();
            if (initialGrid[i][j] !== 0) {
                input.value = initialGrid[i][j];
                input.disabled = true;
            }
            cell.appendChild(input);
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
}

function validateInput(cell) {
    const value = cell.value;
    if (value < 1 || value > 9) {
        cell.classList.add('error');
    } else {
        cell.classList.remove('error');
    }
}

function checkSudoku() {
    let valid = true;
    const rows = document.querySelectorAll('tbody tr');
    let grid = [];

    rows.forEach((row, rowIndex) => {
        let rowValues = [];
        row.querySelectorAll('input').forEach((cell, colIndex) => {
            let value = cell.value ? parseInt(cell.value) : 0;
            rowValues.push(value);
        });
        grid.push(rowValues);
    });

    document.querySelectorAll('input').forEach(cell => {
        cell.classList.remove('error', 'row-error', 'col-error', 'subgrid-error');
    });

    for (let i = 0; i < 9; i++) {
        let rowSet = new Set();
        let colSet = new Set();
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] !== 0) {
                let cell = rows[i].querySelectorAll('input')[j];
                if (rowSet.has(grid[i][j])) {
                    valid = false;
                    if (cell) cell.classList.add('row-error');
                } else {
                    rowSet.add(grid[i][j]);
                    if (cell) cell.classList.remove('row-error');
                }
            }
            if (grid[j][i] !== 0) {
                let cell = rows[j].querySelectorAll('input')[i];
                if (colSet.has(grid[j][i])) {
                    valid = false;
                    if (cell) cell.classList.add('col-error');
                } else {
                    colSet.add(grid[j][i]);
                    if (cell) cell.classList.remove('col-error');
                }
            }
        }
    }

    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            let subgridSet = new Set();
            for (let i = row; i < row + 3; i++) {
                for (let j = col; j < col + 3; j++) {
                    if (grid[i][j] !== 0) {
                        let cell = rows[i].querySelectorAll('input')[j];
                        if (subgridSet.has(grid[i][j])) {
                            valid = false;
                            if (cell) cell.classList.add('subgrid-error');
                        } else {
                            subgridSet.add(grid[i][j]);
                            if (cell) cell.classList.remove('subgrid-error');
                        }
                    }
                }
            }
        }
    }

    if (valid) {
        alert('Sudoku is correct!');
    } else {
        alert('Sudoku has errors.');
    }
}

function clearGrid() {
    document.querySelectorAll('input').forEach(cell => {
        if (!cell.disabled) {
            cell.value = '';
            cell.classList.remove('error', 'row-error', 'col-error', 'subgrid-error');
        }
    });
}

function giveHint() {
    const rows = document.querySelectorAll('tbody tr');
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = rows[i].querySelectorAll('input')[j];
            if (cell.value === '') {
                cell.value = initialGrids[difficulty][i][j];
                cell.classList.add('hint');
                return;
            }
        }
    }
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    let seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerElement.textContent = `Time: ${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, 1000);
}

function highlightCells(row, col) {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((r, rIdx) => {
        r.querySelectorAll('input').forEach((cell, cIdx) => {
            if (rIdx === row || cIdx === col || (Math.floor(rIdx / 3) === Math.floor(row / 3) && Math.floor(cIdx / 3) === Math.floor(col / 3))) {
                cell.classList.add('highlight');
            }
        });
    });
}

function clearHighlights() {
    document.querySelectorAll('input').forEach(cell => {
        cell.classList.remove('highlight');
    });
}

function changeDifficulty() {
    difficulty = document.getElementById('difficulty').value;
    generateGrid();
}

function saveGame() {
    const gridState = [];
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const rowState = [];
        row.querySelectorAll('input').forEach(cell => {
            rowState.push(cell.value);
        });
        gridState.push(rowState);
    });
    localStorage.setItem('sudokuGame', JSON.stringify(gridState));
}

function loadGame() {
    const savedState = JSON.parse(localStorage.getItem('sudokuGame'));
    if (savedState) {
        const rows = document.querySelectorAll('tbody tr');
        savedState.forEach((rowState, rowIndex) => {
            rowState.forEach((cellValue, colIndex) => {
                const cell = rows[rowIndex].querySelectorAll('input')[colIndex];
                cell.value = cellValue;
            });
        });
    }
}
