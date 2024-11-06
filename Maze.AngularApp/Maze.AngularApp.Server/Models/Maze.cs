namespace Maze.AngularApp.Server.Models
{
    public class Maze(int rows, int columns)
    {
        public int Rows { get; set; } = rows; public int Columns { get; set; } = columns;

        // To avoid using double dimensional arrays let's push them to simple list
        public List<MazeCell> Cells { get; set; } = [];

        // List of cells with solution to the maze
        public List<MazeCell> Path { get; set; } = [];
    }
}
