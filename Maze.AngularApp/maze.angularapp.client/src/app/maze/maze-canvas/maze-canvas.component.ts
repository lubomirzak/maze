import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { Maze } from '../shared/maze';
import { MazeCell } from '../shared/maze-cell';
import { TraverseMode } from '../../shared/app.traverse-mode.enum';

@Component({
  selector: 'app-maze-canvas',
  templateUrl: './maze-canvas.component.html',
  styleUrl: './maze-canvas.component.css',
})
export class MazeCanvasComponent implements OnChanges {
  @Input() maze: Maze = {} as Maze;
  @Input() traverseMode: TraverseMode = TraverseMode.None;
  @Input() isPathVisible: boolean = false;

  renderPath = false;
  isCanvasVisible = false;
  solved = false;

  size = 50; // default size of the cell

  @ViewChild('canvas')
  canvas: ElementRef = {} as ElementRef;
  context!: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
  }

  ngOnChanges(changes: SimpleChanges) {
    var mazeExists = Object.keys(this.maze).length > 0;

    if (changes['maze']) {
      if (mazeExists) {
        this.maze.activeCell = this.maze.cells[0];
        this.redraw();
      } else {
        this.isCanvasVisible = false;
        this.solved = false;
        this.renderPath = false;
        this.isPathVisible = false;
      }
    }

    if (changes['isPathVisible']) {
      this.renderPath = changes['isPathVisible'].currentValue;

      if (mazeExists) {
        this.redraw();
      }
    }

    if (changes['traverseMode']) {
      var mode = changes['traverseMode'].currentValue;

      this.traverseMode = mode;

      if (mode == TraverseMode.Manual) {
        this.maze.activeCell = this.getCell(0, 0);
        this.solved = false;
        this.redraw();
      } else if (mode == TraverseMode.Automatic) {
        this.traverseAutomatically();
      }
    }
  }

  // In Manual mode we listen to arrow keys to navigate Mario around the canvas.
  // Redraw is called after each click.
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (
      this.isCanvasVisible &&
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
        activeCell.y != this.maze.rows - 1
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

      this.redraw();

      if (
        this.maze.activeCell.y == this.maze.rows - 1 &&
        this.maze.activeCell.x == this.maze.columns - 1
      ) {
        this.solved = true;
      }
    }
  }

  // Shortcut to redraw everything needed - canvas, mario and path (optionally)
  redraw(): void {
    this.drawCanvas();
    this.drawMario();

    if (this.isPathVisible) {
      this.drawCorrectPath();
    }
  }

  // Resizes the canvas based on maze grid size.
  // Afterwards paints borders of each cell one by one until whole maze is displayed.
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

    this.isCanvasVisible = true;
  }

  // Draws Mario on an active cell of the maze.
  drawMario(): void {
    var baseX = this.maze.activeCell.x * this.size;
    var baseY = this.maze.activeCell.y * this.size;

    var size = this.size;
    var upperXOffset = baseX + size / 5;
    var upperYOffset = baseY + size / 10;
    var width = size - (size / 10) * 3;
    var height = size - (size / 10) * 2;

    var img = new Image();
    img.src = 'mario.jpeg';
    img.onload = () => {
      this.context.drawImage(img, upperXOffset, upperYOffset, width, height);
    };
  }

  // Draws correct path into the canvas for given maze - uses red line to do so.
  drawCorrectPath(): void {
    var middle = this.size / 2;

    var previousCell = {} as MazeCell;
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

  // Moves Mario along path step by step every 'interval' miliseconds
  // Since JavaScript is by default sync, I had to use promise chain.
  // This can be stopped if needed via isCanvasVisible being set to false.
  traverseAutomatically(): void {
    var interval = 400;
    var promise = Promise.resolve();

    this.maze.path.forEach((cell) => {
      promise = promise.then(() => {
        if (Object.keys(this.maze).length > 0) {
          this.maze.activeCell = this.getCell(cell.x, cell.y);
          this.redraw();
        }

        return new Promise((resolve) => {
          // avoid moving Mario when reset was clicked
          if (this.isCanvasVisible) {
            setTimeout(resolve, interval);
          }
        });
      });
    });

    promise.then(() => {
      this.solved = true;
    });
  }

  // Returns cell located at given position in maze
  getCell(x: number, y: number): MazeCell {
    var result = this.maze.cells.find((cell) => {
      return cell.x == x && cell.y == y;
    });

    return result!;
  }
}
