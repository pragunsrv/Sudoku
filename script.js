function checkSudoku() {
    let valid = true;
    const rows = document.querySelectorAll('tr');
    let grid = [];

    // Create 2D array from input values
    rows.forEach(row => {
        let rowValues = [];
        row.querySelectorAll('input').forEach(cell => {
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
            if (grid[i][j] !== 0 && rowSet.has(grid[i][j])) valid = false;
            if (grid[j][i] !== 0 && colSet.has(grid[j][i])) valid = false;
            rowSet.add(grid[i][j]);
            colSet.add(grid[j][i]);
        }
    }

    // Check 3x3 subgrids
    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            let subgridSet = new Set();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let value = grid[row + i][col + j];
                    if (value !== 0 && subgridSet.has(value)) valid = false;
                    subgridSet.add(value);
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
