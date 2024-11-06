# Build project
dotnet build

# Run server in new window
Start-Process dotnet run -WorkingDirectory .\Maze.AngularApp\Maze.AngularApp.Server\ 
# -Argumentlist "--project .\Maze.AngularApp.Server.csproj  --launch-profile https"
