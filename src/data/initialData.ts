import { Task, Note, FocusSession } from '../types';

export const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'Architect system design for v1.0',
    description: 'Review architecture documentation, API schemas, and data pipelines.',
    status: 'in_progress',
    priority: 'high',
    category: 'Engineering',
    dueDate: 'Today',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 't-2',
    title: 'Write technical documentation & API specs',
    description: 'Detail endpoints, authentication parameters, and client integration steps.',
    status: 'todo',
    priority: 'medium',
    category: 'Docs',
    dueDate: 'Tomorrow',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 't-3',
    title: 'Configure automated CI/CD pipeline',
    description: 'Setup continuous integration tests, build scripts, and deployment verification.',
    status: 'completed',
    priority: 'high',
    category: 'DevOps',
    dueDate: 'Yesterday',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 't-4',
    title: 'Review user feedback & telemetry',
    description: 'Synthesize feedback surveys and usage telemetry into sprint priorities.',
    status: 'todo',
    priority: 'low',
    category: 'Product',
    dueDate: 'Next Week',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  }
];

export const initialNotes: Note[] = [
  {
    id: 'n-1',
    title: 'Three Pillars Productivity Philosophy',
    content: '1. Clear Priorities: Focus on high leverage tasks each day.\n2. Knowledge Capture: Dump thoughts immediately into structured notes.\n3. Deep Focus Intervals: Work in distraction-free 25-minute blocks.',
    category: 'Philosophy',
    isPinned: true,
    tags: ['mindset', 'productivity', 'habits'],
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'n-2',
    title: 'Project Roadmap & Key Milestones',
    content: '### Q1 Goals:\n- Modernize UI/UX design tokens\n- Introduce offline persistent storage\n- Enhance focus sound synthesis\n- 100% test coverage for core workflows',
    category: 'Roadmap',
    isPinned: false,
    tags: ['planning', 'milestones'],
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'n-3',
    title: 'Weekly Standup Briefing',
    content: 'Key accomplishments this week:\n- Zero critical bugs reported in staging\n- Fast performance metrics with sub-50ms render times\n- Polished task filters and search',
    category: 'Work',
    isPinned: false,
    tags: ['team', 'standup'],
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  }
];

export const initialFocusSessions: FocusSession[] = [
  {
    id: 's-1',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    tag: 'Deep Work'
  },
  {
    id: 's-2',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    tag: 'Engineering'
  },
  {
    id: 's-3',
    durationMinutes: 15,
    completedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    tag: 'Planning'
  }
];
