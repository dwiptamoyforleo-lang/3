export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  category: string;
  dueDate?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  tags: string[];
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  completedAt: string;
  tag: string;
}

export type ActiveTab = 'overview' | 'tasks' | 'notes' | 'focus';
