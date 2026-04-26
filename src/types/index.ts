export interface Question {
  id: string;
  exam: 'core1' | 'core2';
  domain: string;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export type QuizMode = 'quick' | 'full' | 'domain' | 'missed';

export interface QuizConfig {
  mode: QuizMode;
  exam: 'core1' | 'core2' | 'both';
  domain?: string;
}

export interface QuizSession {
  questions: Question[];
  currentIndex: number;
  answers: (number | null)[];
  startTime: number;
}

export interface QuizResult {
  question: Question;
  selectedAnswer: number | null;
  correct: boolean;
}
