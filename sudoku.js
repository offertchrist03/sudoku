const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const removeFirstOccurrence = (arr = [0], value = [0]) => {
  const array = [...arr];
  const index = array.indexOf(value); // Trouver l'index de la première occurrence
  if (index !== -1) {
    array.splice(index, 1); // Supprimer l'élément à cet index
  }
  return array;
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }

  return true;
}

function solveSudoku(board, row = 0, col = 0) {
  if (row === 9) return true;
  if (col === 9) return solveSudoku(board, row + 1, 0);
  if (board[row][col] !== 0) return solveSudoku(board, row, col + 1);

  shuffle(numbers); // Mélanger les chiffres pour plus d'aléatoire

  for (let num of numbers) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board, row, col + 1)) return true;
      board[row][col] = 0;
    }
  }

  return false;
}

function fillDiagonalBoxes(board) {
  for (let i = 0; i < 9; i += 3) {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffle(numbers);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        board[i + r][i + c] = numbers.pop();
      }
    }
  }
}

function unsolveSudoku(board, difficulty = 40) {
  let useBoard = board.map((row) => [...row]);
  let missing = [0];
  missing = [];

  let count = difficulty;
  while (count > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (useBoard[row][col] !== 0) {
      missing.push(useBoard[row][col]);
      useBoard[row][col] = 0;
      count--;
    }
  }

  return { unsolved: useBoard, missing };
}

function generateSudoku(difficulty = 40) {
  let board = Array(9)
    .fill()
    .map(() => Array(9).fill(0));
  fillDiagonalBoxes(board);
  solveSudoku(board);

  const { unsolved, missing } = unsolveSudoku(board, difficulty);

  return { unsolved, board, missing };
}

const createSpan = ({ parent, value = "0", row = 1, className = "" }) => {
  const span = document.createElement("span");
  span.setAttribute("data-row", row);
  span.className = className;
  span.innerHTML = value;
  parent.appendChild(span);
  return span;
};

const createSquareMatrix = ({ parent }) => {
  const div = document.createElement("div");
  div.classList.add("square");
  parent.appendChild(div);
  return div;
};

const createBoard = () => {
  const body = document.body;

  const main = document.createElement("main");
  main.classList.add("main-app");
  body.appendChild(main);

  return main;
};

const createSpanInput = ({ parent, value = "0", left = 0, className = "" }) => {
  const span = document.createElement("span");
  span.setAttribute("data-left", left);
  span.className = className;
  span.innerHTML = value;
  parent.appendChild(span);
  return span;
};

const createBoardInput = () => {
  const body = document.body;

  const inputs = document.createElement("main");
  inputs.classList.add("inputs-app");
  body.appendChild(inputs);

  return inputs;
};

const generateBoardInput = (missing = [0]) => {
  const inputs = createBoardInput();
  for (let index = 1; index <= numbers.length; index++) {
    const miss = missing.filter((n) => n === index);

    let className = "square-span square-input";
    if (!(miss.length > 0)) {
      className = className + " disabled";
    }

    createSpanInput({
      parent: inputs,
      value: index,
      className,
      left: miss.length,
    });
  }
};

const generateBoard = () => {
  const main = createBoard();

  // creer les carree
  for (let i = 0; i < 9; i++) {
    const div = createSquareMatrix({ parent: main });
    const globalAdd = parseInt((i / 3).toPrecision()) * 3;

    // creer les matrice
    for (let index = 0; index < numbers.length; index++) {
      const add = parseInt((index / 3).toPrecision()) + globalAdd;
      let row = 1 + add;

      createSpan({
        parent: div,
        value: "-",
        row,
        className: "square-span item",
      });
    }
  }
};

const getRowsAndColumnBoard = () => {
  const rows = Array.from(document.querySelectorAll(".item"));

  let resultRows = Array(9)
    .fill()
    .map(() => []);

  rows.forEach((item) => {
    const rowIndex = parseInt(item.getAttribute("data-row")) - 1;
    resultRows[rowIndex].push(item);
  });

  let resultColumns = Array(9)
    .fill()
    .map(() => []);

  for (let col = 0; col < 9; col++) {
    for (let row = 0; row < 9; row++) {
      resultColumns[col].push(resultRows[row][col]);
    }
  }

  return { resultRows, resultColumns };
};

const setRowsBoard = (boards = [[0]], sudoku = [[0]]) => {
  boards.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      const value = parseInt(sudoku[rowIdx][colIdx]);
      if (value > 0) {
        col.classList.add("disabled");
      }
      col.innerHTML = value > 0 ? value : "";
    });
  });
};

const play = (params = [0]) => {
  let missing = [...params];

  const squares = document.querySelectorAll(".item");

  const removeSelected = () => {
    squares.forEach((square) => {
      square.classList.remove("selected");
    });
  };

  let squareSelected = document.querySelector("div");
  squareSelected = null;

  generateBoardInput(missing);

  const inputs = document.querySelectorAll(".square-input");

  const refreshBoardInput = () => {
    inputs.forEach((input) => {
      const value = parseInt(input.innerHTML);
      const miss = missing.filter((n) => parseInt(n) === value).length;

      if (!(miss > 0)) {
        input.classList.add("disabled");
      } else {
        input.classList.remove("disabled");
      }
    });
  };

  inputs.forEach((input) => {
    input.addEventListener("click", (e) => {
      e.preventDefault();

      if (!squareSelected || input.classList.contains("disabled")) return;

      const newValue = parseInt(input.innerHTML);

      squareSelected.classList.add("isset");
      squareSelected.innerHTML = newValue;

      const newMissings = removeFirstOccurrence(missing, newValue);
      missing = newMissings;

      squareSelected = null;
      removeSelected();

      refreshBoardInput();
    });
  });

  const actionOnItem = () => {
    squares.forEach((square) => {
      square.addEventListener("click", (e) => {
        e.preventDefault();
        if (
          square.classList.contains("selected") ||
          square.classList.contains("disabled")
        )
          return;

        if (square.classList.contains("isset")) {
          square.classList.remove("isset");
          const val = parseInt(square.innerHTML);
          square.innerHTML = "";
          const addMissing = [...missing, val];
          missing = addMissing;
          refreshBoardInput();
        }

        removeSelected();
        squareSelected = square;
        square.classList.add("selected");

        console.log(squareSelected);
      });
    });
  };

  return actionOnItem;
};

const { board, unsolved, missing } = generateSudoku(5);

generateBoard();

const { resultRows: rows } = getRowsAndColumnBoard();

setRowsBoard(rows, unsolved);

const action = play(missing);
action();
