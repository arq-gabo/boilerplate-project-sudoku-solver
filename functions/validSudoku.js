module.exports = function isValidSudokuString(puzzleString) {
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
};
