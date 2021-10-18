import { Component } from '@angular/core';
import { Board } from './game/board';
import { Cell } from './game/cell';
import { Outcome } from './game/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'minesweeper';
  board!: Board;
  constructor() {
    this.reset();
  }

  checkCell(cell: any) {
    const result = this.board.checkCell(cell);
    if (result === Outcome.Lose) {
      alert('You lost! :(')
    } else if (result === Outcome.Win) {
      alert('You\'ve won!');
    }
  }

  flag(e: { preventDefault: () => void; }, cell: Cell): void {
    e.preventDefault();
    if (cell.status === 'flag') {
      cell.status = 'open';
    } else {
      cell.status = 'flag';
    }
  }

  reset() {
    this.board = new Board(10, 10);
  }

  get remainingCellCount() {
    return this.board.remainingCells;
  }

  get remainingMineCount() {
    return this.board.remainingMines;
  }
}
