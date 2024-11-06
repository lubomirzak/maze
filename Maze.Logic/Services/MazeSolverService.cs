using Maze.Logic.Models;

namespace Maze.Logic.Services;

public class MazeSolverService
{
    /// <summary>
    /// Generates a list of Cells that lead from start to finish for given maze.
    /// </summary>
    public static List<Cell> Solve(Grid grid)
    {
        var startNode = grid[0, 0]!;

        var path = new List<Cell> { startNode };

        startNode.InPath = true;

        var endNode = grid[grid.Columns - 1, grid.Rows - 1]!;

        // Solve recursively.
        Solve(endNode, path);

        // Clear the InPath values.
        foreach (Cell cell in path)
        {
            cell.InPath = false;
        }

        return path;
    }

    private static bool Solve(Cell endCell, List<Cell> path)
    {
        // See if we have reached the end node.
        Cell lastCell = path[^1];
        if (lastCell.Row == endCell.Row && lastCell.Column == endCell.Column)
            return true;

        // Try each of the last node's children in turn.
        foreach (Cell? neighbor in lastCell.Neighbors)
        {
            if (neighbor is null)
            {
                continue;
            }

            if (!lastCell.IsLinked(neighbor))
            {
                continue;
            }

            if (!neighbor.InPath)
            {
                path.Add(neighbor);
                neighbor.InPath = true;

                if (Solve(endCell, path))
                {
                    return true;
                }

                neighbor.InPath = false;
                path.RemoveAt(path.Count - 1);
            }
        }

        return false;
    }
}
