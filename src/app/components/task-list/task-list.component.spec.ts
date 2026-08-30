import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task } from '../../models/task.model';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let component: TaskListComponent;

  const makeTask = (id: string, status: Task['status']): Task => ({
    id,
    title: `Task ${id}`,
    description: '',
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TaskListComponent] });
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    component.tasks = [makeTask('1', 'New'), makeTask('2', 'Completed'), makeTask('3', 'New')];
    fixture.detectChanges();
  });

  it('should show all tasks by default', () => {
    expect(component.filteredTasks.length).toBe(3);
  });

  it('should filter tasks by the active status', () => {
    component.setFilter('New');
    expect(component.filteredTasks.length).toBe(2);
    expect(component.filteredTasks.every((t) => t.status === 'New')).toBeTrue();
  });

  it('should count tasks correctly per filter', () => {
    expect(component.countFor('All')).toBe(3);
    expect(component.countFor('New')).toBe(2);
    expect(component.countFor('Completed')).toBe(1);
    expect(component.countFor('Rejected')).toBe(0);
  });

  it('should emit delete with the correct task', () => {
    spyOn(component.delete, 'emit');
    const task = component.tasks[0];

    component.onDelete(task);

    expect(component.delete.emit).toHaveBeenCalledWith(task);
  });

  it('should emit statusChange with the task id and new status', () => {
    spyOn(component.statusChange, 'emit');
    const task = component.tasks[0];

    component.onStatusChange(task, 'Verified');

    expect(component.statusChange.emit).toHaveBeenCalledWith({ id: task.id, status: 'Verified' });
  });
});
