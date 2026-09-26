import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle, 
  Circle, 
  Clock, 
  Tag, 
  Calendar,
  X
} from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggleStatus: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onToggleStatus,
  onDeleteTask,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('Engineering');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      status: 'todo',
      priority,
      category: category.trim() || 'General',
      dueDate: dueDate.trim() || undefined,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('Engineering');
    setDueDate('');
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase())) ||
      t.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : t.status === statusFilter;

    const matchesPriority =
      priorityFilter === 'all' ? true : t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 py-2">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Pillar 1: Priority Tasks
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Focus on what matters most. Track, execute, and accomplish key milestones.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/25 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Task
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by name, category, or detail..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
            <p className="text-slate-400 font-medium">No tasks found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or create a new task</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all duration-200 flex items-start justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-950/30 border-slate-800/50 opacity-70'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => onToggleStatus(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-400 transition cursor-pointer"
                    title="Change status"
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : isInProgress ? (
                      <Clock className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-base font-semibold ${
                          isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h3>

                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          task.priority === 'high'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : task.priority === 'medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {task.priority}
                      </span>

                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          task.status === 'completed'
                            ? 'bg-emerald-950/60 text-emerald-300'
                            : task.status === 'in_progress'
                            ? 'bg-amber-950/60 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {task.status === 'in_progress' ? 'In Progress' : task.status}
                      </span>
                    </div>

                    {task.description && (
                      <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-slate-500" />
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          Due: {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Create New Task</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Implement authentication flow"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context or subtasks..."
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Product, Docs"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Due Date
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="e.g. Today, Friday, Oct 12"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-md shadow-indigo-600/30"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
