import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeCanvasComponent } from './maze-canvas.component';
import { Component, ViewChild } from '@angular/core';
import { TraverseMode } from '../../shared/app.traverse-mode.enum';
import { MazeModel } from '../maze-model';
import { MazeCellModel } from '../maze-cell-model';

const mockMazeModel = new MazeModel(
  10,
  10,
  [new MazeCellModel(0, 0, false, false, false, false, true)],
  [new MazeCellModel(0, 0, false, false, false, false, true)],
  new MazeCellModel(0, 0, false, false, false, false, true)
);

describe('MazeCanvasComponent', () => {
  let component: TestMazeCanvasComponent;
  let fixture: ComponentFixture<TestMazeCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MazeCanvasComponent, TestMazeCanvasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestMazeCanvasComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redraw canvas once maze is provided', () => {
    component.maze = mockMazeModel;
    spyOn(component.mazeCanvasComponent, 'redraw');
    fixture.detectChanges();
    expect(component.mazeCanvasComponent.redraw).toHaveBeenCalledTimes(1);
  });

  it('should redraw canvas once traverse mode is changed to manual', () => {
    component.maze = mockMazeModel;
    fixture.detectChanges();

    spyOn(component.mazeCanvasComponent, 'redraw');
    spyOn(component.mazeCanvasComponent, 'drawCorrectPath');

    component.traverseMode = TraverseMode.Manual;
    fixture.detectChanges();

    expect(component.mazeCanvasComponent.redraw).toHaveBeenCalledTimes(1);
    expect(component.mazeCanvasComponent.drawCorrectPath).toHaveBeenCalledTimes(0);
  });

  it('should trigger automatic mode if traverse mode is changed to automatic', () => {
    component.maze = mockMazeModel;
    fixture.detectChanges();

    spyOn(component.mazeCanvasComponent, 'traverseAutomatically');

    component.traverseMode = TraverseMode.Automatic;
    fixture.detectChanges();

    expect(component.mazeCanvasComponent.traverseAutomatically).toHaveBeenCalledTimes(1);
  });

  it('should draw path if Show path button was clicked', () => {
    component.maze = mockMazeModel;
    fixture.detectChanges();

    spyOn(component.mazeCanvasComponent, 'drawCorrectPath');
    component.isPathVisible = true;

    fixture.detectChanges();

    expect(component.mazeCanvasComponent.drawCorrectPath).toHaveBeenCalledTimes(
      1
    );
  });
});

@Component({
  template:
    '<app-maze-canvas [traverseMode]="traverseMode" [maze]="maze" [isPathVisible]="isPathVisible"></app-maze-canvas>',
})
class TestMazeCanvasComponent {
  @ViewChild(MazeCanvasComponent)
  mazeCanvasComponent: MazeCanvasComponent = {} as MazeCanvasComponent;
  traverseMode: TraverseMode = TraverseMode.None;
  maze: MazeModel = {} as MazeModel;
  isPathVisible: boolean = false;
}
