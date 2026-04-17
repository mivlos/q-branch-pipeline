'use client';

import { Project, Stage } from './types';

const STORAGE_KEY = 'qbranch-projects';

const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'sample-1',
    clientName: 'Acme Corp',
    projectTitle: 'UX Strategy Review',
    description: 'Sample — click to delete. Full UX audit and strategy roadmap for their SaaS platform.',
    estimatedValue: 12000,
    lastContactDate: '2026-04-10',
    nextAction: 'Send proposal deck',
    stage: 'proposals',
    isSample: true,
  },
  {
    id: 'sample-2',
    clientName: 'Nova Ventures',
    projectTitle: 'Product Discovery Sprint',
    description: 'Sample — click to delete. 2-week discovery sprint for their new fintech product.',
    estimatedValue: 8500,
    lastContactDate: '2026-04-15',
    nextAction: 'Schedule kickoff call',
    stage: 'active',
    isSample: true,
  },
];

export function loadProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveProjects(SAMPLE_PROJECTS);
    return SAMPLE_PROJECTS;
  }
  try {
    return JSON.parse(raw) as Project[];
  } catch {
    return SAMPLE_PROJECTS;
  }
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function createProject(data: Omit<Project, 'id'>): Project {
  return { ...data, id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
}

export function moveProject(project: Project, direction: 'forward' | 'back'): Stage {
  const stages: Stage[] = ['prospects', 'proposals', 'active', 'invoicing', 'closed'];
  const idx = stages.indexOf(project.stage);
  if (direction === 'forward' && idx < stages.length - 1) return stages[idx + 1];
  if (direction === 'back' && idx > 0) return stages[idx - 1];
  return project.stage;
}
