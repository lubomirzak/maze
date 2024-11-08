import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MazeFormComponent } from './maze-form.component';
import { FormsModule } from '@angular/forms';
import { Maze } from '../shared/maze';
import { MazeCell } from '../shared/maze-cell';
import { MazeForm } from './maze-form';
import { TraverseMode } from '../../shared/app.traverse-mode.enum';

describe('MazeFormComponent', () => {
  let component: MazeFormComponent;
  let fixture: ComponentFixture<MazeFormComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MazeFormComponent],
      imports: [HttpClientTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MazeFormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve maze model from the server on submit and emit data', () => {
    const mockMazeModel = new Maze(
      10,
      10,
      [],
      [],
      new MazeCell(0, 0, false, false, false, false, true)
    );

    spyOn(component.mazeLoadedEvent, 'emit');

    component.model = new MazeForm(10, 10);
    component.onSubmit();

    const req = httpMock.expectOne(`/maze/getmaze/10/10`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockMazeModel);

    fixture.detectChanges();

    expect(component.mazeLoadedEvent.emit).toHaveBeenCalledOnceWith(
      mockMazeModel
    );
  });

  it('should emit traverse mode on button click', () => {
    spyOn(component.traverseModeChangedEvent, 'emit');

    component.changeTraverseMode(TraverseMode.Automatic);

    fixture.detectChanges();

    expect(component.traverseModeChangedEvent.emit).toHaveBeenCalledOnceWith(
      TraverseMode.Automatic
    );
  });

  it('should emit path visibility on button click', () => {
    spyOn(component.isPathVisibleChangedEvent, 'emit');

    component.setPathVisible(true);

    fixture.detectChanges();

    expect(component.isPathVisibleChangedEvent.emit).toHaveBeenCalledOnceWith(
      true
    );
  });
});
