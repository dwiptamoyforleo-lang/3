import React from 'react';
import { ActiveTab } from '../types';
import { LayoutDashboard, CheckSquare, FileText, Timer, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingTasksCount: number;
  notesCount: number;
  todayFocusMinutes: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  notesCount,
  todayFocusMinutes,
}) => {
  const tabs = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks' as ActiveTab, label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'notes' as ActiveTab, label: 'Notes', icon: FileText, badge: notesCount },
    { id: 'focus' as ActiveTab, label: 'Focus Timer', icon: Timer, badge: `${todayFocusMinutes}m` },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <span className="text-white font-black text-xl tracking-tight">3</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-wide">PROJECT 3</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3" /> Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Tasks • Knowledge • Focus</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-indigo-950/70 text-indigo-200'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
