using Maze.AngularApp.Server.Models;
using Maze.Logic.Algorithms;
using Maze.Logic.Models;
using Maze.Logic.Services;
using Microsoft.AspNetCore.Mvc;

namespace Maze.AngularApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MazeController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<MazeController> _logger;

        public MazeController(ILogger<MazeController> logger)
        {
            _logger = logger;
        }

        [HttpGet("getWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpGet("getMaze/{dimensionX}/{dimensionY}")]
        public IActionResult GetMaze(int dimensionX, int dimensionY)
        {
            var grid = new Grid(dimensionX, dimensionY);
            var maze = RecursiveBacktracker.GenerateMaze(grid);
            maze.Path = MazeSolverService.Solve(maze);


            var result = new Models.Maze(maze.Rows, maze.Columns);

            foreach (var cell in maze.Cells)
            {
                if (cell is not CartesianCell cartesianCell)
                {
                    throw new InvalidOperationException("Non cartesian cell found in cell array.");
                }

                var mazeCell = GetMazeCell(cartesianCell, maze.Rows, maze.Columns);

                result.Cells.Add(mazeCell);
            }

            // we do not need to calculate borders here
            foreach (var cell in maze.Path)
            {
                if (cell is not CartesianCell cartesianCell)
                {
                    throw new InvalidOperationException("Non cartesian cell found in cell array.");
                }

                result.Path.Add(new MazeCell(cell.Column, cell.Row));
            }

            return Ok(result);
        }

        private static MazeCell GetMazeCell(CartesianCell cell, int rows, int columns)
        {
            var mazeCell = new MazeCell(cell.Column, cell.Row);

            // start
            if (cell.Row == 0 && cell.Column == 0)
            {
                mazeCell.BorderTop = false;
            }

            // end
            if (cell.Row == rows - 1 && cell.Column == columns - 1)
            {
                mazeCell.BorderBottom = false;
            }

            if (cell.West is not null && cell.IsLinked(cell.West))
            {
                mazeCell.BorderLeft = false;
            }

            if (cell.East is not null && cell.IsLinked(cell.East))
            {
                mazeCell.BorderRight = false;
            }

            if (cell.North is not null && cell.IsLinked(cell.North))
            {
                mazeCell.BorderTop = false;
            }

            if (cell.South is not null && cell.IsLinked(cell.South))
            {
                mazeCell.BorderBottom = false;
            }

            return mazeCell;
        }
    }
}
