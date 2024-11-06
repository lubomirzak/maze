import { Component } from '@angular/core';
import { MazeModel } from './maze/maze-model';
import { TraverseMode } from './shared/app.traverse-mode.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  maze: MazeModel = {} as MazeModel;
  traverseMode: TraverseMode = TraverseMode.None;

  mazeLoaded(loadedMaze: MazeModel) {
    this.maze = loadedMaze;
  }

  traverseModeChanged(reset: TraverseMode) {
    this.traverseMode = reset;
    return false;
  }
}
