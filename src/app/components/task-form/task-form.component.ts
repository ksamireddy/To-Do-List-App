import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TASK_STATUSES, Task, TaskFormValue } from '../../models/task.model';

/**
 * A single reactive form that handles both "add" and "edit" flows.
 * When `editingTask` is null the form is in add-mode (status locked
 * to "New" and hidden). When it's set, the form is pre-filled and the
 * status field becomes available so the task can be progressed.
 */
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnChanges {
  @Input() editingTask: Task | null = null;

  @Output() save = new EventEmitter<TaskFormValue>();
  @Output() cancelEdit = new EventEmitter<void>();

  readonly statuses = TASK_STATUSES;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(80)]],
    description: ['', [Validators.maxLength(500)]],
    status: ['New' as Task['status'], [Validators.required]]
  });

  constructor(private readonly fb: FormBuilder) {}

  get isEditing(): boolean {
    return this.editingTask !== null;
  }

  get titleControl() {
    return this.form.controls.title;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('editingTask' in changes) {
      if (this.editingTask) {
        this.form.setValue({
          title: this.editingTask.title,
          description: this.editingTask.description,
          status: this.editingTask.status
        });
      } else {
        this.resetForm();
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue());
    if (!this.isEditing) {
      this.resetForm();
    }
  }

  onCancel(): void {
    this.resetForm();
    this.cancelEdit.emit();
  }

  private resetForm(): void {
    this.form.reset({ title: '', description: '', status: 'New' });
  }
}
