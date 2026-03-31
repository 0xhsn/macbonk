export type DangerLevel = 'low' | 'medium' | 'high' | 'critical';

export type StepCategory =
  | 'system-hardening'
  | 'firewall'
  | 'dns'
  | 'privoxy'
  | 'homebrew'
  | 'ssh'
  | 'metadata'
  | 'privacy'
  | 'encryption'
  | 'monitoring'
  | 'verification';

export interface HardeningStep {
  id: string;
  title: string;
  description: string;
  category: StepCategory;
  commands: string[];
  dangerLevel: DangerLevel;
  requiresSudo: boolean;
  warning?: string;
  tolerateFailure?: boolean;
  guideRef?: string;
  dotfilesRef?: string;
  promptForValue?: { flag: string; prompt: string; default: string };
  backupPaths?: string[];
}

export type StepResult = 'applied' | 'skipped' | 'failed';

export interface StepOutcome {
  step: HardeningStep;
  result: StepResult;
  error?: string;
  durationMs: number;
}

export interface CategoryInfo {
  id: StepCategory;
  title: string;
  description: string;
  steps: HardeningStep[];
}

export type AppMode = 'welcome' | 'category-list' | 'running' | 'summary';

export interface AppState {
  mode: AppMode;
  categories: CategoryInfo[];
  queue: HardeningStep[];
  currentIndex: number;
  outcomes: StepOutcome[];
  dryRun: boolean;
  yolo: boolean;
}

export type AppAction =
  | { type: 'START_ALL' }
  | { type: 'START_CATEGORY'; categoryId: StepCategory }
  | { type: 'RESUME' }
  | { type: 'RECORD_OUTCOME'; outcome: StepOutcome }
  | { type: 'FINISH' };
