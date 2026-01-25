// Game manager: controls events and game flow
var Controller = function() {
  var BOARD_SIZE = 10;

  var bombInput = document.getElementById("bombInput");
  var resetBtn = document.getElementById("resetBtn");

  var view = new View();
  var model;
  var gameTimer;
  var secondsElapsed;

  // When user clicks reset button
  function onResetClick() {
    reset();
  }

  // When user changes bomb count
  function onBombInputChange() {
    reset();
  }

  // Create new game
  function reset() {
    if (gameTimer) {
      clearInterval(gameTimer);
    }

    secondsElapsed = 0;
    view.updateTimer(0);
    view.showMessage("");

    var boardSize = BOARD_SIZE;
    var bombCount = Number(bombInput.value);

    model = new Minesweeper(boardSize, bombCount);
    view.setupBoard(boardSize);

    // Create all cells
    var i;
    for (i = 0; i < model.totalCells; i++) {
      var cellElement = view.createCell(i);
      model.cells[i].el = cellElement;

      // Add click event
      cellElement.addEventListener("click", makeLeftClickHandler(i));

      // Add right-click event
      cellElement.addEventListener("contextmenu", makeRightClickHandler(i));

      // Add keyboard event
      cellElement.addEventListener("keydown", makeKeydownHandler(i));
    }

    view.setBombsLeft(model.bombsLeft);
  }

  // Create left-click function for a cell
  function makeLeftClickHandler(cellIndex) {
    return function() {
      onLeftClick(cellIndex);
    };
  }

  // Create right-click function for a cell
  function makeRightClickHandler(cellIndex) {
    return function(e) {
      e.preventDefault();
      onRightClick(cellIndex);
    };
  }

  // Create keyboard function for a cell
  function makeKeydownHandler(cellIndex) {
    return function(e) {
      if (e.key === "Enter") {
        onLeftClick(cellIndex);
      }
      if (e.key === " ") {
        e.preventDefault();
        onRightClick(cellIndex);
      }
    };
  }

  // Handle left-click on a cell
  function onLeftClick(cellIndex) {
    if (model.gameOver) {
      return;
    }

    // First click: place bombs and start timer
    if (!model.started) {
      model.started = true;
      model.placeBombs(cellIndex);
      startGameTimer();
    }

    // Reveal cells
    var revealedCells = model.reveal(cellIndex);

    // Check if player hit a bomb
    if (revealedCells.length === 1 && revealedCells[0].isBomb) {
      onGameOver(false);
      return;
    }

    // Draw revealed cells on screen
    view.renderChanges(revealedCells);

    // Check if player won
    if (model.checkWin()) {
      onGameOver(true);
    }
  }

  // Handle right-click on a cell
  function onRightClick(cellIndex) {
    if (model.gameOver) {
      return;
    }

    var flagged = model.toggleFlag(cellIndex);
    view.renderFlag(model.cells[cellIndex], flagged);
    view.setBombsLeft(model.bombsLeft);
  }

  // Start the game timer
  function startGameTimer() {
    gameTimer = setInterval(function() {
      secondsElapsed++;
      view.updateTimer(secondsElapsed);
    }, 1000);
  }

  // End the game
  function onGameOver(playerWon) {
    model.gameOver = true;
    clearInterval(gameTimer);

    var allBombs = model.revealAllBombs();
    view.renderChanges(allBombs);

    var message;
    if (playerWon) {
      message = "Gefeliciteerd! Je hebt gewonnen.";
    } else {
      message = "Game over — je bent ontploft.";
    }
    view.showMessage(message);
  }

  // Start listening to buttons
  resetBtn.addEventListener("click", onResetClick);
  bombInput.addEventListener("change", onBombInputChange);

  // Create first game
  reset();
};
