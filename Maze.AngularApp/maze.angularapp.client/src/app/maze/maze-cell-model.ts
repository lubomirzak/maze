export class MazeCellModel {
  constructor(
    public x: number,
    public y: number,
    public borderLeft: boolean,
    public borderRight: boolean,
    public borderBottom: boolean,
    public borderTop: boolean,
    public isActive: boolean
  ) {}
}
