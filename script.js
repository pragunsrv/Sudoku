let timerInterval;

document.addEventListener('DOMContentLoaded', () => {
    generateGrid();
    startTimer();
});

const initialGrid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

function generateGrid() {
    const tbody = document.getElementById('sudoku-grid');
    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.oninput = () => validateInput(input);
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
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let value = grid[row + i][col + j];
                    let cell = rows[row + i].querySelectorAll('input')[col + j];
                    if (value !== 0) {
                        if (subgridSet.has(value)) {
                            valid = false;
                            if (cell) cell.classList.add('subgrid-error');
                        } else {
                            subgridSet.add(value);
                            if (cell) cell.classList.remove('subgrid-error');
                        }
                    }
                }
            }
        }
    }

    if (valid) {
        alert('Sudoku is valid!');
    } else {
        alert('Sudoku is invalid!');
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

function startTimer() {
    const timerElement = document.getElementById('timer');
    let seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerElement.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }, 1000);
}

function giveHint() {
    const emptyCells = [];
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach((row, rowIndex) => {
        row.querySelectorAll('input').forEach((cell, colIndex) => {
            if (cell.value === '' && !cell.disabled) {
                emptyCells.push({ rowIndex, colIndex, cell });
            }
        });
    });

    if (emptyCells.length === 0) {
        alert('No empty cells to fill!');
        return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { rowIndex, colIndex, cell } = emptyCells[randomIndex];
    const correctValue = initialGrid[rowIndex][colIndex];
    cell.value = correctValue;
    cell.classList.add('hint');
}
