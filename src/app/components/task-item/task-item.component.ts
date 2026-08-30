import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TASK_STATUSES, Task, TaskStatus } from '../../models/task.model';

/**
 * Renders a single task. Purely presentational: it receives a task
 * via @Input and reports user intent (status change, edit, delete)
 * via @Output — it never talks to TaskService directly, so it can be
 * reused anywhere a Task needs to be displayed.
 */
@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;

  @Output() statusChange = new EventEmitter<TaskStatus>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();

  readonly statuses = TASK_STATUSES;

  onStatusSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as TaskStatus;
    if (value !== this.task.status) {
      this.statusChange.emit(value);
    }
  }

  onEditClick(): void {
    this.edit.emit(this.task);
  }

  onDeleteClick(): void {
    this.delete.emit(this.task);
  }

  /** Maps a status to a CSS class suffix used for its color chip. */
  statusClass(status: TaskStatus): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }
}
