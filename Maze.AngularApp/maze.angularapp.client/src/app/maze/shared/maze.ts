import { MazeCell } from './maze-cell';

export class Maze {
  constructor(
    public rows: number,
    public columns: number,
    public cells: MazeCell[],
    public path: MazeCell[],
    public activeCell: MazeCell
  ) {}
}
