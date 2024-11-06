namespace Maze.Logic.Extensions;

public static class ListExtensions
{
    public static T Sample<T>(this List<T> list, Random? rand = null)
    {
        rand ??= new Random();

        return list[rand.Next(list.Count)];
    }
}
