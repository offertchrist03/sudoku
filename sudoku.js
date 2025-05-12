// Fonction vide pour gérer un éventuel panneau de confirmation (à implémenter si besoin)
const confirmPanel = () => {}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Ensemble des chiffres du Sudoku

// Supprime la première occurrence d'une valeur dans un tableau donné
const removeFirstOccurrence = (arr = [0], value = [0]) => {
  const array = [...arr]; // Copie du tableau pour préserver l'original
  const index = array.indexOf(value); // Trouve l'index de la première occurrence
  if (index !== -1) {
    array.splice(index, 1); // Supprime l'élément si trouvé
  }
  return array;
};

// Mélange un tableau de manière aléatoire (algorithme de Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // Index aléatoire
    [array[i], array[j]] = [array[j], array[i]]; // Échange des valeurs
  }
}

// Vérifie si un chiffre peut être placé dans une case (règles du Sudoku)
function isValid(board, row, col, num) {
  // Vérifie ligne et colonne
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  // Vérifie la sous-grille 3x3
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

// Résout récursivement un Sudoku par backtracking
function solveSudoku(board, row = 0, col = 0) {
  if (row === 9) return true; // Fin du tableau
  if (col === 9) return solveSudoku(board, row + 1, 0); // Passe à la ligne suivante
  if (board[row][col] !== 0) return solveSudoku(board, row, col + 1); // Ignore les cases déjà remplies

  shuffle(numbers); // Mélange les nombres pour plus de variété

  for (let num of numbers) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num; // Tente une valeur
      if (solveSudoku(board, row, col + 1)) return true;
      board[row][col] = 0; // Backtrack si erreur
    }
  }

  return false; // Aucune solution trouvée pour cette branche
}

// Remplit les 3 sous-grilles diagonales du Sudoku de manière aléatoire
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

// Supprime des valeurs aléatoires pour générer une grille incomplète (difficulté)
function unsolveSudoku(board, difficulty = 40) {
  let useBoard = board.map((row) => [...row]); // Copie profonde
  let missing = [];

  let count = difficulty;
  while (count > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (useBoard[row][col] !== 0) {
      missing.push(useBoard[row][col]); // Ajoute la valeur supprimée
      useBoard[row][col] = 0;
      count--;
    }
  }

  return { unsolved: useBoard, missing };
}

// Génère une grille de Sudoku complète et la version incomplète selon la difficulté
function generateSudoku(difficulty = 40) {
  let board = Array(9).fill().map(() => Array(9).fill(0)); // Grille vide
  fillDiagonalBoxes(board); // Remplit les diagonales
  solveSudoku(board); // Résout la grille complète

  const { unsolved, missing } = unsolveSudoku(board, difficulty); // Supprime certaines cases

  return { unsolved, board, missing };
}

// Crée le titre de la page avec le niveau de difficulté
const createTitle = (difficulty) => {
  const body = document.body;
  const div = document.createElement("div");
  div.className = "game-title";
  body.appendChild(div);
  
  const h1 = document.createElement("h1");
  h1.innerHTML = "Sudoku";
  div.appendChild(h1);

  if (difficulty > 0) {
    const level = difficulty <= 15 ? "novice" : difficulty <= 30 ? "intermediaire" : "expert";
    const lvl = document.createElement("span");
    lvl.innerHTML = level;
    div.appendChild(lvl);
  }
}

// Crée un élément <span> représentant une case
const createSpan = ({ parent, value = "0", row = 1, className = "" }) => {
  const span = document.createElement("span");
  span.setAttribute("data-row", row);
  span.className = className;
  span.innerHTML = value;
  parent.appendChild(span);
  return span;
};

// Crée une matrice 3x3 (bloc du Sudoku)
const createSquareMatrix = ({ parent }) => {
  const div = document.createElement("div");
  div.classList.add("square");
  parent.appendChild(div);
  return div;
};

// Crée l'élément principal contenant le plateau
const createBoard = () => {
  const body = document.body;
  const main = document.createElement("main");
  main.classList.add("main-app");
  body.appendChild(main);
  return main;
};

// Crée une case interactive en bas pour l'utilisateur
const createSpanInput = ({ parent, value = "0", left = 0, className = "" }) => {
  const span = document.createElement("span");
  span.setAttribute("data-left", left);
  span.className = className + " button";
  span.innerHTML = value;
  parent.appendChild(span);
  return span;
};

// Crée les zones de saisie et les boutons d'action
const createBoardInput = () => {
  const body = document.body;
  const inputs = document.createElement("div");
  inputs.classList.add("inputs-app");
  body.appendChild(inputs);

  const actions = document.createElement("div");
  actions.classList.add("actions-app");
  body.appendChild(actions);

  // Bouton pour recommencer
  createSpanInput({ parent: actions, value: "", className: "new-game", left: 0 });

  // Bouton pour effacer
  createSpanInput({ parent: actions, value: "", className: "erase", left: 0 });

  return inputs;
};

// Génère les cases de saisie selon les valeurs manquantes
const generateBoardInput = (missing = [0]) => {
  const inputs = createBoardInput();
  for (let index = 1; index <= numbers.length; index++) {
    const miss = missing.filter((n) => n === index);
    let className = "square-span square-input";
    if (!(miss.length > 0)) {
      className += " disabled"; // Désactive si non manquant
    }

    createSpanInput({
      parent: inputs,
      value: index,
      className,
      left: miss.length,
    });
  }
};

// Génère le plateau de jeu visuel
const generateBoard = (difficulty) => {
  createTitle(difficulty); // Titre
  const main = createBoard(); // Plateau

  for (let i = 0; i < 9; i++) {
    const div = createSquareMatrix({ parent: main });
    const globalAdd = parseInt((i / 3).toPrecision()) * 3;

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

// Récupère la structure du plateau (lignes, colonnes, valeurs)
const getRowsAndColumnBoard = () => {
  const rows = Array.from(document.querySelectorAll(".item"));

  let rowsValues = Array(9).fill().map(() => []);
  let resultRows = Array(9).fill().map(() => []);

  rows.forEach((item) => {
    const rowIndex = parseInt(item.getAttribute("data-row")) - 1;
    resultRows[rowIndex].push(item);
    rowsValues[rowIndex].push(parseInt(item.innerHTML) || 0);
  });

  let resultColumns = Array(9).fill().map(() => []);
  for (let col = 0; col < 9; col++) {
    for (let row = 0; row < 9; row++) {
      resultColumns[col].push(resultRows[row][col]);
    }
  }

  return { resultRows, rowsValues, resultColumns };
};

// Insère les valeurs dans la grille visuelle
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

// Lance la partie avec une difficulté donnée
const startGame = (play) => {
  if (!play) return;
  const difficulty = 35;
  play({ difficulty });
};

// Redémarre la partie après confirmation
const restartGame = (play) => {
  const ask = window.confirm('Commencer une nouvelle partie');
  if (!ask) return;
  startGame(play);
};

// Contrôle principal du jeu (interactions, validation, etc.)
const game = (params) => {
  const { board, play } = params;
  let missing = [...params.missing];
  let playing = true;
  const squares = document.querySelectorAll(".item");

  const removeSelected = () => {
    squares.forEach((square) => {
      square.classList.remove("selected");
    });
  };

  let squareSelected = null;
  generateBoardInput(missing);

  const inputs = document.querySelectorAll(".square-input");
  const erase = document.querySelector(".erase");
  const newGame = document.querySelector(".new-game");

  const checkIfCorrect = () => {
    if (!missing || missing.length <= 0) {
      const { rowsValues: solved } = getRowsAndColumnBoard();
      if (erase && JSON.stringify(board) === JSON.stringify(solved)) {
        playing = false;
        erase.remove();
      }
    }
  };

  const refreshBoardInput = () => {
    inputs.forEach((input) => {
      const value = parseInt(input.innerHTML);
      const miss = missing.filter((n) => n === value).length;
      input.classList.toggle("disabled", !(miss > 0));
    });
  };

  inputs.forEach((input) => {
    input.addEventListener("click", (e) => {
      e.preventDefault();
      if (!playing) return;
      if (!squareSelected || squareSelected.classList.contains("isset") || input.classList.contains("disabled")) return;

      const newValue = parseInt(input.innerHTML);
      squareSelected.classList.add("isset");
      squareSelected.innerHTML = newValue;
      missing = removeFirstOccurrence(missing, newValue);
      squareSelected = null;
      removeSelected();
      refreshBoardInput();
      checkIfCorrect();
    });
  });

  newGame.addEventListener("click", (e) => {
    e.preventDefault();
    if (play) restartGame(play);
  });

  erase.addEventListener("click", (e) => {
    e.preventDefault();
    if (!playing) return;
    if (squareSelected && squareSelected.classList.contains("isset")) {
      squareSelected.classList.remove("isset");
      const val = parseInt(squareSelected.innerHTML);
      squareSelected.innerHTML = "";
      missing.push(val);
      refreshBoardInput();
    }
  });

  const reset = () => {
    missing = [...params.missing];
    playing = true;
  };

  const actionSelect = () => {
    squares.forEach((square) => {
      square.addEventListener("click", (e) => {
        e.preventDefault();
        if (!playing) return;
        if (squareSelected) removeSelected();
        if (square.classList.contains("selected") || square.classList.contains("disabled")) return;

        squareSelected = square;
        square.classList.add("selected");
        console.log(squareSelected);
      });
    });
  };

  return { actionSelect, reset };
};

// Fonction qui lance réellement le jeu
const play = ({ difficulty }) => {
  document.body.innerHTML = ""; // Réinitialise le DOM
  const { board, unsolved, missing } = generateSudoku(difficulty);
  console.log(JSON.stringify(unsolved));
  generateBoard(difficulty);
  const { resultRows: rows } = getRowsAndColumnBoard();
  setRowsBoard(rows, unsolved);
  const { actionSelect: action } = game({ board, unsolved, missing, play });
  action();
}

// Démarre une partie à l'initialisation
startGame(play);