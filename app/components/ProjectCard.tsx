'use client';

import { useState } from 'react';
import { Project, Stage, STAGES, STAGE_LABELS } from '../types';

interface Props {
  project: Project;
  onUpdate: (id: string, data: Partial<Project>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'forward' | 'back') => void;
  onMarkWon: (id: string) => void;
}

export default function ProjectCard({ project, onUpdate, onDelete, onMove, onMarkWon }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [clientName, setClientName] = useState(project.clientName);
  const [projectTitle, setProjectTitle] = useState(project.projectTitle);
  const [description, setDescription] = useState(project.description);
  const [estimatedValue, setEstimatedValue] = useState(project.estimatedValue?.toString() ?? '');
  const [lastContactDate, setLastContactDate] = useState(project.lastContactDate);
  const [nextAction, setNextAction] = useState(project.nextAction);

  const stageIdx = STAGES.indexOf(project.stage);
  const canMoveForward = stageIdx < STAGES.length - 1;
  const canMoveBack = stageIdx > 0;
  const isClosed = project.stage === 'closed';

  const handleSave = () => {
    onUpdate(project.id, {
      clientName: clientName.trim(),
      projectTitle: projectTitle.trim(),
      description: description.trim(),
      estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
      lastContactDate,
      nextAction: nextAction.trim(),
    });
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setClientName(project.clientName);
    setProjectTitle(project.projectTitle);
    setDescription(project.description);
    setEstimatedValue(project.estimatedValue?.toString() ?? '');
    setLastContactDate(project.lastContactDate);
    setNextAction(project.nextAction);
    setEditing(false);
  };

  const formatValue = (v: number | null) => {
    if (v === null || v === undefined) return '—';
    return `£${v.toLocaleString('en-GB')}`;
  };

  const formatDate = (d: string) => {
    if (!d) return '—';
    try {
      return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return d;
    }
  };

  return (
    <div
      className={`rounded-lg bg-zinc-900 border transition-all cursor-pointer ${
        expanded ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/5' : 'border-zinc-800 hover:border-zinc-700'
      } ${project.wonAt ? 'ring-2 ring-emerald-500/30' : ''}`}
      onClick={() => !editing && setExpanded(!expanded)}
    >
      {/* Compact view */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{project.clientName}</p>
            <p className="text-sm font-medium text-white mt-0.5 truncate">{project.projectTitle}</p>
          </div>
          {project.estimatedValue !== null && (
            <span className="text-sm font-semibold text-emerald-400 whitespace-nowrap">
              {formatValue(project.estimatedValue)}
            </span>
          )}
        </div>
        {project.nextAction && (
          <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            {project.nextAction}
          </p>
        )}
        <p className="text-xs text-zinc-600 mt-1.5">Last contact: {formatDate(project.lastContactDate)}</p>
        {project.wonAt && (
          <p className="text-xs text-emerald-400 font-medium mt-1">🎉 Won!</p>
        )}
      </div>

      {/* Expanded view */}
      {expanded && (
        <div className="border-t border-zinc-800 p-3.5 space-y-3" onClick={(e) => e.stopPropagation()}>
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full rounded bg-zinc-800 border border-zinc-700 px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Project Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full rounded bg-zinc-800 border border-zinc-700 px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded bg-zinc-800 border border-zinc-700 px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Value (£)</label>
                  <input
                    type="number"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    className="w-full rounded bg-zinc-800 border border-zinc-700 px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    min="0"
                    step="100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Last Contact</label>
                  <input
                    type="date"
                    value={lastContactDate}
                    onChange={(e) => setLastContactDate(e.target.value)}
                    className="w-full rounded bg-zinc-800 border border-zinc-700 px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500 [color-scheme:dark]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Next Action</label>
                <input
                  type="text"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  className="w-full rounded bg-zinc-800 border border-zinc-700 px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 rounded bg-emerald-600 px-3 py-1.5 text-xs text-white font-medium hover:bg-emerald-500 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              {project.description && (
                <p className="text-sm text-zinc-400">{project.description}</p>
              )}
              <div className="text-xs text-zinc-500 space-y-1">
                <p>Stage: <span className="text-zinc-300">{STAGE_LABELS[project.stage]}</span></p>
                <p>Value: <span className="text-emerald-400">{formatValue(project.estimatedValue)}</span></p>
                <p>Last contact: <span className="text-zinc-300">{formatDate(project.lastContactDate)}</span></p>
                <p>Next action: <span className="text-zinc-300">{project.nextAction || '—'}</span></p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {canMoveBack && (
                  <button
                    onClick={() => onMove(project.id, 'back')}
                    className="rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    ← Move Back
                  </button>
                )}
                {canMoveForward && (
                  <button
                    onClick={() => onMove(project.id, 'forward')}
                    className="rounded bg-emerald-600/20 border border-emerald-600/30 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                  >
                    Move Forward →
                  </button>
                )}
                <button
                  onClick={() => setEditing(true)}
                  className="rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  ✏️ Edit
                </button>
                {isClosed && !project.wonAt && (
                  <button
                    onClick={() => onMarkWon(project.id)}
                    className="rounded bg-emerald-600 px-3 py-1.5 text-xs text-white font-medium hover:bg-emerald-500 transition-colors"
                  >
                    🎉 Mark Won
                  </button>
                )}
              </div>

              {/* Delete */}
              <div className="pt-1">
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-400">Delete this project?</span>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500 transition-colors"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="rounded bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700 transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    Delete project
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
