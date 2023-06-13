"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      res.json({ error: "Required field(s) missing" });
    } else if (!solver.validate1to9orPoint(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
    } else if (!solver.validate81lengthChar(puzzle)) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
    } else if (!/^[a-i][1-9]$/i.test(coordinate)) {
      res.json({ error: "Invalid coordinate" });
    } else if (!/^[1-9]$/.test(value)) {
      res.json({ error: "Invalid value" });
    } else {
      let arrCoord = coordinate.split("");
      let valRow = arrCoord[0].toLowerCase().charCodeAt() - 96;
      let valCol = parseInt(arrCoord[1]);

      let conflictRow = solver.checkRowPlacement(puzzle, valRow, valCol, value);
      let conflictColumn = solver.checkColPlacement(
        puzzle,
        valRow,
        valCol,
        value
      );
      let conflictRegion = solver.checkRegionPlacement(
        puzzle,
        valRow,
        valCol,
        value
      );

      if (conflictRow || conflictColumn || conflictRegion) {
        res.json({
          valid: false,
          conflict: [
            conflictRow ? "row" : false,
            conflictColumn ? "column" : false,
            conflictRegion ? "region" : false,
          ].filter((val) => {
            if (val) return val;
          }),
        });
      } else {
        res.json({ valid: true });
      }
    }
  });

  app.route("/api/solve").post((req, res) => {
    let puzzle = req.body.puzzle;
    if (!puzzle) {
      res.json({ error: "Required field missing" });
    } else if (!solver.validate81lengthChar(puzzle)) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
    } else if (!solver.validate1to9orPoint(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
    } else {
      if (!solver.validate(puzzle)) {
        res.json({ error: "Puzzle cannot be solved" });
      } else {
        res.json({ solution: solver.solve(puzzle) });
      }
    }
  });
};
