function createPlayer() {

  let score = 0;
  let name;

  function getName() {
    return name;
  }

  function setName(string) {
    name = string;
  }

  function getScore() {
    return score;
  }

  function updateScore(num) {
    if (!Number.isInteger(num)) return;
    score = num;
  }

  function getInfo() {
    // Returns a <p> containing two spans with the player's name and score
    
    const playerElement = document.createElement("p");
    playerElement.classList.add("player");

    const nameElement = document.createElement("span");
    nameElement.classList.add("name");
    nameElement.textContent = getName();
    playerElement.appendChild(nameElement);

    const scoreElement = document.createElement("span");
    scoreElement.classList.add("score");
    scoreElement.textContent = getScore();
    playerElement.appendChild(scoreElement);

    return playerElement;
  }

  return {
    getName,
    setName,
    getScore,
    updateScore,
    getInfo,
  };
}

const game = (function () {
  const element = document.getElementById("game");
  const nameForm = element.querySelector("form");
  const nameInputs = Array.from(element.querySelectorAll("input"));
  const startButton = element.querySelector("form > button");

  let turn = "x";
  const playerX = createPlayer();
  const playerO = createPlayer();

  function getTurn() {
    return turn;
  }

  function toggleTurn() {
    turn = turn === "x" ? "o" : "x";
  }

  function createPlayers() {
    playerX.setName(document.getElementById("x-name").value);
    playerO.setName(document.getElementById("o-name").value);
  }

  function renderScoreboard(...players) {
    const scoreBoard = element.querySelector(".scoreboard");

    players.forEach((player) => {
      scoreBoard.appendChild(player.getInfo());
    });

    scoreBoard.classList.remove("hidden");
  }

  function start() {
    createPlayers();
    nameForm.reset();
    nameForm.classList.add("hidden");
    renderScoreboard(playerX, playerO);
  }

  function end(winner) {
    console.log(`${winner.getName()} wins!`);
    winner.updateScore(winner.getScore() + 1);
  }

  function validateInputs(inputs) {
    if (inputs.every((input) => input.validity.valid)) {
      startButton.disabled = false;
    }
  }

  function bindEvents() {
    startButton.addEventListener("click", (event) => {
      event.preventDefault();
      start();
    });

    nameInputs.forEach((input) => {
      input.addEventListener("input", () => {
        if (validateInputs(nameInputs)) {
          startButton.disabled = false;
        }
      });
    });
  }

  function init() {
    bindEvents();
  }

  return {
    playerX,
    playerO,
    getTurn,
    toggleTurn,
    end,
    init,
  };
})();
game.init();

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
        winner = game.playerX;
      } else {
        winner = game.playerO;
      }
    });
    console.log(game.playerX);
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
gameBoard.init()