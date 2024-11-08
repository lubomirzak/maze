using System.Text;
using Maze.Logic.Enums;

namespace Maze.Logic.Models;

public class Grid
{
    public int Rows { get; }
    public int Columns { get; }
    public virtual int Size => Rows * Columns;

    // The actual grid
    protected List<List<Cell>> _grid = [];

    // Cell marking active cell during manual transition
    public Cell ActiveCell { get; set; }

    // List of cells that present an actual solution to the maze
    public List<Cell> Path { get; set; }

    public virtual Cell? this[int row, int column]
    {
        get
        {
            if (row < 0 || row >= Rows)
            {
                return null;
            }
            if (column < 0 || column >= Columns)
            {
                return null;
            }
            return _grid[row][column];
        }
    }

    public virtual Cell RandomCell(Random? random = null)
    {
        var rand = random ?? new Random();
        var row = rand.Next(Rows);
        var col = rand.Next(Columns);
        var randomCell =
            this[row, col] ?? throw new InvalidOperationException("Random cell is null");
        return randomCell;
    }

    // Row iterator
    public IEnumerable<List<Cell>> Row
    {
        get
        {
            foreach (var row in _grid)
            {
                yield return row;
            }
        }
    }

    // Cell iterator
    public virtual IEnumerable<Cell> Cells
    {
        get
        {
            foreach (var row in Row)
            {
                foreach (var cell in row)
                {
                    if (cell != null)
                    {
                        yield return cell;
                    }
                }
            }
        }
    }

    public Grid(int rows, int cols)
    {
        Rows = rows;
        Columns = cols;

        PrepareGrid();
        ConfigureCells();

        ActiveCell = this[0, 0]!;
        Path = [];
    }

    public (bool, bool) MoveDown()
    {
        return Move(DirectionEnum.South);
    }

    public (bool, bool) MoveRight()
    {
        return Move(DirectionEnum.East);
    }

    public (bool, bool) MoveLeft()
    {
        return Move(DirectionEnum.West);
    }

    public (bool, bool) MoveUp()
    {
        return Move(DirectionEnum.North);
    }

    /// <summary>
    /// Generates a string representation of given maze in human readable format.
    public override string ToString()
    {
        var output = new StringBuilder("+   +");

        for (var i = 1; i < Columns; i++)
        {
            output.Append("---+");
        }

        output.AppendLine();

        for (var i = 0; i < Rows; i++)
        {
            var row = Row.ElementAt(i);
            var top = "|";
            var bottom = "+";

            foreach (var cell in row.Cast<CartesianCell>())
            {
                var body = $" {ContentsOf(cell)} ";
                var east = cell.IsLinked(cell.East) ? " " : "|";

                top += body + east;

                var south = cell.IsLinked(cell.South) ? "   " : "---";

                // this is last row - we want to keep "exit" open
                if (i == Rows - 1 && cell.Column == Columns - 1)
                {
                    south = "   ";
                }

                const string corner = "+";

                bottom += south + corner;
            }

            output.AppendLine(top);
            output.AppendLine(bottom);
        }

        return output.ToString();
    }

    private void PrepareGrid()
    {
        for (var r = 0; r < Rows; r++)
        {
            var row = new List<Cell>();
            for (var c = 0; c < Columns; c++)
            {
                row.Add(new CartesianCell(r, c));
            }
            _grid.Add(row);
        }
    }

    private void ConfigureCells()
    {
        foreach (var cell in Cells.Cast<CartesianCell>())
        {
            var row = cell.Row;
            var col = cell.Column;

            cell.North = this[row - 1, col] as CartesianCell;
            cell.South = this[row + 1, col] as CartesianCell;
            cell.West = this[row, col - 1] as CartesianCell;
            cell.East = this[row, col + 1] as CartesianCell;
        }
    }

    private (bool, bool) Move(DirectionEnum direction)
    {
        var isRefreshNeeded = false;
        var isFinished = false;

        var cell = (ActiveCell as CartesianCell)!;

        Cell? cellToMoveTo = direction switch
        {
            DirectionEnum.North => cell.North,
            DirectionEnum.South => cell.South,
            DirectionEnum.West => cell.West,
            DirectionEnum.East => cell.East,
            _ => throw new ArgumentOutOfRangeException(
                nameof(direction),
                "DirectionEnum contains invalid value."
            ),
        };

        if (cellToMoveTo is not null && cell.IsLinked(cellToMoveTo))
        {
            ActiveCell = cellToMoveTo;
            isRefreshNeeded = true;
        }

        if (ActiveCell!.Row == Rows - 1 && ActiveCell.Column == Columns - 1)
        {
            isFinished = true;
        }

        return (isRefreshNeeded, isFinished);
    }

    private string ContentsOf(Cell cell)
    {
        // Manual transition
        if (cell.Row == ActiveCell!.Row && cell.Column == ActiveCell.Column)
        {
            return "[red]*[/]";
        }

        // Automatic transition
        if (Path.Any(x => x.Row == cell.Row && cell.Column == x.Column))
        {
            return "[red]*[/]";
        }

        return " ";
    }
}
