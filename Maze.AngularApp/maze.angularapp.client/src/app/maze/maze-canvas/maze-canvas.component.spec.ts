import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeCanvasComponent } from './maze-canvas.component';
import { Component, ViewChild } from '@angular/core';
import { TraverseMode } from '../../shared/app.traverse-mode.enum';
import { MazeModel } from '../maze-model';
import { MazeCellModel } from '../maze-cell-model';

const mockMazeModel = new MazeModel(
  10,
  10,
  [],
  [],
  false,
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

    spyOn(component.mazeCanvasComponent, 'drawCanvas');

    fixture.detectChanges();

    expect(component.mazeCanvasComponent.drawCanvas).toHaveBeenCalledTimes(1);
  });

  it('should draw Mario if traverse mode is manual', () => {
    component.maze = mockMazeModel;
    spyOn(component.mazeCanvasComponent, 'drawCanvas');
    spyOn(component.mazeCanvasComponent, 'drawMario');
    spyOn(component.mazeCanvasComponent, 'drawCorrectPath');

    component.traverseMode = TraverseMode.Manual;

    fixture.detectChanges();

    expect(component.mazeCanvasComponent.drawCanvas).toHaveBeenCalledTimes(2); // once from maze, once from mario
    expect(component.mazeCanvasComponent.drawMario).toHaveBeenCalledTimes(1);
    expect(component.mazeCanvasComponent.drawCorrectPath).toHaveBeenCalledTimes(
      0
    );
  });

  it('should draw path if traverse mode is automatic', () => {
    component.maze = mockMazeModel;
    spyOn(component.mazeCanvasComponent, 'drawCanvas');
    spyOn(component.mazeCanvasComponent, 'drawMario');
    spyOn(component.mazeCanvasComponent, 'drawCorrectPath');

    component.traverseMode = TraverseMode.Automatic;

    fixture.detectChanges();

    expect(component.mazeCanvasComponent.drawCanvas).toHaveBeenCalledTimes(2); // once from maze, once from mario
    expect(component.mazeCanvasComponent.drawMario).toHaveBeenCalledTimes(0);
    expect(component.mazeCanvasComponent.drawCorrectPath).toHaveBeenCalledTimes(
      1
    );
  });
});

@Component({
  template:
    '<app-maze-canvas [traverseMode]="traverseMode" [maze]="maze"></app-maze-canvas>',
})
class TestMazeCanvasComponent {
  @ViewChild(MazeCanvasComponent)
  mazeCanvasComponent: MazeCanvasComponent = {} as MazeCanvasComponent;
  traverseMode: TraverseMode = TraverseMode.None;
  maze: MazeModel = {} as MazeModel;
}
