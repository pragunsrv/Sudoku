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

    // Create 2D array from input values
    rows.forEach((row, rowIndex) => {
        let rowValues = [];
        row.querySelectorAll('input').forEach((cell, colIndex) => {
            let value = cell.value ? parseInt(cell.value) : 0;
            rowValues.push(value);
        });
        grid.push(rowValues);
    });

    // Check rows and columns
    for (let i = 0; i < 9; i++) {
        let rowSet = new Set();
        let colSet = new Set();
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] !== 0) {
                let cell = document.querySelector(`tbody tr:nth-child(${i + 1}) td:nth-child(${j + 1}) input`);
                if (rowSet.has(grid[i][j])) {
                    valid = false;
                    if (cell) cell.classList.add('error');
                } else {
                    rowSet.add(grid[i][j]);
                    if (cell) cell.classList.remove('error');
                }
            }
            if (grid[j][i] !== 0) {
                let cell = document.querySelector(`tbody tr:nth-child(${j + 1}) td:nth-child(${i + 1}) input`);
                if (colSet.has(grid[j][i])) {
                    valid = false;
                    if (cell) cell.classList.add('error');
                } else {
                    colSet.add(grid[j][i]);
                    if (cell) cell.classList.remove('error');
                }
            }
        }
    }

    // Check 3x3 subgrids
    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            let subgridSet = new Set();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let value = grid[row + i][col + j];
                    let cell = document.querySelector(`tbody tr:nth-child(${row + i + 1}) td:nth-child(${col + j + 1}) input`);
                    if (value !== 0) {
                        if (subgridSet.has(value)) {
                            valid = false;
                            if (cell) cell.classList.add('error');
                        } else {
                            subgridSet.add(value);
                            if (cell) cell.classList.remove('error');
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
