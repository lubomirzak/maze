using Maze.Logic.Extensions;
using Maze.Logic.Models;

namespace Maze.Logic.Algorithms;

public class RecursiveBacktracker
{
    public Cell CurrentCell { get; private set; }
    private readonly Grid _grid;
    private readonly Random _rand;
    private Stack<Cell> _stack;

    public RecursiveBacktracker(Grid grid)
    {
        _grid = grid;
        _rand = new Random();
        CurrentCell = _grid.RandomCell(_rand);

        _stack = new Stack<Cell>();
        _stack.Push(CurrentCell);
    }

    public static Grid GenerateMaze(Grid grid)
    {
        var rand = new Random();
        var startAt = grid.RandomCell(rand);

        var stack = new Stack<Cell>();
        stack.Push(startAt);

        while (stack.Any())
        {
            var current = stack.Peek();
            var neighbors = current.Neighbors.Where(n => n is not null && !n.Links.Any()).ToList();
            if (neighbors.Any())
            {
                var neighbor = neighbors.Sample(rand);
                current.Link(neighbor!);
                stack.Push(neighbor!);
            }
            else
            {
                stack.Pop();
            }
        }

        return grid;
    }

    public bool Step()
    {
        if (!_stack.Any())
        {
            return false;
        }
        CurrentCell = _stack.Peek();
        var neighbors = CurrentCell.Neighbors.Where(n => n is not null && !n.Links.Any()).ToList();
        if (neighbors.Any())
        {
            var neighbor = neighbors.Sample(_rand);
            CurrentCell.Link(neighbor!);
            _stack.Push(neighbor!);
        }
        else
        {
            _stack.Pop();
        }

        return true;
    }
}
