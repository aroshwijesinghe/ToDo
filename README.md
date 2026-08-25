# Priority ToDo Application

A high-performance, dark-themed Priority-Driven To-Do List and Matrix Manager web application built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**.

Modeled directly after modern developer productivity dashboards and the terminal task ranking matrix (`RANK | TASK | PRI | TIME | DESCRIPTION`).

---

## ✨ Features

- **Exact Priority Matrix Layout**: Displays tasks structured with:
  - `RANK`: Numeric priority position / ordering.
  - `TASK`: Task/Goal title with quick completion toggle.
  - `PRI`: Dynamic priority score (0–100) with color-coded heat badges & progress bars.
  - `TIME`: Time estimation (e.g., `6-8h`, `3-4h`, `30-60m`).
  - `DESCRIPTION`: Clear summary of the objective.
  - `STATUS`: `todo`, `in-progress`, `completed`.
- **Preloaded with 35 Real-World Tasks**: Pre-seeded with the exact AI, ML, DevOps, and engineering tasks from the project specifications.
- **Terminal & Table Dual Views**: Toggle between interactive graphical table and pure ASCII stdout terminal mode.
- **Productivity Dashboard**: Real-time stats calculating total backlog effort in hours, active tasks, critical priority count, and progress rate.
- **Interactive Controls**:
  - Add, edit, delete, and reorder tasks (move up/down).
  - Search across task names, categories, and descriptions.
  - Filter by priority tier (Critical, High, Medium, Low) and category.
  - Multi-column sorting (Rank, Priority Score, Task Name, Time).
  - Confetti celebration animation upon completing tasks.
- **Data Persistence & Portability**:
  - Automatic `localStorage` persistence across sessions.
  - JSON & CSV Export / Import.
  - One-click reset to default sample dataset.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📋 Data Schema

```typescript
interface TodoTask {
  id: string;
  rank: number;
  task: string;
  pri: number; // 0 - 100
  time: string; // e.g. "6-8h", "30-60m"
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  category?: string;
  createdAt: string;
  completedAt?: string;
}
```
