import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MazeFormComponent } from './maze-form/maze-form.component';
import { MazeCanvasComponent } from './maze-canvas/maze-canvas.component';

@NgModule({
  declarations: [MazeFormComponent, MazeCanvasComponent],
  imports: [CommonModule, FormsModule],
  exports: [MazeFormComponent, MazeCanvasComponent],
})
export class MazeModule {}
