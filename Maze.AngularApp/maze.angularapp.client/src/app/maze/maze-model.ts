import { MazeCellModel } from './maze-cell-model';

export class MazeModel {
  constructor(
    public rows: number,
    public columns: number,
    public cells: MazeCellModel[],
    public path: MazeCellModel[],
    public isInitialized: false,
    public activeCell: MazeCellModel
  ) {}
}
