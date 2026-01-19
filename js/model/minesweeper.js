var Minesweeper = function(size, bombs) {
  var totalCells = size * size;
  var totalBombs = Math.min(bombs, totalCells - 1);
  var cells = [];
  var started = false;
  var seconds = 0;
  var bombsLeft = totalBombs;
  var gameOver = false;
  var timer = null;

  for (var i = 0; i < totalCells; i++) {
    cells.push({
      index: i,
      isBomb: false,
      revealed: false,
      flagged: false,
      bombsAround: 0,
      neighbors: []
    });
  }

  for (var i = 0; i < totalCells; i++) {
    cells[i].neighbors = getNeighbors(i);
  }

  function getNeighbors(index) {
    var x = index % size;
    var y = Math.floor(index / size);
    var arr = [];

    for (var dy = -1; dy <= 1; dy++) {
      for (var dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        var nx = x + dx;
        var ny = y + dy;

        if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
          arr.push(ny * size + nx);
        }
      }
    }
    return arr;
  }

  function placeBombs(firstClickIndex) {
    var safe = [firstClickIndex];
    for (var j = 0; j < cells[firstClickIndex].neighbors.length; j++) {
      safe.push(cells[firstClickIndex].neighbors[j]);
    }
    var placed = 0;

    while (placed < totalBombs) {
      var r = Math.floor(Math.random() * totalCells);
      if (safe.indexOf(r) !== -1 || cells[r].isBomb) continue;

      cells[r].isBomb = true;
      placed++;
    }

    for (var k = 0; k < cells.length; k++) {
      var c = cells[k];
      var count = 0;
      for (var m = 0; m < c.neighbors.length; m++) {
        if (cells[c.neighbors[m]].isBomb) count++;
      }
      c.bombsAround = count;
    }
  }

  function reveal(index) {
    var cell = cells[index];
    if (cell.revealed || cell.flagged) return [];

    cell.revealed = true;
    return [cell];
  }

  function toggleFlag(index) {
    var c = cells[index];
    if (c.revealed) return false;

    c.flagged = !c.flagged;
    bombsLeft += c.flagged ? -1 : 1;
    return c.flagged;
  }

  function checkWin() {
    for (var i = 0; i < cells.length; i++) {
      if (!cells[i].revealed && !cells[i].isBomb) return false;
    }
    return true;
  }

  function revealAllBombs() {
    var bombs = [];
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].isBomb) bombs.push(cells[i]);
    }
    return bombs;
  }

  return {
    cells: cells,
    totalCells: totalCells,
    totalBombs: totalBombs,
    started: started,
    seconds: seconds,
    bombsLeft: bombsLeft,
    gameOver: gameOver,
    timer: timer,
    placeBombs: placeBombs,
    reveal: reveal,
    toggleFlag: toggleFlag,
    checkWin: checkWin,
    revealAllBombs: revealAllBombs
  };
};
