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

    // Clear previous errors
    document.querySelectorAll('input').forEach(cell => {
        cell.classList.remove('error', 'row-error', 'col-error', 'subgrid-error');
    });

    // Check rows and columns
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

    // Check 3x3 subgrids
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
        cell.value = '';
        cell.classList.remove('error', 'row-error', 'col-error', 'subgrid-error');
    });
}
