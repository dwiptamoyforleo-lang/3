import React from 'react';
import { Task, Note, FocusSession, ActiveTab } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Flame, 
  ArrowRight, 
  Plus, 
  Play, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface OverviewProps {
  tasks: Task[];
  notes: Note[];
  focusSessions: FocusSession[];
  setActiveTab: (tab: ActiveTab) => void;
  onQuickToggleTask: (taskId: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  tasks,
  notes,
  focusSessions,
  setActiveTab,
  onQuickToggleTask,
}) => {
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === 'high');
  
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const completionPercentage = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            3-Pillar Workspace Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to Project 3
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Execute high-impact goals through three harmonized disciplines: 
            <strong className="text-indigo-300"> ruthless task prioritization</strong>, 
            <strong className="text-purple-300"> friction-free knowledge capture</strong>, and 
            <strong className="text-pink-300"> dedicated deep focus cycles</strong>.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('tasks')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" /> Manage Tasks
            </button>
            <button
              onClick={() => setActiveTab('focus')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition border border-slate-700"
            >
              <Play className="w-4 h-4 text-emerald-400" /> Start Focus Timer
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Pending Tasks</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{pendingTasks.length}</span>
            <span className="text-xs text-slate-400">of {tasks.length} total</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">High Priority</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{highPriorityTasks.length}</span>
            <span className="text-xs text-rose-400 font-medium">requires action</span>
          </div>
          <p className="mt-3 text-xs text-slate-400">Priority items needing focus today</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Knowledge Notes</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{notes.length}</span>
            <span className="text-xs text-purple-400 font-medium">
              {notes.filter((n) => n.isPinned).length} pinned
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">Organized documentation & insights</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Focus Time Logged</span>
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalFocusMinutes}m</span>
            <span className="text-xs text-pink-400 font-medium">
              {focusSessions.length} sessions
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">Logged distraction-free intervals</p>
        </div>
      </div>

      {/* 2-Column Split: Active Tasks & Recent Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Priority Tasks */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Action Items</h2>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {tasks.slice(0, 4).length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">No tasks available.</p>
          ) : (
            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                    task.status === 'completed'
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => onQuickToggleTask(task.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-700 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          task.status === 'completed'
                            ? 'line-through text-slate-500'
                            : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          {task.category}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {task.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${
                      task.priority === 'high'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : task.priority === 'medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Recent Notes & Knowledge */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Recent Knowledge Notes</h2>
            </div>
            <button
              onClick={() => setActiveTab('notes')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              View notes <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {notes.slice(0, 3).map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveTab('notes')}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition truncate">
                    {note.title}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {note.category}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {note.content}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
