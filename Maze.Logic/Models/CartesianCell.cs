namespace Maze.Logic.Models;

public class CartesianCell(int row, int col) : Cell(row, col)
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
}
