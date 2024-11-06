import {
  Component,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MazeFormModel } from './maze-form-model';
import { MazeModel } from '../maze-model';
import { TraverseMode } from '../../shared/app.traverse-mode.enum';

@Component({
  selector: 'app-maze-form',
  templateUrl: './maze-form.component.html',
  styleUrl: './maze-form.component.css',
})
export class MazeFormComponent {
  constructor(private http: HttpClient) {}

  @Input() reset: boolean = false;
  @Output() mazeLoadedEvent = new EventEmitter<MazeModel>();
  @Output() traverseModeChangedEvent = new EventEmitter<TraverseMode>();

  model = new MazeFormModel(10, 10);
  submitted = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reset']) {
      this.model = new MazeFormModel(10, 10);
      this.reset = false;
    }
  }

  changeTraverseMode(mode: TraverseMode) {
    this.traverseModeChangedEvent.emit(mode);
  }

  onSubmit() {
    // fetch the data and pass it to parent
    this.http
      .get<MazeModel>(
        `/maze/getmaze/${this.model.dimensionX}/${this.model.dimensionY}`
      )
      .subscribe({
        next: (result) => {
          this.submitted = true;
          this.traverseModeChangedEvent.emit(TraverseMode.None);
          this.mazeLoadedEvent.emit(result);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
