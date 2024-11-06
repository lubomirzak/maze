namespace Maze.Logic.Models;

public class CartesianCell : Cell
{
    // Neighboring cells
    public CartesianCell? North { get; set; }
    public CartesianCell? South { get; set; }
    public CartesianCell? East { get; set; }
    public CartesianCell? West { get; set; }

    public override List<Cell?> Neighbors =>
        new Cell?[] { North, South, East, West }
            .Where(c => c != null)
            .ToList();

    public CartesianCell(int row, int col)
        : base(row, col) { }
}
