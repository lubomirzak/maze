# Maze app

This simple project was created to solve of generating and traversing generated maze in .NET/Angular.

Initially I created a simple Console app done via Spectre Console. Afterwards I decided that this is a nice opportunity to pick up Angular, so I added Angular frontend project solving the same issue while extracting common models and services to its own Maze.Logic project.

## Console App

Maze.ConsoleApp is simple console app that uses parts of Maze.Logic to generate maze via SpectreConsole prompts.

Additionally it allows user to either traverse the maze or show correct traverse path to the maze automatically.

To run it either build the project and run the exe by hand or run `RunConsoleApp.ps1` powershell script that does that for you.

## Angular app

Angular app consists of two projects - maze.angularapp.client and Maze.AngularApp.Server.

Client displays very simple UI with two inputs to enter dimensions of the maze. Once response from the server is received after submit, maze is displayed.

It can be solved
-  Manually via clicking on the "Traverse manually" button and navigating Mario via standard Left/Right/Up/Down arrow keys on the keyboard
-  Automatically via clicking on the "Traverse automatically" button. Once clicked, Mario starts moving along the correct path until he reaches the end and maze is considered solved. To stop him, "Reset" button can be used.

The "Show path" and "Hide path" buttons will show/hide the path to solve given maze.

The "Reset" will hide the maze and return user to the initial state.

To run it either run it from Visual Studio as multiple projects startup/run the server part or run `RunAngularApp.ps1` powershell script. Default port for the client is `https://localhost:4200/`.

(Below there are parts of the original Readme generated from the CLI)

### MazeAngularappClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.11.

#### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

#### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

#### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

#### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
