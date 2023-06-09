"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    res.json({ message: "message" });
  });

  app.route("/api/solve").post((req, res) => {
    let puzzle = req.body.puzzle;
    if (puzzle === "") {
      res.json({ error: "Required field missing" });
    } else if (!/^.{81}$/.test(puzzle)) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
    } else if (!/^([1-9]|\.)+$/.test(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
    } else {
      res.json(solver.solve(puzzle));
    }
  });
};
