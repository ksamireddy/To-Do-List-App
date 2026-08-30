# To-Do List — Angular Coding Exercise

A small, ToDo List Application built in Angular to demonstrate clean component
architecture: reusable components communicating through `@Input`/`@Output`,
reactive forms, and a single service that owns state and persistence. No
backend — tasks are stored in the browser via `localStorage`, so your list
survives a refresh but stays entirely client-side.

**[Live features →](#features)** · **[Architecture →](#architecture)** · **[Getting started →](#getting-started)**

---

## Features

- **View tasks** — a filterable list (`All`, `New`, `In Progress`,
  `Rejected`, `Verified`, `Completed`) with a live count per status.
- **Add a task** — title (required, validated) and an optional description.
- **Edit a task** — reuses the same form; pre-fills the fields and exposes a
  status dropdown so you can move a task through its lifecycle.
- **Change status inline** — every task card also has its own status
  selector, so you don't need to open the edit form just to progress a task.
- **Delete a task** — with a confirmation prompt.
- **Persistence** — everything is written to `localStorage`, no server
  required.

## Architecture

```
src/app/
├── app.component.ts/html/css        Root shell: wires the form + list together
├── models/
│   └── task.model.ts                Task interface, TaskStatus, TASK_STATUSES
├── services/
│   └── task.service.ts              Single source of truth: CRUD + localStorage
└── components/
    ├── task-form/                   Reactive form, shared by add & edit flows
    ├── task-list/                   Filtering + rendering the collection
    └── task-item/                   One reusable, presentational task card
```

## Tech stack

- [Angular](https://angular.dev) 18 (standalone components, no `NgModule`)
- TypeScript, strict mode
- RxJS for reactive state
- Reactive Forms (`@angular/forms`)
- Jasmine / Karma for unit tests
- Plain CSS with a small design-token system (no UI framework)

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`) — optional, `npx` works too

### Install & run

```bash
git clone https://github.com/<your-username>/todo-list-app.git
cd todo-list-app
npm install
npm start
```

Then open `http://localhost:4200`.

### Run unit tests

```bash
npm test
```

This runs the Jasmine/Karma suite covering `TaskService`,
`TaskFormComponent`, `TaskListComponent`, and `TaskItemComponent`.

### Production build

```bash
npm run build
```

Output is written to `dist/todo-list-app`.

## Project structure

```
todo-list-app/
├── src/
│   ├── app/
│   │   ├── app.component.{ts,html,css}
│   │   ├── app.config.ts
│   │   ├── models/task.model.ts
│   │   ├── services/task.service.ts (+ .spec.ts)
│   │   └── components/
│   │       ├── task-form/  (+ .spec.ts)
│   │       ├── task-list/  (+ .spec.ts)
│   │       └── task-item/  (+ .spec.ts)
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig*.json
```

## Possible next steps

- Swap `localStorage` for a real backend by changing only `TaskService`.
- Add due dates / priority and sort or filter by them.
- Add drag-and-drop status changes (e.g. a Kanban-style board).
- Route-based views (e.g. `/tasks/:id`) if the app grows beyond a single page.

## License

MIT — see [LICENSE](LICENSE).
