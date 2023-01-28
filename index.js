const elements = (function () {
  const game = document.getElementById("game");
  const gameBoard = game.querySelector(".game-board");

  return {
    game,
    gameBoard,
  };
})();

const gameBoard = (function () {
  const cells = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  function placeMark(row, column, mark) {
    const button = elements.gameBoard.querySelector(
      `button[data-row="${row}"][data-column="${column}"]`
    );

    cells[row][column] = mark;
    button.classList.add(game.getTurn());
    button.setAttribute("disabled", "true")
    game.toggleTurn();
  }

  // Renders the x and o icons inside a single cell
  // These will be hidden initially since the cells are 'emtpy'
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
    elements.gameBoard.appendChild(cellElement);
  }

  function render() {
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        renderCell(row, column, cells[row][column]);
      }
    }
  }

  function bindEvents() {
    const buttons = Array.from(elements.gameBoard.querySelectorAll("button"));
    // TODO: update button event listener to send the right mark based on turn
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

  return { init, placeMark };
})();

gameBoard.init();

const game = (function() {
  let turn = "x";

  function getTurn() {
    return turn;
  }

  function toggleTurn() {
    turn = (turn === "x") ? "o" : "x";
  }

  return {
    turn,
    getTurn,
    toggleTurn,
  }
})();