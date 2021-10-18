import { Cell } from "./cell"
import { Outcome } from "./interfaces";

const PEERS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export class Board {
  cells: Cell[][] = [];

  remainingCells = 0;
  remainingMines = 0;

  constructor(size: number, mines: number) {
    for (let i = 0; i < size; i++) {
      this.cells[i] = [];
      for (let x = 0; x < size; x++) {
        this.cells[i][x] = new Cell(i, x);
      }
    }
    // Assign mines
    for (let z = 0; z < mines; z++) {
      this.getRandomCell().mine = true;
    }

    // Count mines
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let adjacentMines = 0;
        for (const peer of PEERS) {
          if (
            this.cells[y + peer[0]] &&
            this.cells[y + peer[0]][x + peer[1]] &&
            this.cells[y + peer[0]][x + peer[1]].mine
          ) {
            adjacentMines++;
          }
        }
        this.cells[y][x].proximityMines = adjacentMines;

        if (this.cells[y][x].mine) {
          this.remainingMines++;
        }
      }
    }
    this.remainingCells = (size * size) - this.remainingMines;
  }


  getRandomCell(): Cell {
    const y = Math.floor(Math.random() * this.cells.length);
    const x = Math.floor(Math.random() * this.cells.length);
    return this.cells[y][x];
  }

  checkCell(cell: Cell): Outcome {
    if (cell.status !== "open") {
      return -1;
    } else if (cell.mine) {
      this.revealAll();
      return Outcome.Lose;
    } else {
      cell.status = 'clear';

      // clear the whole block if cell is empty
      if (cell.proximityMines === 0) {
        for (const peer of PEERS) {
          if (
            this.cells[cell.row + peer[0]] &&
            this.cells[cell.row + peer[0]][cell.col + peer[1]]
          ) {
            this.checkCell(this.cells[cell.row + peer[0]][cell.col + peer[1]]);
          }
        }
      }

      if (this.remainingCells-- <= 1) {
        return Outcome.Win;
      }
      return -1;
    }
  }

  revealAll() {
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells.length; j++) {
        this.cells[i][j].status = 'clear';
      }
    }
  }
}
