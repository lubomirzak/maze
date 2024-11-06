import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { MazeModel } from '../maze-model';
import { MazeCellModel } from '../maze-cell-model';
import { TraverseMode } from '../../shared/app.traverse-mode.enum';

@Component({
  selector: 'app-maze-canvas',
  templateUrl: './maze-canvas.component.html',
  styleUrl: './maze-canvas.component.css',
})
export class MazeCanvasComponent implements OnChanges {
  @Input() maze: MazeModel = {} as MazeModel;
  @Input() traverseMode: TraverseMode = TraverseMode.None;

  canvasVisible = false;
  solved = false;

  size = 50;

  @ViewChild('canvas')
  canvas: ElementRef = {} as ElementRef;
  context!: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['maze']) {
      if (Object.keys(this.maze).length > 0) {
        this.maze.activeCell = this.maze.cells[0];

        this.drawCanvas();
      }
    }

    if (changes['traverseMode']) {
      var mode = changes['traverseMode'].currentValue;

      this.traverseMode = mode;

      if (mode == TraverseMode.Manual) {
        this.maze.activeCell = this.getCell(0,0);
        this.drawCanvas();
        this.drawMario();
      } else if (mode == TraverseMode.Automatic) {
        this.drawCanvas();
        this.drawCorrectPath();
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (
      this.canvasVisible &&
      this.traverseMode == TraverseMode.Manual &&
      !this.solved
    ) {
      var activeCell = this.maze.activeCell;

      if (event.key == 'ArrowRight' && !activeCell.borderRight) {
        this.maze.activeCell = this.getCell(activeCell.x + 1, activeCell.y);
      }

      if (
        event.key == 'ArrowDown' &&
        !activeCell.borderBottom &&
        activeCell.y != this.maze.columns - 1
      ) {
        this.maze.activeCell = this.getCell(activeCell.x, activeCell.y + 1);
      }

      if (event.key == 'ArrowLeft' && !activeCell.borderLeft) {
        this.maze.activeCell = this.getCell(activeCell.x - 1, activeCell.y);
      }

      if (
        event.key == 'ArrowUp' &&
        !activeCell.borderTop &&
        activeCell.y != 0
      ) {
        this.maze.activeCell = this.getCell(activeCell.x, activeCell.y - 1);
      }

      this.drawCanvas();
      this.drawMario();

      if (
        this.maze.activeCell.y == this.maze.rows - 1 &&
        this.maze.activeCell.x == this.maze.columns - 1
      ) {
        this.solved = true;
      }
    }
  }

  drawCanvas(): void {
    var numberOfCells = this.maze.rows * this.maze.columns;

    if (numberOfCells > 100) {
      this.size = 40;
    }

    if (numberOfCells > 400) {
      this.size = 30;
    }

    if (numberOfCells > 900) {
      this.size = 25;
    }

    if (numberOfCells > 1600) {
      this.size = 20;
    }

    var size = this.size;

    this.canvas.nativeElement.height = this.maze.rows * size;
    this.canvas.nativeElement.width = this.maze.columns * size;

    var ctx = this.context;

    ctx.beginPath();

    this.maze.cells.forEach((cell) => {
      var baseX = cell.x * size;
      var baseY = cell.y * size;

      ctx.moveTo(baseX, baseY);

      if (cell.borderLeft) {
        ctx.lineTo(baseX, baseY + size);
      } else {
        ctx.moveTo(baseX, baseY + size);
      }

      if (cell.borderBottom) {
        ctx.lineTo(baseX + size, baseY + size);
      } else {
        ctx.moveTo(baseX + size, baseY + size);
      }

      if (cell.borderRight) {
        ctx.lineTo(baseX + size, baseY);
      } else {
        ctx.moveTo(baseX + size, baseY);
      }

      if (cell.borderTop) {
        ctx.lineTo(baseX, baseY);
      } else {
        ctx.moveTo(baseX, baseY);
      }
    });

    ctx.stroke();

    // Let's make outer borders size 2 so they match inner walls
    ctx.beginPath();
    ctx.lineWidth = 4;

    ctx.moveTo(0, 0);
    ctx.lineTo(0, this.maze.rows * size);
    ctx.lineTo((this.maze.columns - 1) * size, this.maze.rows * size);
    ctx.moveTo(this.maze.columns * size, this.maze.rows * size);
    ctx.lineTo(this.maze.columns * size, 0);
    ctx.lineTo(0 + size, 0);

    ctx.stroke();

    this.canvasVisible = true;
  }

  drawMario(): void {
    var ctx = this.context;

    var baseX = this.maze.activeCell.x * this.size;
    var baseY = this.maze.activeCell.y * this.size;

    var size = this.size;
    var upperXOffset = baseX + size / 5;
    var upperYOffset = baseY + size / 10;
    var width = size - (size / 10 * 3);
    var height =  size - (size / 10 * 2);

    var img = new Image();
    img.src = 'mario.jpeg';
    img.onload = function (this) {
      ctx.drawImage(img, upperXOffset, upperYOffset, width, height);
    };
  }

  drawCorrectPath(): void {
    var middle = this.size / 2;

    var previousCell = {} as MazeCellModel;
    var previousX = 0 + middle;
    var previousY = 0;

    var ctx = this.context;

    ctx.beginPath();
    ctx.strokeStyle = 'red';

    this.maze.path.forEach((cell) => {
      // start
      if (Object.keys(previousCell).length === 0) {
        ctx.moveTo(0 + middle, 0);
        ctx.lineTo(middle, middle);

        previousX = middle;
        previousY = middle;
      } else {
        // we're moving up/down
        if (previousCell.x == cell.x) {
          if (previousCell.y < cell.y) {
            // down
            ctx.lineTo(previousX, previousY + this.size);

            previousY = previousY + this.size;
          } else {
            // up
            ctx.lineTo(previousX, previousY - this.size);

            previousY = previousY - this.size;
          }
        } else {
          // left or right
          if (previousCell.x < cell.x) {
            // right
            ctx.lineTo(previousX + this.size, previousY);

            previousX = previousX + this.size;
          } else {
            // left
            ctx.lineTo(previousX - this.size, previousY);

            previousX = previousX - this.size;
          }
        }
      }

      previousCell = cell;
    });

    ctx.lineTo(previousX, previousY + middle);

    ctx.stroke();
  }

  getCell(x: number, y: number): MazeCellModel {
    var result = this.maze.cells.find((cell) => {
      return cell.x == x && cell.y == y;
    });

    return result!;
  }
}
