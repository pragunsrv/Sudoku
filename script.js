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
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 1, 0, 9, 0, 2, 0, 7],
        [0, 0, 0, 6, 0, 3, 0, 0, 0],
        [0, 7, 0, 0, 6, 0, 0, 3, 0],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [0, 3, 0, 0, 2, 0, 0, 7, 0],
        [0, 0, 0, 3, 0, 5, 0, 0, 0],
        [7, 0, 3, 0, 8, 0, 9, 0, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    hard: [
        [0, 0, 0, 2, 0, 0, 0, 6, 3],
        [3, 0, 0, 0, 0, 5, 4, 0, 1],
        [0, 0, 1, 0, 0, 3, 9, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 9, 0],
        [0, 0, 0, 5, 3, 8, 0, 0, 0],
        [0, 3, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 6, 3, 0, 0, 5, 0, 0],
        [5, 0, 3, 7, 0, 0, 0, 0, 8],
        [4, 7, 0, 0, 0, 1, 0, 0, 0]
    ]
};

let difficulty = 'easy';
let errorCount = 0;
let moveHistory = [];
let timerInterval;
let isPaused = false;

document.addEventListener('DOMContentLoaded', () => {
    generateGrid();
    enableKeyboardControls();
});

function generateGrid() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    const grid = initialGrids[difficulty];

    grid.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, colIndex) => {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.value = cell !== 0 ? cell : '';
            input.disabled = cell !== 0;
            input.addEventListener('input', () => validateInput(input, rowIndex, colIndex));
            input.addEventListener('focus', () => highlightCells(rowIndex, colIndex));
            input.addEventListener('blur', clearHighlights);
            td.appendChild(input);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    clearGrid();
    clearInterval(timerInterval);
    startTimer();
}

function validateInput(input, row, col) {
    const value = input.value;
    if (value < 1 || value > 9 || isNaN(value)) {
        input.classList.add('error');
        errorCount++;
    } else {
        input.classList.remove('error');
    }
    document.getElementById('error-count').textContent = `Errors: ${errorCount}`;
    moveHistory.push({ row, col, value });
}

function checkSudoku() {
    const grid = getGrid();
    const rows = document.querySelectorAll('tbody tr');
    let valid = true;

    // Clear previous errors
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('error', 'row-error', 'col-error', 'subgrid-error');
    });

    // Check rows and columns
    for (let i = 0; i < 9; i++) {
        let rowSet = new Set();
        let colSet = new Set();
        for (let j = 0; j < 9; j++) {
            const rowValue = grid[i][j];
            const colValue = grid[j][i];

            if (rowValue !== 0) {
                if (rowSet.has(rowValue)) {
                    valid = false;
                    highlightError(i, j, 'row-error');
                } else {
                    rowSet.add(rowValue);
                }
            }

            if (colValue !== 0) {
                if (colSet.has(colValue)) {
                    valid = false;
                    highlightError(j, i, 'col-error');
                } else {
                    colSet.add(colValue);
                }
            }
        }
    }

    // Check subgrids
    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            let subgridSet = new Set();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const value = grid[row + i][col + j];
                    if (value !== 0) {
                        if (subgridSet.has(value)) {
                            valid = false;
                            highlightError(row + i, col + j, 'subgrid-error');
                        } else {
                            subgridSet.add(value);
                        }
                    }
                }
            }
        }
    }

    if (valid) {
        alert('Sudoku is correct!');
    } else {
        alert('Sudoku has errors. Check highlighted cells.');
    }
}

function highlightError(row, col, className) {
    const rows = document.querySelectorAll('tbody tr');
    const cell = rows[row].cells[col].querySelector('input');
    cell.classList.add(className);
}

function getGrid() {
    const grid = [];
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('input');
        const rowArray = [];
        cells.forEach(cell => {
            rowArray.push(cell.value === '' ? 0 : parseInt(cell.value));
        });
        grid.push(rowArray);
    });
    return grid;
}

function enableKeyboardControls() {
    document.addEventListener('keydown', event => {
        const focusedElement = document.activeElement;
        if (focusedElement.tagName === 'INPUT') {
            const cell = focusedElement.parentElement;
            const row = cell.parentElement.rowIndex;
            const col = cell.cellIndex;

            switch (event.key) {
                case 'ArrowUp':
                    if (row > 0) moveFocus(row - 1, col);
                    break;
                case 'ArrowDown':
                    if (row < 8) moveFocus(row + 1, col);
                    break;
                case 'ArrowLeft':
                    if (col > 0) moveFocus(row, col - 1);
                    break;
                case 'ArrowRight':
                    if (col < 8) moveFocus(row, col + 1);
                    break;
            }
        }
    });
}

function moveFocus(row, col) {
    const rows = document.querySelectorAll('tbody tr');
    const cell = rows[row].cells[col].querySelector('input');
    cell.focus();
}

function clearGrid() {
    document.querySelectorAll('input').forEach(input => {
        if (!input.disabled) {
            input.value = '';
            input.classList.remove('error', 'row-error', 'col-error', 'subgrid-error', 'highlight', 'hint');
        }
    });
    errorCount = 0;
    moveHistory = [];
    document.getElementById('error-count').textContent = `Errors: ${errorCount}`;
}

function solveSudoku() {
    const grid = getGrid();
    if (solve(grid)) {
        setGrid(grid);
    } else {
        alert('No solution exists!');
    }
}

function solve(grid) {
    let emptyCell = findEmptyCell(grid);
    if (!emptyCell) {
        return true;
    }
    let [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solve(grid)) {
                return true;
            }
            grid[row][col] = 0;
        }
    }
    return false;
}

function findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return null;
}

function isValid(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num || grid[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3] === num) {
            return false;
        }
    }
    return true;
}

function setGrid(grid) {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('input');
        cells.forEach((cell, colIndex) => {
            cell.value = grid[rowIndex][colIndex] !== 0 ? grid[rowIndex][colIndex] : '';
        });
    });
}

function saveGame() {
    const grid = getGrid();
    localStorage.setItem('sudokuGrid', JSON.stringify(grid));
    localStorage.setItem('sudokuErrors', errorCount);
}

function loadGame() {
    const grid = JSON.parse(localStorage.getItem('sudokuGrid'));
    errorCount = localStorage.getItem('sudokuErrors');
    if (grid) {
        setGrid(grid);
    }
    document.getElementById('error-count').textContent = `Errors: ${errorCount}`;
}

function undoMove() {
    if (moveHistory.length > 0) {
        const lastMove = moveHistory.pop();
        const rows = document.querySelectorAll('tbody tr');
        const cell = rows[lastMove.row].cells[lastMove.col].querySelector('input');
        cell.value = '';
        cell.classList.remove('error');
        errorCount--;
        document.getElementById('error-count').textContent = `Errors: ${errorCount}`;
    }
}

function giveHint() {
    const grid = getGrid();
    const solution = JSON.parse(JSON.stringify(grid));
    if (solve(solution)) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    highlightCell(row, col, 'hint');
                    return;
                }
            }
        }
    }
}

function highlightCells(row, col) {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((r, rowIndex) => {
        const cells = r.querySelectorAll('input');
        cells.forEach((cell, colIndex) => {
            if (rowIndex === row || colIndex === col) {
                cell.classList.add('highlight');
            }
        });
    });
}

function clearHighlights() {
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('highlight');
    });
}

function pauseResumeTimer() {
    if (isPaused) {
        startTimer();
        isPaused = false;
    } else {
        clearInterval(timerInterval);
        isPaused = true;
    }
}

function startTimer() {
    let startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        document.getElementById('timer').textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function generateNewPuzzle() {
    const grid = [...Array(9)].map(() => Array(9).fill(0));
    fillDiagonal(grid);
    fillRemaining(grid, 0, 3);
    removeKDigits(grid);
    setGrid(grid);
}

function fillDiagonal(grid) {
    for (let i = 0; i < 9; i += 3) {
        fillBox(grid, i, i);
    }
}

function fillBox(grid, row, col) {
    let num;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                num = randomNumber(1, 9);
            } while (!unUsedInBox(grid, row, col, num));
            grid[row + i][col + j] = num;
        }
    }
}

function unUsedInBox(grid, row, col, num) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[row + i][col + j] === num) {
                return false;
            }
        }
    }
    return true;
}

function fillRemaining(grid, i, j) {
    if (j >= 9 && i < 8) {
        i++;
        j = 0;
    }
    if (i >= 9 && j >= 9) {
        return true;
    }
    if (i < 3) {
        if (j < 3) {
            j = 3;
        }
    } else if (i < 6) {
        if (j === Math.floor(i / 3) * 3) {
            j += 3;
        }
    } else {
        if (j === 6) {
            i++;
            j = 0;
            if (i >= 9) {
                return true;
            }
        }
    }
    for (let num = 1; num <= 9; num++) {
        if (isSafe(grid, i, j, num)) {
            grid[i][j] = num;
            if (fillRemaining(grid, i, j + 1)) {
                return true;
            }
            grid[i][j] = 0;
        }
    }
    return false;
}

function isSafe(grid, i, j, num) {
    return (
        !unUsedInRow(grid, i, num) &&
        !unUsedInCol(grid, j, num) &&
        !unUsedInBox(grid, i - (i % 3), j - (j % 3), num)
    );
}

function unUsedInRow(grid, i, num) {
    for (let j = 0; j < 9; j++) {
        if (grid[i][j] === num) {
            return false;
        }
    }
    return true;
}

function unUsedInCol(grid, j, num) {
    for (let i = 0; i < 9; i++) {
        if (grid[i][j] === num) {
            return false;
        }
    }
    return true;
}

function removeKDigits(grid) {
    const K = 20;
    for (let i = 0; i < K; i++) {
        let cellId = randomNumber(0, 80);
        let row = Math.floor(cellId / 9);
        let col = cellId % 9;
        while (grid[row][col] === 0) {
            cellId = randomNumber(0, 80);
            row = Math.floor(cellId / 9);
            col = cellId % 9;
        }
        grid[row][col] = 0;
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function highlightCell(row, col, className) {
    const rows = document.querySelectorAll('tbody tr');
    const cell = rows[row].cells[col].querySelector('input');
    cell.classList.add(className);
}

function changeDifficulty() {
    difficulty = document.getElementById('difficulty').value;
    generateGrid();
}
    