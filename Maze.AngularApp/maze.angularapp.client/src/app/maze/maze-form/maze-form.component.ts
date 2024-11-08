import {
  Component,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MazeForm } from './maze-form';
import { Maze } from '../shared/maze';
import { TraverseMode } from '../../shared/app.traverse-mode.enum';

@Component({
  selector: 'app-maze-form',
  templateUrl: './maze-form.component.html',
  styleUrl: './maze-form.component.css',
})
export class MazeFormComponent {
  constructor(private http: HttpClient) {}

  @Input() reset: boolean = false;
  @Output() mazeLoadedEvent = new EventEmitter<Maze>();
  @Output() traverseModeChangedEvent = new EventEmitter<TraverseMode>();
  @Output() isPathVisibleChangedEvent = new EventEmitter<boolean>();

  model = new MazeForm(10, 10);
  submitted = false;
  traverseModeSelected = false;
  pathVisible = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reset']) {
      this.model = new MazeForm(10, 10);
      this.reset = false;
    }
  }

  // Modes are Manual or Automatic
  changeTraverseMode(mode: TraverseMode) {
    this.traverseModeSelected = true;
    this.traverseModeChangedEvent.emit(mode);
  }

  // Shows/hides path on the canvas
  setPathVisible(visible: boolean) {
    this.pathVisible = visible;
    this.isPathVisibleChangedEvent.emit(visible);
  }

  // Resets the form to the initial state. By firing empty maze event canvas should get hidden.
  onReset() {
    this.submitted = false;
    this.traverseModeChangedEvent.emit(TraverseMode.None);
    this.mazeLoadedEvent.emit({} as Maze);
  }

  // Fetch the data and pass it to parent which can pass it to the canvas-child
  onSubmit() {
    this.http
      .get<Maze>(
        `/maze/getmaze/${this.model.dimensionX}/${this.model.dimensionY}`
      )
      .subscribe({
        next: (result) => {
          this.traverseModeSelected = false;
          this.submitted = true;
          this.setPathVisible(false);
          this.traverseModeChangedEvent.emit(TraverseMode.None);
          this.mazeLoadedEvent.emit(result);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
