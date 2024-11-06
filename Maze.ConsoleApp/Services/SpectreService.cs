using Maze.Logic.Constants;
using Spectre.Console;

namespace Maze.ConsoleApp.Services;

public class SpectreService
{
    public static (int, int) GetDimensions()
    {
        var dimensionsSettled = false;

        int dimensionX = DimensionConstants.MinimalDimensionSize;
        int dimensionY = DimensionConstants.MinimalDimensionSize;

        while (!dimensionsSettled)
        {
            WriteDivider("Dimensions");

            AnsiConsole.MarkupLineInterpolated(
                $"How big the maze should be? Please specify the dimensions.{Environment.NewLine}"
            );
            AnsiConsole.MarkupLineInterpolated(
                $"[italic]Note: Dimensions should be between {DimensionConstants.MinimalDimensionSize}x{DimensionConstants.MinimalDimensionSize} and {DimensionConstants.MaximumDimensionSize}x{DimensionConstants.MaximumDimensionSize}[/] {Environment.NewLine}"
            );

            var dimensionsValidator = new Func<int, ValidationResult>(x =>
                x switch
                {
                    < DimensionConstants.MinimalDimensionSize => ValidationResult.Error(
                        $"Minimum value allowed is {DimensionConstants.MinimalDimensionSize}"
                    ),
                    > DimensionConstants.MaximumDimensionSize => ValidationResult.Error(
                        $"Maximum value allowed is {DimensionConstants.MaximumDimensionSize}"
                    ),
                    >= DimensionConstants.MinimalDimensionSize and <= DimensionConstants.MaximumDimensionSize =>
                        ValidationResult.Success(),
                }
            );

            dimensionX = AnsiConsole.Prompt(
                new TextPrompt<int>("Please specify the x dimension of the maze...")
                    .DefaultValue(DimensionConstants.DefaultDimensionsSize)
                    .Validate(dimensionsValidator)
            );

            dimensionY = AnsiConsole.Prompt(
                new TextPrompt<int>("Please specify the y dimension of the maze...")
                    .DefaultValue(DimensionConstants.DefaultDimensionsSize)
                    .Validate(dimensionsValidator)
            );

            dimensionsSettled = AnsiConsole.Prompt(
                new ConfirmationPrompt(
                    $"So dimensions of the maze should be [green]{dimensionX}x{dimensionY}[/]. Is that correct?"
                )
            );

            if (!dimensionsSettled)
            {
                AnsiConsole.WriteLine("Let's try again then!");
            }
        }

        AnsiConsole.WriteLine("Great! Let's generate the maze.");

        return (dimensionX, dimensionY);
    }

    public static void WriteDivider(string text)
    {
        AnsiConsole.WriteLine();
        AnsiConsole.Write(new Rule($"[yellow]{text}[/]").RuleStyle("grey").LeftJustified());
        AnsiConsole.WriteLine();
    }
}
