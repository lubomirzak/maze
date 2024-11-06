# Maze app

This simple project was created to solve of generating and traversing generated maze in C#/Angular.

Initially I had Console app done with Spectre console inputs. Afterwards I decided that this is a nice opportunity to learn a bit of Angular, so I added Angular frontend project solving the same issue while extracting common models and services to its own Maze.Logic project.

## Console App

Maze.ConsoleApp is simple console app that uses parts of Maze.Logic to generate maze via SpectreConsole prompts.

Additionally it allows user to either traverse the maze or show solution to the maze automatically.

To run it either build the project and run the exe by hand or run RunConsoleApp.ps1 powershell script that does that for you.

## Angular app

Angular app consists of two projects - maze.angularapp.client and Maze.AngularApp.Server.

Client displays very simple UI with two inputs to enter dimensions of the maze. Once submitted to the server, maze is returned and can be solved either manually via clicking on Traverse manually button and navigating Mario via standard Left/Right/Up/Down arrow keys on the keyboard or automatically via clicking on the Show path button.

To run it either run it from Visual Studio as multiple projects startup/run the server part or run RunAngularApp.ps1 powershell script.

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
