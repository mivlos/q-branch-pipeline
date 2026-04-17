'use client';

import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Project, Stage, STAGES, STAGE_LABELS } from '../types';
import { loadProjects, saveProjects, createProject, moveProject } from '../store';
import ProjectCard from './ProjectCard';
import AddProjectModal from './AddProjectModal';

export default function Pipeline() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
    setMounted(true);
  }, []);

  const persist = useCallback((updated: Project[]) => {
    setProjects(updated);
    saveProjects(updated);
  }, []);

  const handleAdd = (data: Omit<Project, 'id' | 'isSample' | 'wonAt'>) => {
    const newProject = createProject({ ...data, isSample: false, wonAt: null });
    persist([...projects, newProject]);
    setShowAddModal(false);
  };

  const handleUpdate = (id: string, data: Partial<Project>) => {
    persist(projects.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const handleDelete = (id: string) => {
    persist(projects.filter((p) => p.id !== id));
  };

  const handleMove = (id: string, direction: 'forward' | 'back') => {
    persist(
      projects.map((p) => {
        if (p.id !== id) return p;
        const newStage = moveProject(p, direction);
        return { ...p, stage: newStage };
      })
    );
  };

  const handleMarkWon = (id: string) => {
    persist(
      projects.map((p) =>
        p.id === id ? { ...p, wonAt: new Date().toISOString() } : p
      )
    );
    // Fire confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#ffffff'],
    });
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5, x: 0.3 },
        colors: ['#10b981', '#34d399', '#ffffff'],
      });
    }, 200);
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5, x: 0.7 },
        colors: ['#10b981', '#34d399', '#ffffff'],
      });
    }, 400);
  };

  const projectsByStage = (stage: Stage) => projects.filter((p) => p.stage === stage);

  const stageTotal = (stage: Stage) =>
    projectsByStage(stage).reduce((sum, p) => sum + (p.estimatedValue ?? 0), 0);

  const pipelineValue = stageTotal('active') + stageTotal('invoicing');
  const totalProjects = projects.length;

  const formatCurrency = (v: number) => `£${v.toLocaleString('en-GB')}`;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Q-Branch 🔬</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Project Pipeline Tracker</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-zinc-500">Pipeline Value</p>
                <p className="text-lg font-bold text-emerald-400">{formatCurrency(pipelineValue)}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-zinc-500">Projects</p>
                <p className="text-lg font-bold text-zinc-300">{totalProjects}</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors flex items-center gap-1.5"
              >
                <span className="text-lg leading-none">+</span> New Project
              </button>
            </div>
          </div>
          {/* Mobile stats */}
          <div className="flex gap-4 mt-3 sm:hidden">
            <div>
              <p className="text-xs text-zinc-500">Pipeline Value</p>
              <p className="text-base font-bold text-emerald-400">{formatCurrency(pipelineValue)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Projects</p>
              <p className="text-base font-bold text-zinc-300">{totalProjects}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-[1600px] mx-auto p-4">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:snap-none">
          {STAGES.map((stage) => {
            const stageProjects = projectsByStage(stage);
            const total = stageTotal(stage);
            return (
              <div
                key={stage}
                className="flex-shrink-0 w-[300px] md:w-0 md:flex-1 md:min-w-[240px] snap-center"
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-zinc-300">{STAGE_LABELS[stage]}</h2>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-xs text-zinc-400 font-medium">
                      {stageProjects.length}
                    </span>
                  </div>
                  {total > 0 && (
                    <span className="text-xs font-medium text-emerald-400/70">{formatCurrency(total)}</span>
                  )}
                </div>

                {/* Cards */}
                <div className="space-y-2.5 min-h-[100px]">
                  {stageProjects.length === 0 && (
                    <div className="rounded-lg border border-dashed border-zinc-800 p-6 text-center">
                      <p className="text-xs text-zinc-600">No projects</p>
                    </div>
                  )}
                  {stageProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                      onMove={handleMove}
                      onMarkWon={handleMarkWon}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <AddProjectModal onAdd={handleAdd} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
