using Maze.Logic.Models;

namespace Maze.AngularApp.Server.Models
{
    public class MazeCell(int x, int y)
    {
        public int X { get; set; } = x;
        public int Y { get; set; } = y;

        public bool BorderTop { get; set; } = true;

        public bool BorderLeft { get; set; } = true;

        public bool BorderRight { get; set; } = true;

        public bool BorderBottom { get; set; } = true;

        public MazeCell(CartesianCell cell, int rows, int columns)
            : this(cell.Column, cell.Row)
        {
            // start
            if (cell.Row == 0 && cell.Column == 0)
            {
                BorderTop = false;
            }

            // end
            if (cell.Row == rows - 1 && cell.Column == columns - 1)
            {
                BorderBottom = false;
            }

            if (cell.West is not null && cell.IsLinked(cell.West))
            {
                BorderLeft = false;
            }

            if (cell.East is not null && cell.IsLinked(cell.East))
            {
                BorderRight = false;
            }

            if (cell.North is not null && cell.IsLinked(cell.North))
            {
                BorderTop = false;
            }

            if (cell.South is not null && cell.IsLinked(cell.South))
            {
                BorderBottom = false;
            }
        }
    }
}
