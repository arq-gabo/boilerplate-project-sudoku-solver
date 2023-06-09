const validSudoku = require("../functions/validSudoku.js");
const resolveSudoku = require("../functions/resolveSudoku.js");

class SudokuSolver {
  validate(puzzleString) {}

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {
    return !validSudoku(puzzleString)
      ? { error: "Puzzle cannot be solved" }
      : { solution: resolveSudoku(puzzleString) };
  }
}

module.exports = SudokuSolver;
