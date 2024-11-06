using Maze.ConsoleApp.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

internal class Program
{
    private static void Main()
    {
        using var loggerFactory = LoggerFactory.Create(builder =>
        {
            builder
                .AddFilter("Microsoft", LogLevel.Warning)
                .AddFilter("System", LogLevel.Warning)
                .AddFilter("LoggingConsoleApp.Program", LogLevel.Debug)
                .AddConsole();
        });

        ILogger logger = loggerFactory.CreateLogger<Program>();

        var services = new ServiceCollection();
        services.AddSingleton<SpectreService, SpectreService>().AddSingleton<ExecutorService, ExecutorService>();

        var serviceProvider = services.BuildServiceProvider();

        var executor = serviceProvider.GetService<ExecutorService>();

        if (executor is null)
        {
            logger.LogError("Could not initialize executor. Please restart the app and try again.");
            return;
        }

        ExecutorService.Execute();
    }
}
