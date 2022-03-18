"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      res.json({ error: "Required field(s) missing" });
      return;
    }

    const row = coordinate.split("")[0];
    const col = coordinate.split("")[1];
    if (coordinate.length !== 2 || !solver.stringValidate(row) || !solver.numberValidate(col)) {
      res.json({ error: "Invalid coordinate" });
      return;
    }

    if (!solver.numberValidate(value)) {
      res.json({ error: "Invalid value" });
      return;
    }

    if (!solver.stringLengthValidate(puzzle)) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }

    if (!solver.numPeriodValidate(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }

    let conflicts = [];

    if (!solver.checkRowPlacement(puzzle, row, col, value)) {
      conflicts.push("row");
    }
    if (!solver.checkColPlacement(puzzle, row, col, value)) {
      conflicts.push("column");
    }
    if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
      conflicts.push("region");
    }
    if (!conflicts.length) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false, conflict: conflicts });
    }
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;

    if (!puzzle) {
      res.json({ error: "Required field missing" });
      return;
    }

    if (!solver.stringLengthValidate(puzzle)) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }

    if (!solver.numPeriodValidate(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }

    let solution = solver.solve(puzzle);
    if (!solution) {
      res.json({ error: "Puzzle cannot be solved" });
    } else {
      res.json({ solution });
    }
  });
};
