// Create a new Minesweeper game
var Minesweeper = function(size, bombs) {
  var totalCells = size * size;
  var totalBombs = Math.min(bombs, totalCells - 1);
  var cells = [];
  var started = false;
  var bombsLeft = totalBombs;
  var gameOver = false;

  // Create empty cells
  var i;
  for (i = 0; i < totalCells; i++) {
    cells[i] = {
      index: i,
      isBomb: false,
      revealed: false,
      flagged: false,
      bombsAround: 0,
      neighbors: []
    };
  }

  // Find all neighbors for each cell
  for (i = 0; i < totalCells; i++) {
    cells[i].neighbors = getNeighbors(i);
  }

  // Find neighbors of a cell (8 surrounding cells)
  function getNeighbors(cellIndex) {
    var x = cellIndex % size;
    var y = Math.floor(cellIndex / size);
    var result = [];

    var dy, dx, newX, newY, newIndex;
    for (dy = -1; dy <= 1; dy++) {
      for (dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        
        newX = x + dx;
        newY = y + dy;

        if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
          newIndex = newY * size + newX;
          result.push(newIndex);
        }
      }
    }
    return result;
  }

  // Place bombs randomly (except first-click cell)
  this.placeBombs = function(firstClickIndex) {
    var safeZone = [];
    safeZone.push(firstClickIndex);
    
    var j;
    for (j = 0; j < cells[firstClickIndex].neighbors.length; j++) {
      safeZone.push(cells[firstClickIndex].neighbors[j]);
    }

    var placed = 0;
    while (placed < totalBombs) {
      var randomIndex = Math.floor(Math.random() * totalCells);
      var isSafe = safeZone.indexOf(randomIndex) !== -1;
      var alreadyHasBomb = cells[randomIndex].isBomb;
      
      if (isSafe || alreadyHasBomb) continue;

      cells[randomIndex].isBomb = true;
      placed++;
    }

    // Count bombs next to each cell
    var k, currentCell, bombCount;
    for (k = 0; k < cells.length; k++) {
      currentCell = cells[k];
      bombCount = 0;
      
      var m;
      for (m = 0; m < currentCell.neighbors.length; m++) {
        if (cells[currentCell.neighbors[m]].isBomb) {
          bombCount++;
        }
      }
      currentCell.bombsAround = bombCount;
    }
  };

  // Reveal a single cell
  this.reveal = function(cellIndex) {
    var cell = cells[cellIndex];
    if (cell.revealed || cell.flagged) {
      return [];
    }

    cell.revealed = true;
    return [cell];
  };

  // Add or remove a flag on a cell
  this.toggleFlag = function(cellIndex) {
    var cell = cells[cellIndex];
    if (cell.revealed) {
      return false;
    }

    cell.flagged = !cell.flagged;
    if (cell.flagged) {
      bombsLeft--;
    } else {
      bombsLeft++;
    }
    return cell.flagged;
  };

  // Check if player won (all non-bombs revealed)
  this.checkWin = function() {
    var i;
    for (i = 0; i < cells.length; i++) {
      if (!cells[i].revealed && !cells[i].isBomb) {
        return false;
      }
    }
    return true;
  };

  // Get all bomb cells for end game
  this.revealAllBombs = function() {
    var bombs = [];
    var i;
    for (i = 0; i < cells.length; i++) {
      if (cells[i].isBomb) {
        bombs.push(cells[i]);
      }
    }
    return bombs;
  };

  // Properties that other code needs
  this.cells = cells;
  this.totalCells = totalCells;
  this.totalBombs = totalBombs;
  this.started = started;
  this.bombsLeft = bombsLeft;
  this.gameOver = gameOver;
};
