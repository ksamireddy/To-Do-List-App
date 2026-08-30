import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { Task, TaskFormValue, TaskStatus } from './models/task.model';
import { TaskService } from './services/task.service';

/**
 * Entry-point component. Owns no business logic itself — it subscribes
 * to TaskService for state, and forwards user actions from the form
 * and list children back into the service.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  editingTask: Task | null = null;

  private subscription?: Subscription;

  constructor(private readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.subscription = this.taskService.tasks$.subscribe((tasks) => (this.tasks = tasks));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onSave(value: TaskFormValue): void {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask.id, value);
      this.editingTask = null;
    } else {
      this.taskService.addTask(value);
    }
  }

  onEditRequested(task: Task): void {
    this.editingTask = task;
  }

  onCancelEdit(): void {
    this.editingTask = null;
  }

  onStatusChange(change: { id: string; status: TaskStatus }): void {
    this.taskService.updateStatus(change.id, change.status);
    if (this.editingTask?.id === change.id) {
      this.editingTask = { ...this.editingTask, status: change.status };
    }
  }

  onDeleteRequested(task: Task): void {
    const confirmed = window.confirm(`Delete "${task.title}"? This can't be undone.`);
    if (!confirmed) {
      return;
    }
    this.taskService.deleteTask(task.id);
    if (this.editingTask?.id === task.id) {
      this.editingTask = null;
    }
  }
}
