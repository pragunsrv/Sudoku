# Sudoku Game

A web-based Sudoku game built using HTML, CSS, and JavaScript. The game includes features like mistake checking, hint system, timer, and difficulty settings.

## Features

- **Interactive Grid**: A 9x9 Sudoku grid where users can input numbers.
- **Check Mistakes**: Check if the current state of the grid has any mistakes.
- **Hints**: Get hints for the next possible move.
- **Highlight Numbers**: Clicking on a cell highlights all instances of that number.
- **Timer**: A game timer that can be paused and resumed.
- **Save and Load**: Save the current game state to local storage and load it later.
- **Undo Move**: Undo the last move.
- **New Puzzle**: Generate a new puzzle with varying difficulty levels.

## Getting Started

### Prerequisites

- Web browser (Google Chrome, Firefox, Safari, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pragunsrv/sudoku-game.git
   ```
2. Navigate to the project directory:
   ```bash
   cd sudoku-game
   ```

### Usage

1. Open `index.html` in your web browser to start the game.

### Game Controls

- **Input**: Click on a cell and type a number (1-9).
- **Check**: Click the "Check" button to validate the current grid.
- **Hint**: Click the "Hint" button to highlight the next possible move.
- **Undo**: Click the "Undo" button to undo the last move.
- **New Puzzle**: Click the "New Puzzle" button to generate a new Sudoku puzzle.
- **Save**: Click the "Save" button to save the current game state.
- **Load**: Click the "Load" button to load the saved game state.
- **Pause/Resume Timer**: Click the "Pause/Resume Timer" button to pause or resume the game timer.
- **Difficulty**: Select the difficulty level from the dropdown menu and click "Generate New Puzzle" to start a new game with the selected difficulty.

### Project Structure

- `index.html`: The main HTML file containing the game structure.
- `styles.css`: The CSS file for styling the game.
- `script.js`: The JavaScript file containing the game logic.

### Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

### License

This project is licensed under the MIT License. See the `LICENSE` file for details.
