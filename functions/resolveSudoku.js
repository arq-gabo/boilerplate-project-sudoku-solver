module.exports = function solveSudoku(puzzle) {
  const SIZE = 9; // Size of the Sudoku grid
  const EMPTY_CELL = "."; // Representation of an empty cell

  // Convert the puzzle string into a 2D array
  const grid = [];
  for (let i = 0; i < SIZE; i++) {
    const row = puzzle.slice(i * SIZE, (i + 1) * SIZE).split("");
    grid.push(row);
  }

  // Helper function to check if a value can be placed in a specific cell
  function isValid(cellRow, cellCol, value) {
    const rowValues = grid[cellRow];
    const colValues = grid.map((row) => row[cellCol]);

    // Check if the value already exists in the row or column
    if (rowValues.includes(value) || colValues.includes(value)) {
      return false;
    }

    // Determine the boundaries of the current box
    const boxRowStart = Math.floor(cellRow / 3) * 3;
    const boxColStart = Math.floor(cellCol / 3) * 3;
    const boxRowEnd = boxRowStart + 3;
    const boxColEnd = boxColStart + 3;

    // Check if the value already exists in the current box
    for (let r = boxRowStart; r < boxRowEnd; r++) {
      for (let c = boxColStart; c < boxColEnd; c++) {
        if (grid[r][c] === value) {
          return false;
        }
      }
    }

    return true;
  }

  // Recursive backtracking function to solve the puzzle
  function solve() {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (grid[row][col] === EMPTY_CELL) {
          for (let value = 1; value <= SIZE; value++) {
            if (isValid(row, col, value.toString())) {
              grid[row][col] = value.toString();

              if (solve()) {
                return true;
              }

              grid[row][col] = EMPTY_CELL; // Undo the value if it leads to a dead end
            }
          }

          return false; // No valid value found, backtrack
        }
      }
    }

    return true; // Puzzle solved
  }

  // Call the solve function to solve the puzzle
  solve();

  // Convert the solved grid back to a string
  const solvedPuzzle = grid.map((row) => row.join("")).join("");

  return solvedPuzzle;
};
