// Handle all screen drawing (UI) 
var View = function() {
  var board = document.getElementById("board");
  var bombsLeftEl = document.getElementById("bombsLeft");
  var timerEl = document.getElementById("timer");
  var messageEl = document.getElementById("message");

  // Clear board and set size
  this.setupBoard = function(size) {
    board.style.setProperty("--size", size);
    board.innerHTML = "";
  };

  // Create one cell element
  this.createCell = function(cellIndex) {
    var element = document.createElement("div");
    element.className = "cell";
    element.dataset.index = cellIndex;
    element.tabIndex = 0;
    board.appendChild(element);
    return element;
  };

  // Show timer number
  this.updateTimer = function(seconds) {
    timerEl.textContent = seconds;
  };

  // Show bombs left number
  this.setBombsLeft = function(count) {
    bombsLeftEl.textContent = count;
  };

  // Show game message
  this.showMessage = function(text) {
    messageEl.textContent = text;
  };

  // Draw revealed cells (bombs or numbers)
  this.renderChanges = function(cellList) {
    var i;
    for (i = 0; i < cellList.length; i++) {
      var cell = cellList[i];
      var element = cell.el;

      element.classList.add("revealed");

      if (cell.isBomb) {
        element.classList.add("bomb");
        element.textContent = "💣";
      } else if (cell.bombsAround > 0) {
        element.textContent = cell.bombsAround;
        element.classList.add("number-" + cell.bombsAround);
      } else {
        element.textContent = "";
      }
    }
  };

  // Draw or remove flag
  this.renderFlag = function(cell, isFlagged) {
    if (isFlagged) {
      cell.el.innerHTML = '<span class="flag">🚩</span>';
    } else {
      cell.el.innerHTML = "";
    }
  };
};
