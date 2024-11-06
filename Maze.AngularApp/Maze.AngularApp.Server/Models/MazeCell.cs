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
    }
}
