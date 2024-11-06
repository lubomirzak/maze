using Maze.Logic.Algorithms;
using Maze.Logic.Services;
using Spectre.Console;

using Grid = Maze.Logic.Models.Grid;

namespace Maze.ConsoleApp.Services;

public class ExecutorService
{
    public ExecutorService() { }

    public static void Execute()
    {
        AnsiConsole.Write(new Rule());
        AnsiConsole.MarkupLineInterpolated(
            $"Welcome to the [underline green]Maze App![/] {Environment.NewLine}"
        );

        RunGame();
    }

    private static void RunGame()
    {
        AnsiConsole.MarkupLineInterpolated($"Let's start with generating a new maze.");

        var maze = GenerateAndDisplayMaze();
        var solvingPath = AnsiConsole.Prompt(
            new SelectionPrompt<string>()
                .Title("How would you like to traverse the maze?")
                .AddChoices(["Automatically", "Manually"])
        );

        if (solvingPath == "Manually")
        {
            TraverseManually(maze);
        }
        else
        {
            TraverseAutomatically(maze);
        }

        var tryAgain = AnsiConsole.Prompt(
            new ConfirmationPrompt($"Would you like to [green]try again[/]?")
        );

        if (!tryAgain)
        {
            SpectreService.WriteDivider("Hope you had fun with the maze app. Have a nice day!");
        }
        else
        {
            RunGame();
        }
    }

    private static Grid GenerateAndDisplayMaze()
    {
        var dimensions = SpectreService.GetDimensions();

        SpectreService.WriteDivider("Generated Maze");

        var grid = new Grid(dimensions.Item1, dimensions.Item2);
        var maze = RecursiveBacktracker.GenerateMaze(grid);

        AnsiConsole.MarkupLine(maze.ToString());

        return maze;
    }

    private static void TraverseManually(Grid maze)
    {
        var watch = System.Diagnostics.Stopwatch.StartNew();

        watch.Start();

        AnsiConsole.Console.Clear(true);
        AnsiConsole.MarkupLine(maze.ToString());

        var solved = false;

        while (!solved)
        {
            var isRefreshNeeded = false;
            var isFinished = false;

            var keyPressed = AnsiConsole.Console.Input.ReadKey(false)!.Value.Key;
            switch (keyPressed)
            {
                case ConsoleKey.Escape:
                    return;
                case ConsoleKey.UpArrow:
                    (isRefreshNeeded, isFinished) = maze.MoveUp();
                    break;
                case ConsoleKey.DownArrow:
                    (isRefreshNeeded, isFinished) = maze.MoveDown();
                    break;
                case ConsoleKey.RightArrow:
                    (isRefreshNeeded, isFinished) = maze.MoveRight();
                    break;
                case ConsoleKey.LeftArrow:
                    (isRefreshNeeded, isFinished) = maze.MoveLeft();
                    break;
            }

            if (isRefreshNeeded)
            {
                Console.SetCursorPosition(0, 0);
                AnsiConsole.MarkupLine(maze.ToString());
            }

            solved = isFinished;
        }

        watch.Stop();

        AnsiConsole.MarkupLineInterpolated(
            $"[underline green]Congratulations![/] You solved the maze in {watch.Elapsed.Seconds}.{watch.Elapsed.Milliseconds} seconds.{Environment.NewLine}"
        );
    }

    private static void TraverseAutomatically(Grid grid)
    {
        AnsiConsole.Console.Clear(true);

        grid.Path = MazeSolverService.Solve(grid);

        AnsiConsole.MarkupLine(grid.ToString());

        AnsiConsole.MarkupLineInterpolated(
            $"Solution is marked with red asterisks.{Environment.NewLine}"
        );
    }
}
