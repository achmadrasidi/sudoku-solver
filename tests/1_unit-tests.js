const chai = require("chai");
const SudokuSolver = require("../controllers/sudoku-solver.js");
const assert = chai.assert;
let solver = new SudokuSolver();

let input;
let row;
let column;
let value;

suite("UnitTests", () => {
  suite("Function stringValidate(puzzleString)", () => {
    test("Logic handles a valid puzzle string of 81 characters", (done) => {
      input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.equal(solver.stringLengthValidate(input), true);
      done();
    });
  });

  suite("Function numPeriodValidate(puzzleString)", () => {
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
      input = "asd";
      assert.equal(solver.numPeriodValidate(input), false);
      done();
    });
  });

  suite("Function stringLengthValidate(puzzleString)", () => {
    test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
      input = "d";
      const inputLong = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.asd";
      assert.equal(solver.stringLengthValidate(input), false);
      assert.equal(solver.stringLengthValidate(inputLong), false);
      done();
    });
  });

  suite("Function checkRowPlacement(puzzleString,row,column,value)", () => {
    test("Logic handles a valid row placement", (done) => {
      input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      row = "A";
      column = 3;
      value = 5;

      assert.equal(solver.checkRowPlacement(input, row, column, value), true);
      done();
    });

    test("Logic handles an invalid row placement", (done) => {
      input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      row = "A";
      column = 2;
      value = 1;

      assert.equal(solver.checkRowPlacement(input, row, column, value), false);
      done();
    });
  });

  suite("Function checkColPlacement(puzzleString,row,column,value)", () => {
    test("Logic handles a valid column placement", (done) => {
      input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      row = "A";
      column = 3;
      value = 5;

      assert.equal(solver.checkColPlacement(input, row, column, value), true);
      done();
    });

    test("Logic handles an invalid column placement", (done) => {
      input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      row = "B";
      column = 3;
      value = 9;

      assert.equal(solver.checkRowPlacement(input, row, column, value), false);
      done();
    });
  });

  suite("Function checkRegionPlacement(puzzleString,row,column,value)", () => {
    test("Logic handles a valid region (3x3 grid) placement", (done) => {
      input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      row = "A";
      column = 3;
      value = 5;

      assert.equal(solver.checkRegionPlacement(input, row, column, value), true);
      done();
    });

    test("Logic handles an invalid region (3x3 grid) placement", (done) => {
      input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      row = "A";
      column = 2;
      value = 2;

      assert.equal(solver.checkRegionPlacement(input, row, column, value), false);
      done();
    });
  });

  suite("Function solve(puzzleString)", () => {
    test("Valid puzzle strings pass the solver", (done) => {
      input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

      assert.equal(solver.solve(input), "135762984946381257728459613694517832812936745357824196473298561581673429269145378");
      done();
    });

    test("Invalid puzzle strings fail the solver", (done) => {
      input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7....9.47...8..1..16....926914.37..23asd";

      assert.equal(solver.solve(input), false);
      done();
    });

    test("Solver returns the expected solution for an incomplete puzzle", (done) => {
      input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

      assert.equal(solver.solve(input), "135762984946381257728459613694517832812936745357824196473298561581673429269145378");
      done();
    });
  });
});
