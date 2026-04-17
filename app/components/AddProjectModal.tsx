'use client';

import { useState } from 'react';
import { Stage, STAGES, STAGE_LABELS } from '../types';

interface Props {
  onAdd: (data: {
    clientName: string;
    projectTitle: string;
    description: string;
    estimatedValue: number | null;
    lastContactDate: string;
    nextAction: string;
    stage: Stage;
  }) => void;
  onClose: () => void;
}

export default function AddProjectModal({ onAdd, onClose }: Props) {
  const [clientName, setClientName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [lastContactDate, setLastContactDate] = useState(new Date().toISOString().slice(0, 10));
  const [nextAction, setNextAction] = useState('');
  const [stage, setStage] = useState<Stage>('prospects');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !projectTitle.trim()) return;
    onAdd({
      clientName: clientName.trim(),
      projectTitle: projectTitle.trim(),
      description: description.trim(),
      estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
      lastContactDate,
      nextAction: nextAction.trim(),
      stage,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-6">New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Client Name *</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. Acme Corp"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Project Title *</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. UX Strategy Review"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              rows={2}
              placeholder="Brief description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Estimated Value (£)</label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="0"
                min="0"
                step="100"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Last Contact</label>
              <input
                type="date"
                value={lastContactDate}
                onChange={(e) => setLastContactDate(e.target.value)}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Next Action</label>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. Send proposal by Friday"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Initial Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as Stage)}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>{STAGE_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-white font-medium hover:bg-emerald-500 transition-colors"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
