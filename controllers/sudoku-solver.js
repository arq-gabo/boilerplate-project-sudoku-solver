// function for check if array row or columns or region have repeat element
const checkIsRepeat = (arr) => {
  let isRepeat = false;
  arr
    .filter((val) => {
      if (val !== ".") return val;
    })
    .sort((a, b) => a - b)
    .map((val, idx, arr) => {
      if (val === arr[idx - 1]) isRepeat = true;
    });

  return isRepeat;
};

class SudokuSolver {
  validate(puzzleString) {
    const SIZE = 9; // Size of the Sudoku grid

    // Helper function to check if a value is unique in an array
    function isUnique(array) {
      const seen = new Set();
      for (let i = 0; i < array.length; i++) {
        if (array[i] !== ".") {
          if (seen.has(array[i])) {
            return false;
          }
          seen.add(array[i]);
        }
      }
      return true;
    }

    // Check rows
    for (let row = 0; row < SIZE; row++) {
      const rowValues = puzzleString
        .slice(row * SIZE, (row + 1) * SIZE)
        .split("");
      if (!isUnique(rowValues)) {
        return false;
      }
    }

    // Check columns
    for (let col = 0; col < SIZE; col++) {
      const colValues = [];
      for (let row = 0; row < SIZE; row++) {
        colValues.push(puzzleString.charAt(row * SIZE + col));
      }
      if (!isUnique(colValues)) {
        return false;
      }
    }

    // Check boxes
    for (let boxRow = 0; boxRow < SIZE; boxRow += 3) {
      for (let boxCol = 0; boxCol < SIZE; boxCol += 3) {
        const boxValues = [];
        for (let row = boxRow; row < boxRow + 3; row++) {
          for (let col = boxCol; col < boxCol + 3; col++) {
            boxValues.push(puzzleString.charAt(row * SIZE + col));
          }
        }
        if (!isUnique(boxValues)) {
          return false;
        }
      }
    }

    return true; // All checks passed, Sudoku string is valid
  }

  validate81lengthChar(puzzle) {
    return /^.{81}$/.test(puzzle);
  }

  validate1to9orPoint(puzzle) {
    return /^([1-9]|\.)+$/.test(puzzle);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let strSudoku = puzzleString;
    let arrRow = [];
    // bucle for create an array with values of te row
    for (let a = row * 9 - 9; a < row * 9 - 9 + 9; a++) {
      arrRow.push(strSudoku[a]);
    }

    // add or change a index of array row with que value
    arrRow[column - 1] = value;

    return checkIsRepeat(arrRow);
  }

  checkColPlacement(puzzleString, row, column, value) {
    let strSudoku = puzzleString;
    let arrCol = [];

    for (let b = column - 1; b < 81; b += 9) {
      arrCol.push(strSudoku[b]);
    }

    arrCol[row - 1] = value;

    return checkIsRepeat(arrCol);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let strSudoku = puzzleString;
    let arrRegion = [];

    // Function por find origin point for create an array with que values of the region
    function pointOriginRegion(point) {
      let newPoint = point;
      if (point === 2 || point === 3) {
        newPoint = 1;
      } else if (point === 5 || point === 6) {
        newPoint = 4;
      } else if (point === 8 || point === 9) {
        newPoint = 7;
      }

      return newPoint;
    }

    // function for locate a point in region array from coordinate
    const idxArrRegion = (row, col) => {
      let idxRow = 0;
      let idxCol = 0;
      if (row === 2 || row === 5 || row === 8) {
        idxRow = 3;
      } else if (row === 3 || row === 6 || row === 9) {
        idxRow = 6;
      }

      if (col === 2 || col === 5 || col === 8) {
        idxCol = 1;
      } else if (col === 3 || col === 6 || col === 9) {
        idxCol = 2;
      }

      return idxRow + idxCol;
    };

    let originPointRegionStr =
      (pointOriginRegion(row) - 1) * 9 + pointOriginRegion(column) - 1;

    for (let i = originPointRegionStr; i <= originPointRegionStr + 18; i += 9) {
      for (let j = i; j < i + 3; j++) {
        arrRegion.push(strSudoku[j]);
      }
    }

    arrRegion[idxArrRegion(row, column)] = value;

    return checkIsRepeat(arrRegion);
  }

  solve(puzzleString) {
    const SIZE = 9; // Size of the Sudoku grid
    const EMPTY_CELL = "."; // Representation of an empty cell

    // Convert the puzzle string into a 2D array
    const grid = [];
    for (let i = 0; i < SIZE; i++) {
      const row = puzzleString.slice(i * SIZE, (i + 1) * SIZE).split("");
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
  }
}

module.exports = SudokuSolver;
