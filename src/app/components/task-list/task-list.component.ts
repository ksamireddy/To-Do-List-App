import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TASK_STATUSES, Task, TaskStatus } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

type StatusFilter = TaskStatus | 'All';

/**
 * Displays the task collection with a lightweight status filter.
 * Filtering happens here (list concern); each row's own display and
 * actions are delegated to TaskItemComponent (item concern).
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];

  @Output() statusChange = new EventEmitter<{ id: string; status: TaskStatus }>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();

  readonly filters: StatusFilter[] = ['All', ...TASK_STATUSES];
  activeFilter: StatusFilter = 'All';

  get filteredTasks(): Task[] {
    return this.activeFilter === 'All'
      ? this.tasks
      : this.tasks.filter((task) => task.status === this.activeFilter);
  }

  setFilter(filter: StatusFilter): void {
    this.activeFilter = filter;
  }

  countFor(filter: StatusFilter): number {
    return filter === 'All' ? this.tasks.length : this.tasks.filter((t) => t.status === filter).length;
  }

  trackByTaskId(_index: number, task: Task): string {
    return task.id;
  }

  onStatusChange(task: Task, status: TaskStatus): void {
    this.statusChange.emit({ id: task.id, status });
  }

  onEdit(task: Task): void {
    this.edit.emit(task);
  }

  onDelete(task: Task): void {
    this.delete.emit(task);
  }
}
