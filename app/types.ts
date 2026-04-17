export type Stage = 'prospects' | 'proposals' | 'active' | 'invoicing' | 'closed';

export const STAGES: Stage[] = ['prospects', 'proposals', 'active', 'invoicing', 'closed'];

export const STAGE_LABELS: Record<Stage, string> = {
  prospects: 'Prospects',
  proposals: 'Proposals',
  active: 'Active',
  invoicing: 'Invoicing',
  closed: 'Closed',
};

export interface Project {
  id: string;
  clientName: string;
  projectTitle: string;
  description: string;
  estimatedValue: number | null;
  lastContactDate: string;
  nextAction: string;
  stage: Stage;
  isSample?: boolean;
  wonAt?: string | null;
}
