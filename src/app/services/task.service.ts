import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskFormValue } from '../models/task.model';

const STORAGE_KEY = 'todo-app.tasks';

/**
 * Owns the task collection and persists it to localStorage.
 * Components never touch storage directly — they subscribe to
 * `tasks$` and call the mutation methods below, which keep the
 * in-memory state and localStorage in sync.
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly tasksSubject = new BehaviorSubject<Task[]>(this.readFromStorage());
  readonly tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  getSnapshot(): Task[] {
    return this.tasksSubject.value;
  }

  addTask(value: TaskFormValue): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: this.generateId(),
      title: value.title.trim(),
      description: value.description.trim(),
      status: value.status,
      createdAt: now,
      updatedAt: now
    };
    this.persist([task, ...this.tasksSubject.value]);
    return task;
  }

  updateTask(id: string, value: TaskFormValue): void {
    const updated = this.tasksSubject.value.map((task) =>
      task.id === id
        ? {
            ...task,
            title: value.title.trim(),
            description: value.description.trim(),
            status: value.status,
            updatedAt: new Date().toISOString()
          }
        : task
    );
    this.persist(updated);
  }

  updateStatus(id: string, status: Task['status']): void {
    const updated = this.tasksSubject.value.map((task) =>
      task.id === id ? { ...task, status, updatedAt: new Date().toISOString() } : task
    );
    this.persist(updated);
  }

  deleteTask(id: string): void {
    this.persist(this.tasksSubject.value.filter((task) => task.id !== id));
  }

  private persist(tasks: Task[]): void {
    this.tasksSubject.next(tasks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Storage can be unavailable (e.g. private browsing quota).
      // The in-memory state above still keeps the UI working for this session.
    }
  }

  private readFromStorage(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch {
      return [];
    }
  }

  private generateId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
