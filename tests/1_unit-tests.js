const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  let strPuzzleGlobal =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

  test("Logic handles a valid puzzle string of 81 characters", function () {
    assert.isTrue(
      solver.validate81lengthChar(strPuzzleGlobal),
      "this string is 81 character length"
    );
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
    let strPuzzle =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...A";

    assert.isNotTrue(
      solver.validate1to9orPoint(strPuzzle),
      "This string contain letter A in the end for the function return false"
    );
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function () {
    let strPuzzle =
      "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492";
    assert.isNotTrue(
      solver.validate81lengthChar(strPuzzle),
      "Not return true because string is less than 81"
    );
  });

  test("Logic handles a valid row placement", function () {
    assert.isNotTrue(
      solver.checkRowPlacement(strPuzzleGlobal, 1, 3, "9"),
      "returns false, because there is no conflict in line 'A' with the value '9' and adding it to column '3'"
    );
  });

  test("Logic handles an invalid row placement", function () {
    assert.isTrue(
      solver.checkRowPlacement(strPuzzleGlobal, 1, 1, "9"),
      'returns true, because there is a conflict in line "A" with the value "9" and adding it to column "1",'
    );
  });

  test("Logic handles a valid column placement", function () {
    assert.isNotTrue(
      solver.checkColPlacement(strPuzzleGlobal, 1, 1, "7"),
      'returns false because there is no conflict between the value "7" and the values of the column "1"'
    );
  });

  test("Logic handles an invalid column placement", function () {
    assert.isTrue(
      solver.checkColPlacement(strPuzzleGlobal, 6, 7, "6"),
      "returns false for the value '6' located at coordinate 'F7' conflicts with the value '6' with the '6' located at coordinate 'I8'"
    );
  });

  test("Logic handles a valid region (3x3 grid) placement", function () {
    assert.isFalse(
      solver.checkRegionPlacement(strPuzzleGlobal, 6, 5, "1"),
      "returns false because the value '1' is already located at coordinate 'F5'"
    );
  });

  test("Logic handles an invalid region (3x3 grid) placement", function () {
    assert.isTrue(
      solver.checkRegionPlacement(strPuzzleGlobal, 7, 4, "3"),
      "there is a conflict with the value '3' is located in 'I4' and 'G4'"
    );
  });

  test("Valid puzzle strings pass the solver", function () {
    assert.isTrue(
      solver.validate(strPuzzleGlobal),
      "the strPuzzleGlobal is valid to complete a sudoku"
    );
  });

  test("Invalid puzzle strings fail the solver", function () {
    let strPuzzleInvalid =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.6";
    assert.isFalse(
      solver.validate(strPuzzleInvalid),
      "The str puzzle is invalid for repeat value 6 in the last string"
    );
  });

  test("Solver returns the expected solution for an incomplete puzzle", function () {
    let strSudokuForSolve =
      "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51";
    assert.equal(
      solver.solve(strSudokuForSolve),
      "827549163531672894649831527496157382218396475753284916962415738185763249374928651"
    );
  });
});
