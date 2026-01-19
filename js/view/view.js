var View = function() {
  var board = document.getElementById("board");
  var bombsLeftEl = document.getElementById("bombsLeft");
  var timerEl = document.getElementById("timer");
  var messageEl = document.getElementById("message");

  function setupBoard(size) {
    board.style.setProperty("--size", size);
    board.innerHTML = "";
  }

  function createCell(index) {
    var el = document.createElement("div");
    el.className = "cell";
    el.dataset.index = index;
    el.tabIndex = 0;
    board.appendChild(el);
    return el;
  }

  function updateTimer(sec) {
    timerEl.textContent = sec;
  }

  function setBombsLeft(n) {
    bombsLeftEl.textContent = n;
  }

  function showMessage(msg) {
    messageEl.textContent = msg;
  }

  function renderChanges(changes) {
    for (var i = 0; i < changes.length; i++) {
      var c = changes[i];
      var el = c.el;

      el.classList.add("revealed");

      if (c.isBomb) {
        el.classList.add("bomb");
        el.textContent = "💣";
        continue;
      }

      if (c.bombsAround > 0) {
        el.textContent = c.bombsAround;
        el.classList.add("number-" + c.bombsAround);
      } else {
        el.textContent = "";
      }
    }
  }

  function renderFlag(cell, flagged) {
    cell.el.innerHTML = flagged ? '<span class="flag">🚩</span>' : "";
  }

  return {
    setupBoard: setupBoard,
    createCell: createCell,
    updateTimer: updateTimer,
    setBombsLeft: setBombsLeft,
    showMessage: showMessage,
    renderChanges: renderChanges,
    renderFlag: renderFlag
  };
};
