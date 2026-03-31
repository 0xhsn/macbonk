import { useReducer, useCallback, useEffect } from 'react';
import { Box } from 'ink';
import type { AppState, AppAction, StepOutcome, StepCategory, HardeningStep } from './types.ts';
import { categories, allSteps } from './constants.ts';
import { saveSession, loadSession, clearSession } from './utils/session.ts';
import Welcome from './components/Welcome.tsx';
import CategoryList from './components/CategoryList.tsx';
import StepRunner from './components/StepRunner.tsx';
import ProgressBar from './components/ProgressBar.tsx';
import Summary from './components/Summary.tsx';

function resolveQueue(ids: string[]): HardeningStep[] {
  return ids.map(id => allSteps.find(s => s.id === id)).filter(Boolean) as HardeningStep[];
}

function buildResumedState(dryRun: boolean, yolo: boolean): AppState | null {
  const session = loadSession();
  if (!session || session.currentIndex >= session.queue.length) return null;
  const queue = resolveQueue(session.queue);
  if (queue.length === 0) return null;
  return {
    mode: 'running',
    categories,
    queue,
    currentIndex: session.currentIndex,
    outcomes: session.outcomes,
    dryRun,
    yolo,
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_ALL':
      return { ...state, mode: 'running', queue: allSteps, currentIndex: 0, outcomes: [] };
    case 'START_CATEGORY': {
      const cat = categories.find(c => c.id === action.categoryId);
      return { ...state, mode: 'running', queue: cat?.steps ?? [], currentIndex: 0, outcomes: [] };
    }
    case 'RESUME': {
      const resumed = buildResumedState(state.dryRun, state.yolo);
      return resumed ?? state;
    }
    case 'RECORD_OUTCOME': {
      const outcomes = [...state.outcomes, action.outcome];
      const next = state.currentIndex + 1;
      if (next >= state.queue.length) return { ...state, mode: 'summary', outcomes };
      return { ...state, outcomes, currentIndex: next };
    }
    case 'FINISH':
      return { ...state, mode: 'summary' };
    default:
      return state;
  }
}

interface Props {
  dryRun: boolean;
  yolo: boolean;
  filterCategory?: string;
}

export default function App({ dryRun, yolo, filterCategory }: Props) {
  const session = loadSession();
  const canResume = !yolo && !filterCategory && session !== null && session.currentIndex < session.queue.length;

  const initial: AppState = {
    mode: yolo ? 'running' : 'welcome',
    categories,
    queue: yolo ? (filterCategory ? categories.find(c => c.id === filterCategory)?.steps ?? [] : allSteps) : [],
    currentIndex: 0,
    outcomes: [],
    dryRun,
    yolo,
  };

  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    if (state.mode === 'running' && state.queue.length > 0) {
      saveSession(state.queue, state.currentIndex, state.outcomes);
    }
    if (state.mode === 'summary') {
      clearSession();
    }
  }, [state.mode, state.currentIndex]);

  const handleContinue = useCallback(() => {
    if (filterCategory) {
      dispatch({ type: 'START_CATEGORY', categoryId: filterCategory as StepCategory });
    } else {
      dispatch({ type: 'START_ALL' });
    }
  }, [filterCategory]);

  const handleSelectCategory = useCallback((id: StepCategory | 'all' | 'resume') => {
    if (id === 'resume') dispatch({ type: 'RESUME' });
    else if (id === 'all') { clearSession(); dispatch({ type: 'START_ALL' }); }
    else { clearSession(); dispatch({ type: 'START_CATEGORY', categoryId: id as StepCategory }); }
  }, []);

  const handleOutcome = useCallback((outcome: StepOutcome) => {
    dispatch({ type: 'RECORD_OUTCOME', outcome });
  }, []);

  const currentStep: HardeningStep | undefined = state.queue[state.currentIndex];
  const currentCategory = currentStep ? categories.find(c => c.id === currentStep.category) : undefined;

  return (
    <Box flexDirection="column">
      {state.mode === 'welcome' && (
        <Welcome dryRun={dryRun} yolo={yolo} onContinue={filterCategory ? handleContinue : () => dispatch({ type: 'START_ALL' })} />
      )}

      {state.mode === 'welcome' && !filterCategory && !yolo && (
        <CategoryList categories={categories} onSelect={handleSelectCategory} canResume={canResume} resumeInfo={session} />
      )}

      {state.mode === 'running' && currentStep && (
        <Box flexDirection="column">
          <ProgressBar
            current={state.currentIndex + 1}
            total={state.queue.length}
            label={currentCategory?.title ?? currentStep.category}
          />
          <StepRunner
            key={currentStep.id}
            step={currentStep}
            dryRun={dryRun}
            yolo={yolo}
            onOutcome={handleOutcome}
          />
        </Box>
      )}

      {state.mode === 'summary' && <Summary outcomes={state.outcomes} />}
    </Box>
  );
}
