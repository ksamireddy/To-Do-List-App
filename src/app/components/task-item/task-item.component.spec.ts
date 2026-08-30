import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task } from '../../models/task.model';
import { TaskItemComponent } from './task-item.component';

describe('TaskItemComponent', () => {
  let fixture: ComponentFixture<TaskItemComponent>;
  let component: TaskItemComponent;

  const sampleTask: Task = {
    id: '1',
    title: 'Sample task',
    description: 'Sample description',
    status: 'New',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TaskItemComponent] });
    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    component.task = sampleTask;
    fixture.detectChanges();
  });

  it('should render the task title and description', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Sample task');
    expect(el.textContent).toContain('Sample description');
  });

  it('should emit edit with the task when the edit button is clicked', () => {
    spyOn(component.edit, 'emit');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-ghost:not(.btn-danger)');

    button.click();

    expect(component.edit.emit).toHaveBeenCalledWith(sampleTask);
  });

  it('should emit delete with the task when the delete button is clicked', () => {
    spyOn(component.delete, 'emit');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-danger');

    button.click();

    expect(component.delete.emit).toHaveBeenCalledWith(sampleTask);
  });

  it('should emit statusChange when a new status is selected', () => {
    spyOn(component.statusChange, 'emit');
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select.status-select');

    select.value = 'Completed';
    select.dispatchEvent(new Event('change'));

    expect(component.statusChange.emit).toHaveBeenCalledWith('Completed');
  });

  it('should not emit statusChange when the same status is reselected', () => {
    spyOn(component.statusChange, 'emit');
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select.status-select');

    select.value = 'New';
    select.dispatchEvent(new Event('change'));

    expect(component.statusChange.emit).not.toHaveBeenCalled();
  });
});
