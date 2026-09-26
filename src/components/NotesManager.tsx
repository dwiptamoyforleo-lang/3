import React, { useState } from 'react';
import { Note } from '../types';
import { 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Copy, 
  Check, 
  Tag as TagIcon, 
  X,
  FileText
} from 'lucide-react';

interface NotesManagerProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onTogglePin: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotesManager: React.FC<NotesManagerProps> = ({
  notes,
  onAddNote,
  onTogglePin,
  onDeleteNote,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Ideas');
  const [tagsInput, setTagsInput] = useState('');

  const categories = ['all', ...Array.from(new Set(notes.map((n) => n.category)))];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    onAddNote({
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || 'General',
      isPinned: false,
      tags: parsedTags.length > 0 ? parsedTags : ['general'],
    });

    setTitle('');
    setContent('');
    setCategory('Ideas');
    setTagsInput('');
    setIsModalOpen(false);
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ? true : n.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort pinned first
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-6 py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Pillar 2: Knowledge Notes
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Capture thoughts, design notes, and key documentation instantly.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition shadow-lg shadow-purple-600/25 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Note
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
            placeholder="Search notes by title, tag, or content..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No notes found</p>
            <p className="text-xs text-slate-500 mt-1">Write your thoughts or adjust search</p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 ${
                note.isPinned
                  ? 'bg-slate-900/90 border-purple-500/30 ring-1 ring-purple-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTogglePin(note.id)}
                      className={`p-1 rounded transition cursor-pointer ${
                        note.isPinned
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={note.isPinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleCopy(note.id, `${note.title}\n\n${note.content}`)}
                      className="p-1 rounded text-slate-500 hover:text-slate-300 transition cursor-pointer"
                      title="Copy note"
                    >
                      {copiedId === note.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-base text-white mb-2 line-clamp-1">
                  {note.title}
                </h3>

                <p className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed line-clamp-6">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1 flex-wrap">
                  {note.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-0.5 text-[11px] text-slate-400 hover:text-purple-300"
                    >
                      <TagIcon className="w-2.5 h-2.5" /> {t}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-slate-500">
                  {new Date(note.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Create Knowledge Note</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. System Architecture Decisions"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Architecture, Research, Notes"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Content *
                </label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write documentation, thoughts, snippets, or action logs..."
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500 resize-none font-mono text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="api, frontend, guidelines"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500"
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
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition shadow-md shadow-purple-600/30"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
