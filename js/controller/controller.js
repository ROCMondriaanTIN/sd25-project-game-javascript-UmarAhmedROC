import Minesweeper from "../model/minesweeper.js";
import View from "../view/view.js";

export default class Controller {
  constructor() {
    this.BOARD_SIZE = 10;
    this.bombInput = document.getElementById("bombInput");
    this.resetBtn = document.getElementById("resetBtn");

    this.view = new View();

    this.timer = null;
    this.seconds = 0;

    this.initEvents();
    this.reset();
  }

  initEvents() {
    this.resetBtn.addEventListener("click", () => this.reset());
    this.bombInput.addEventListener("change", () => this.reset());
  }

  reset() {
    if (this.timer) clearInterval(this.timer);

    this.seconds = 0;
    this.view.updateTimer(0);
    this.view.showMessage("");

    const size = this.BOARD_SIZE;
    const bombs = Number(this.bombInput.value);

    this.model = new Minesweeper(size, bombs);

    this.view.setupBoard(size);

    for (let i = 0; i < this.model.totalCells; i++) {
      const el = this.view.createCell(i);

      this.model.cells[i].el = el;

      el.addEventListener("click", () => this.leftClick(i));
      el.addEventListener("contextmenu", e => {
        e.preventDefault();
        this.rightClick(i);
      });
      el.addEventListener("keydown", e => {
        if (e.key === "Enter") this.leftClick(i);
        if (e.key === " ") {
          e.preventDefault();
          this.rightClick(i);
        }
      });
    }

    this.view.setBombsLeft(this.model.bombsLeft);
  }

  leftClick(index) {
    if (this.model.gameOver) return;

    if (!this.model.started) {
      this.model.started = true;
      this.model.placeBombs(index);
      this.startTimer();
    }

    const changed = this.model.reveal(index);

    if (changed.length === 1 && changed[0].isBomb) {
      this.gameOver(false);
      return;
    }

    this.view.renderChanges(changed);

    if (this.model.checkWin()) {
      this.gameOver(true);
    }
  }

  rightClick(index) {
    if (this.model.gameOver) return;

    const flagged = this.model.toggleFlag(index);
    this.view.renderFlag(this.model.cells[index], flagged);
    this.view.setBombsLeft(this.model.bombsLeft);
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.seconds++;
      this.view.updateTimer(this.seconds);
    }, 1000);
  }

  gameOver(won) {
    this.model.gameOver = true;
    clearInterval(this.timer);

    const bombs = this.model.revealAllBombs();
    this.view.renderChanges(bombs);

    this.view.showMessage(
      won ? "Gefeliciteerd! Je hebt gewonnen." : "Game over — je bent ontploft."
    );
  }
}
