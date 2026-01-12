export default class Minesweeper {
  constructor(size, bombs) {
    this.size = size;
    this.totalCells = size * size;
    this.totalBombs = Math.min(bombs, this.totalCells - 1);
    this.cells = [];
    this.started = false;
    this.seconds = 0;
    this.bombsLeft = this.totalBombs;
    this.gameOver = false;
    this.timer = null;

    this._initCells();
    this._calcNeighbors();
  }

  _initCells() {
    for (let i = 0; i < this.totalCells; i++) {
      this.cells.push({
        index: i,
        isBomb: false,
        revealed: false,
        flagged: false,
        bombsAround: 0,
        neighbors: []
      });
    }
  }

  _calcNeighbors() {
    for (let i = 0; i < this.totalCells; i++) {
      this.cells[i].neighbors = this.getNeighbors(i);
    }
  }

  getNeighbors(index) {
    const x = index % this.size;
    const y = Math.floor(index / this.size);
    const arr = [];

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
          arr.push(ny * this.size + nx);
        }
      }
    }
    return arr;
  }

  placeBombs(firstClickIndex) {
    const safe = new Set([firstClickIndex, ...this.cells[firstClickIndex].neighbors]);
    let placed = 0;

    while (placed < this.totalBombs) {
      const r = Math.floor(Math.random() * this.totalCells);
      if (safe.has(r) || this.cells[r].isBomb) continue;

      this.cells[r].isBomb = true;
      placed++;
    }

    for (let c of this.cells) {
      let count = 0;
      for (let n of c.neighbors) {
        if (this.cells[n].isBomb) count++;
      }
      c.bombsAround = count;
    }
  }

  reveal(index) {
    const cell = this.cells[index];
    if (cell.revealed || cell.flagged) return [];

    if (cell.isBomb) {
      cell.revealed = true;
      return [cell];
    }

    const changed = [];
    const stack = [index];

    while (stack.length) {
      const i = stack.pop();
      const c = this.cells[i];
      if (c.revealed || c.flagged) continue;

      c.revealed = true;
      changed.push(c);

      if (c.bombsAround === 0) {
        for (let n of c.neighbors) {
          const nb = this.cells[n];
          if (!nb.revealed && !nb.isBomb) {
            stack.push(n);
          }
        }
      }
    }

    return changed;
  }

  toggleFlag(index) {
    const c = this.cells[index];
    if (c.revealed) return false;

    c.flagged = !c.flagged;
    this.bombsLeft += c.flagged ? -1 : 1;
    return c.flagged;
  }

  checkWin() {
    return this.cells.every(c => c.revealed || c.isBomb);
  }

  revealAllBombs() {
    return this.cells.filter(c => c.isBomb);
  }
}
