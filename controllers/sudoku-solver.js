const numberConverter = (row) => {
  switch (row) {
    case "A":
      return 1;
    case "B":
      return 2;
    case "C":
      return 3;
    case "D":
      return 4;
    case "E":
      return 5;
    case "F":
      return 6;
    case "G":
      return 7;
    case "H":
      return 8;
    case "I":
      return 9;
    default:
      return "undefined";
  }
};

const gridConverter = (string) => {
  if (string.length < 81 || string.length > 81) {
    return false;
  }
  let grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  let row = -1;
  let col = 0;
  for (let i = 0; i < string.length; i++) {
    if (i % 9 == 0) {
      row++;
    }
    if (col % 9 == 0) {
      col = 0;
    }
    grid[row][col] = string[i] === "." ? 0 : string[i];
    col++;
  }
  return grid;
};

const stringConverter = (grid) => {
  if (!Array.isArray(grid)) {
    return false;
  }
  return grid.flat().join("");
};

const isSafe = (grid, row, col, num) => {
  for (let d = 0; d < grid.length; d++) {
    if (grid[row][d] == num) {
      return false;
    }
  }

  for (let r = 0; r < grid.length; r++) {
    if (grid[r][col] == num) {
      return false;
    }
  }

  let sqrt = Math.floor(Math.sqrt(grid.length));
  let boxRowStart = row - (row % sqrt);
  let boxColStart = col - (col % sqrt);

  for (let r = boxRowStart; r < boxRowStart + sqrt; r++) {
    for (let d = boxColStart; d < boxColStart + sqrt; d++) {
      if (grid[r][d] == num) {
        return false;
      }
    }
  }

  return true;
};
const solveSudoku = (grid, length) => {
  let row = -1;
  let col = -1;
  let isEmpty = true;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (grid[i][j] == 0) {
        row = i;
        col = j;
        isEmpty = false;
        break;
      }
    }

    if (!isEmpty) {
      break;
    }
  }

  if (isEmpty) {
    return true;
  }

  for (let num = 1; num <= length; num++) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;
      if (solveSudoku(grid, length)) {
        return grid;
      } else {
        grid[row][col] = 0;
      }
    }
  }

  return false;
};

class SudokuSolver {
  stringLengthValidate(puzzleString) {
    if (puzzleString.length < 81 || puzzleString.length > 81) {
      return false;
    }
    return true;
  }

  stringValidate(puzzleString) {
    if (/[a-i]/i.test(puzzleString)) {
      return true;
    }
    return false;
  }

  numPeriodValidate(puzzleString) {
    if (/[^1-9.]/gi.test(puzzleString)) {
      return false;
    }
    return true;
  }

  numberValidate(puzzleString) {
    if (/[^1-9]/i.test(puzzleString)) {
      return false;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = gridConverter(puzzleString);
    row = numberConverter(row);
    let rowIndex = row - 1;
    let colIndex = column - 1;

    if (grid[rowIndex][colIndex] == value) {
      return true;
    } else if (grid[rowIndex][colIndex] !== 0) {
      return false;
    }

    for (let i = 0; i < 9; i++) {
      if (grid[rowIndex][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = gridConverter(puzzleString);
    row = numberConverter(row);
    let rowIndex = row - 1;
    let colIndex = column - 1;

    if (grid[rowIndex][colIndex] == value) {
      return true;
    } else if (grid[rowIndex][colIndex] !== 0) {
      return false;
    }

    for (let i = 0; i < 9; i++) {
      if (grid[i][colIndex] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    let grid = gridConverter(puzzleString);
    row = numberConverter(row);
    let rowIndex = row - 1;
    let colIndex = col - 1;

    if (grid[rowIndex][colIndex] == value) {
      return true;
    } else if (grid[rowIndex][colIndex] !== 0) {
      return false;
    }

    let startRow = row - (row % 3),
      startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (grid[i + startRow][j + startCol] == value) return false;

    return true;
  }

  solve(puzzleString) {
    let grid = gridConverter(puzzleString);
    let length = grid.length;
    let solved = solveSudoku(grid, length);

    if (!solved) {
      return false;
    } else {
      let solvedString = stringConverter(solved);

      return solvedString;
    }
  }
}

module.exports = SudokuSolver;
