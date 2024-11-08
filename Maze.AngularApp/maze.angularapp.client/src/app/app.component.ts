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
  isPathVisible: boolean = false;

  mazeLoaded(loadedMaze: MazeModel) {
    this.maze = loadedMaze;
  }

  traverseModeChanged(mode: TraverseMode) {
    this.traverseMode = mode;
  }

  isPathVisibleChanged(visible: boolean){
    this.isPathVisible = visible;
  }
}
