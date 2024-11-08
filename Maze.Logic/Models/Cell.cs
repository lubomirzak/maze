namespace Maze.Logic.Models;

public abstract class Cell(int row, int col)
{
    // Position in the maze
    public int Row { get; } = row;
    public int Column { get; } = col;

    // Holds a info if this cell is part of the automatic traverse path
    public bool InPath { get; set; } = false;

    // Cells that are linked to this cell
    private readonly Dictionary<Cell, bool> _links = new Dictionary<Cell, bool>();
    public List<Cell> Links => _links.Keys.ToList();

    public abstract List<Cell?> Neighbors { get; }

    public int Weight { get; set; } = 1;

    public virtual void Link(Cell cell, bool bidirectional = true)
    {
        _links[cell] = true;
        if (bidirectional)
        {
            cell.Link(this, false);
        }
    }

    public virtual void Unlink(Cell cell, bool bidirectional = true)
    {
        _links.Remove(cell);
        if (bidirectional)
        {
            cell.Unlink(this, false);
        }
    }

    public bool IsLinked(Cell? cell)
    {
        if (cell == null)
        {
            return false;
        }
        return _links.ContainsKey(cell);
    }
}
