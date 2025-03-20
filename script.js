const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function generateCombinations(numbers = [0, 1, 2], length = 3, current = []) {
  if (current.length === length) {
    return [current];
  }

  let result = [];

  for (let num of numbers) {
    result = result.concat(
      generateCombinations(numbers, length, [...current, num])
    );
  }

  return result;
}

const combinations = generateCombinations([1, 2, 3, 4, 5, 6, 7, 8, 9], 8);
console.log(combinations.length);
console.log(combinations);

function generatePermutations(arr = [0]) {
  let result = [[0]];
  result = [];

  function permute(current = [0], remaining = [0]) {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      permute(
        [...current, remaining[i]],
        [...remaining.slice(0, i), ...remaining.slice(i + 1)]
      );
    }
  }

  permute([], arr);
  return result;
}

const convertIntoMatrix = (arr = [1]) => {
  // console.log("arr => ", arr);
  const size = Math.sqrt(arr.length);
  let matrix = [[0]];
  matrix = [];

  let count = 1;
  let row = [0];
  row = [];

  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];

    row.push(element);

    if (count === size) {
      matrix.push(row);
      count = 1;
      row = [];
    } else {
      count++;
    }
  }

  // console.log("arr => ", arr);
  // console.log("matrix => ", matrix);
  return matrix;
};

function sudokuTrue(params = [1, 2, 1, 2], check = [1, 2]) {
  let res = true;
  const matrix = convertIntoMatrix(params);
  // console.log("matrix => ", matrix);

  // set cols
  let cols = [[0]];
  cols = [];
  for (let index = 0; index < matrix.length; index++) {
    let addCol = [0];
    addCol = [];

    matrix.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        if (index === colIdx) {
          addCol.push(col);
        }
      });
    });
    cols.push(addCol);
  }
  // verify cols
  cols.forEach((col) => {
    if (
      !(
        col.sort((a, b) => a - b).toString() ===
        check.sort((a, b) => a - b).toString()
      )
    ) {
      res = false;
    }
  });

  // verify rows
  matrix.forEach((row) => {
    if (
      !(
        row.sort((a, b) => a - b).toString() ===
        check.sort((a, b) => a - b).toString()
      )
    ) {
      res = false;
    }
  });

  return res;
}

function sudokuPossible(params = [1, 2]) {
  let numbers = [0];
  numbers = [];

  params.forEach((param) => {
    numbers.push(...params);
  });

  const permutations = generatePermutations(numbers);
  // console.log("permutations => ", permutations);

  const trueSudokus = permutations.filter((permutation) =>
    sudokuTrue(permutation, params)
  );

  // console.log("trueSudokus");
  // console.log(trueSudokus);

  return trueSudokus;
}

// const sudokus = sudokuPossible([1, 2, 3, 4, 5, 6, 7, 8, 9]);
// const selectedSudoku = sudokus[14];
// console.log(selectedSudoku);

const createSpan = ({ parent, children = "0", row = 1 }) => {
  const span = document.createElement("span");
  span.classList.add("item", "row-" + row);
  span.innerHTML = children;
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

      const span = createSpan({ parent: div, children: "-", row });
    }
  }
};

// generateBoard();
