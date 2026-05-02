export interface Question {
  id: string;
  exam: 'core1' | 'core2';
  domain: string;
  question: string;
  options: string[];
  answer: number | number[];  // single index or sorted array for multi-select
  explanation?: string;
}

export type QuizMode = 'quick' | 'full' | 'domain' | 'missed' | 'recent-core1' | 'recent-core2' | 'pbq-core1' | 'pbq-core2';

export interface CategorizePBQ {
  id: string;
  exam: 'core1' | 'core2';
  domain: string;
  type: 'categorize';
  question: string;
  categories: string[];
  items: { label: string; correct: string }[];
  explanation?: string;
}

export interface SequencePBQ {
  id: string;
  exam: 'core1' | 'core2';
  domain: string;
  type: 'sequence';
  question: string;
  steps: string[];
  explanation?: string;
}

export type PerformanceQuestion = CategorizePBQ | SequencePBQ;

export interface PBQResult {
  question: PerformanceQuestion;
  correct: boolean;
}

export interface QuizConfig {
  mode: QuizMode;
  exam: 'core1' | 'core2' | 'both';
  domain?: string;
}

export interface QuizSession {
  questions: Question[];
  currentIndex: number;
  answers: (number | number[] | null)[];
  startTime: number;
}

export type AnyQuestion = Question | PerformanceQuestion

export function isPBQ(q: AnyQuestion): q is PerformanceQuestion {
  return 'type' in q
}

export interface QuizResult {
  question: AnyQuestion;
  selectedAnswer: number | number[] | null;
  correct: boolean;
}
