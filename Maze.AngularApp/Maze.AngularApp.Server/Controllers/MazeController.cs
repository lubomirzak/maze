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
        private readonly ILogger<MazeController> _logger;

        public MazeController(ILogger<MazeController> logger)
        {
            _logger = logger;
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

                result.Cells.Add(new MazeCell(cartesianCell, maze.Rows, maze.Columns));
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
    }
}
