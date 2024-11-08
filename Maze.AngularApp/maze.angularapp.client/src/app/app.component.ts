import { Component } from '@angular/core';
import { Maze } from './maze/shared/maze';
import { TraverseMode } from './shared/app.traverse-mode.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  maze: Maze = {} as Maze;
  traverseMode: TraverseMode = TraverseMode.None;
  isPathVisible: boolean = false;

  mazeLoaded(loadedMaze: Maze) {
    this.maze = loadedMaze;
  }

  traverseModeChanged(mode: TraverseMode) {
    this.traverseMode = mode;
  }

  isPathVisibleChanged(visible: boolean) {
    this.isPathVisible = visible;
  }
}
