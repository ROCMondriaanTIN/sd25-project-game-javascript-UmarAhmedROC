var Controller = function() {
  var BOARD_SIZE = 10;
  var bombInput = document.getElementById("bombInput");
  var resetBtn = document.getElementById("resetBtn");

  var view = View();
  var timer = null;
  var seconds = 0;
  var model;

  function initEvents() {
    resetBtn.addEventListener("click", function() { reset(); });
    bombInput.addEventListener("change", function() { reset(); });
  }

  function reset() {
    if (timer) clearInterval(timer);

    seconds = 0;
    view.updateTimer(0);
    view.showMessage("");

    var size = BOARD_SIZE;
    var bombs = Number(bombInput.value);

    model = Minesweeper(size, bombs);

    view.setupBoard(size);

    for (var i = 0; i < model.totalCells; i++) {
      var el = view.createCell(i);

      model.cells[i].el = el;

      el.addEventListener("click", (function(index) {
        return function() { leftClick(index); };
      })(i));
      el.addEventListener("contextmenu", (function(index) {
        return function(e) {
          e.preventDefault();
          rightClick(index);
        };
      })(i));
      el.addEventListener("keydown", (function(index) {
        return function(e) {
          if (e.key === "Enter") leftClick(index);
          if (e.key === " ") {
            e.preventDefault();
            rightClick(index);
          }
        };
      })(i));
    }

    view.setBombsLeft(model.bombsLeft);
  }

  function leftClick(index) {
    if (model.gameOver) return;

    if (!model.started) {
      model.started = true;
      model.placeBombs(index);
      startTimer();
    }

    var changed = model.reveal(index);

    if (changed.length === 1 && changed[0].isBomb) {
      gameOver(false);
      return;
    }

    view.renderChanges(changed);

    if (model.checkWin()) {
      gameOver(true);
    }
  }

  function rightClick(index) {
    if (model.gameOver) return;

    var flagged = model.toggleFlag(index);
    view.renderFlag(model.cells[index], flagged);
    view.setBombsLeft(model.bombsLeft);
  }

  function startTimer() {
    timer = setInterval(function() {
      seconds++;
      view.updateTimer(seconds);
    }, 1000);
  }

  function gameOver(won) {
    model.gameOver = true;
    clearInterval(timer);

    var bombs = model.revealAllBombs();
    view.renderChanges(bombs);

    view.showMessage(
      won ? "Gefeliciteerd! Je hebt gewonnen." : "Game over — je bent ontploft."
    );
  }

  initEvents();
  reset();
};
