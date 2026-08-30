import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let fixture: ComponentFixture<TaskFormComponent>;
  let component: TaskFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TaskFormComponent] });
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should start in add-mode with an invalid (empty) form', () => {
    expect(component.isEditing).toBeFalse();
    expect(component.form.invalid).toBeTrue();
  });

  it('should not emit save when the title is blank', () => {
    spyOn(component.save, 'emit');

    component.onSubmit();

    expect(component.save.emit).not.toHaveBeenCalled();
  });

  it('should emit save with the form value when valid', () => {
    spyOn(component.save, 'emit');
    component.form.setValue({ title: 'New task', description: 'Details', status: 'New' });

    component.onSubmit();

    expect(component.save.emit).toHaveBeenCalledWith({ title: 'New task', description: 'Details', status: 'New' });
  });

  it('should reset the form after a successful add', () => {
    component.form.setValue({ title: 'New task', description: 'Details', status: 'New' });

    component.onSubmit();

    expect(component.form.value.title).toBeFalsy();
  });

  it('should populate the form when editingTask is set', () => {
    const task: Task = {
      id: '1',
      title: 'Existing task',
      description: 'Existing description',
      status: 'In Progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    component.editingTask = task;
    component.ngOnChanges({
      editingTask: {
        currentValue: task,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.form.value.title).toBe('Existing task');
    expect(component.form.value.status).toBe('In Progress');
    expect(component.isEditing).toBeTrue();
  });

  it('should emit cancelEdit and reset the form on cancel', () => {
    spyOn(component.cancelEdit, 'emit');
    component.form.patchValue({ title: 'Something' });

    component.onCancel();

    expect(component.cancelEdit.emit).toHaveBeenCalled();
    expect(component.form.value.title).toBeFalsy();
  });
});
