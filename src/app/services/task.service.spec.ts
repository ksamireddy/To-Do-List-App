import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should start with no tasks when storage is empty', () => {
    expect(service.getSnapshot().length).toBe(0);
  });

  it('should add a task with status "New" by default fields supplied', () => {
    const task = service.addTask({ title: 'Write tests', description: 'For the task service', status: 'New' });

    expect(task.title).toBe('Write tests');
    expect(task.status).toBe('New');
    expect(service.getSnapshot().length).toBe(1);
  });

  it('should trim whitespace from title and description', () => {
    const task = service.addTask({ title: '  Padded title  ', description: '  padded  ', status: 'New' });

    expect(task.title).toBe('Padded title');
    expect(task.description).toBe('padded');
  });

  it('should update an existing task', () => {
    const task = service.addTask({ title: 'Original', description: '', status: 'New' });

    service.updateTask(task.id, { title: 'Updated', description: 'New details', status: 'In Progress' });

    const updated = service.getSnapshot().find((t) => t.id === task.id);
    expect(updated?.title).toBe('Updated');
    expect(updated?.status).toBe('In Progress');
  });

  it('should update only the status via updateStatus', () => {
    const task = service.addTask({ title: 'Task', description: '', status: 'New' });

    service.updateStatus(task.id, 'Completed');

    const updated = service.getSnapshot().find((t) => t.id === task.id);
    expect(updated?.status).toBe('Completed');
    expect(updated?.title).toBe('Task');
  });

  it('should delete a task', () => {
    const task = service.addTask({ title: 'Temporary', description: '', status: 'New' });
    expect(service.getSnapshot().length).toBe(1);

    service.deleteTask(task.id);

    expect(service.getSnapshot().length).toBe(0);
  });

  it('should persist tasks to localStorage', () => {
    service.addTask({ title: 'Persisted', description: '', status: 'New' });

    const raw = localStorage.getItem('todo-app.tasks');
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw as string).length).toBe(1);
  });

  it('should emit updated state through tasks$', (done) => {
    service.tasks$.subscribe((tasks) => {
      if (tasks.length === 1) {
        expect(tasks[0].title).toBe('Observed');
        done();
      }
    });

    service.addTask({ title: 'Observed', description: '', status: 'New' });
  });
});
