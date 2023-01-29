function createPlayer(name) {
  let score = 0;

  function getName() {
    return name;
  }

  function getScore() {
    return score;
  }

  function addPoint() {
    score++;
  }

  return { getName, getScore, addPoint };
}

const playerX = createPlayer("Kenny");
const playerO = createPlayer("Ginny-Mei");

const gameBoard = (function () {
  const element = document.getElementById("game-board");

  const boardRows = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  function getColumns(rows) {
    const columns = [];

    for (let i = 0; i < 3; i++) {
      const column = [rows[0][i], rows[1][i], rows[2][i]];
      columns.push(column);
    }

    return columns;
  }

  function getDiagonals(rows) {
    return [
      [rows[0][0], rows[1][1], rows[2][2]],
      [rows[0][2], rows[1][1], rows[2][0]],
    ];
  }

  function checkLine(lines) {
    let winner = null;

    lines.forEach((line) => {
      const allEqual = line.every((mark) => mark === line[0] && mark !== "");

      if (!allEqual) {
        return;
      }

      if (line[0] === "x") {
        winner = playerX;
      } else {
        winner = playerO;
      }
    });

    return winner;
  }

  function checkBoard() {
    const allBoardLines = boardRows;
    allBoardLines.push(...getColumns(boardRows));
    allBoardLines.push(...getDiagonals(boardRows));
    const winner = checkLine(allBoardLines);

    if (winner) {
      game.end(winner);
    }
  }

  function placeMark(row, column) {
    const button = element.querySelector(
      `button[data-row="${row}"][data-column="${column}"]`
    );

    boardRows[row][column] = game.getTurn();
    button.classList.add(game.getTurn());
    button.setAttribute("disabled", "true");
    checkBoard();
    game.toggleTurn();
  }

  function renderCellIcons(cellElement) {
    const oIcon = document.createElement("img");
    oIcon.setAttribute("src", "./images/circle-outline-48.png");
    oIcon.setAttribute("alt", "o");
    oIcon.classList.add("o-icon");
    cellElement.appendChild(oIcon);

    const xIcon = document.createElement("img");
    xIcon.setAttribute("src", "./images/close-48.png");
    xIcon.setAttribute("alt", "x");
    xIcon.classList.add("x-icon");
    cellElement.appendChild(xIcon);
  }

  function renderCell(row, column) {
    const cellElement = document.createElement("button");
    cellElement.classList.add("cell", "empty");
    cellElement.setAttribute("data-row", row);
    cellElement.setAttribute("data-column", column);
    renderCellIcons(cellElement);
    element.appendChild(cellElement);
  }

  function render() {
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        renderCell(row, column, boardRows[row][column]);
      }
    }
  }

  function bindEvents() {
    const buttons = Array.from(element.querySelectorAll("button"));

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        placeMark(
          button.getAttribute("data-row"),
          button.getAttribute("data-column"),
          "x"
        );
      });
    });
  }

  function init() {
    render();
    bindEvents();
  }

  return { init };
})();

const game = (function () {
  const element = document.getElementById("game");
  let turn = "x";

  function getTurn() {
    return turn;
  }

  function toggleTurn() {
    turn = turn === "x" ? "o" : "x";
  }

  function inputPlayerNames() {}

  function showScores() {}

  function end(player) {
    console.log(`${player.getName()} wins!`);
    player.addPoint();
  }

  function init() {
    gameBoard.init();
    inputPlayerNames();
  }

  return {
    getTurn,
    toggleTurn,
    end,
    init,
  };
})();

game.init();
