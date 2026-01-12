export default class View {
  constructor() {
    this.board = document.getElementById("board");
    this.bombsLeftEl = document.getElementById("bombsLeft");
    this.timerEl = document.getElementById("timer");
    this.messageEl = document.getElementById("message");
  }

  setupBoard(size) {
    this.board.style.setProperty("--size", size);
    this.board.innerHTML = "";
  }

  createCell(index) {
    const el = document.createElement("div");
    el.className = "cell";
    el.dataset.index = index;
    el.tabIndex = 0;
    this.board.appendChild(el);
    return el;
  }

  updateTimer(sec) {
    this.timerEl.textContent = sec;
  }

  setBombsLeft(n) {
    this.bombsLeftEl.textContent = n;
  }

  showMessage(msg) {
    this.messageEl.textContent = msg;
  }

  renderChanges(changes) {
    for (let c of changes) {
      const el = c.el;

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

  renderFlag(cell, flagged) {
    cell.el.innerHTML = flagged ? '<span class="flag">🚩</span>' : "";
  }
}
