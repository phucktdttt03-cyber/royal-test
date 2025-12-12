export type Level = 'Starters' | 'Movers' | 'Flyers';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface VocabularyWord {
  word: string;
  phonetics: string;
  meaning: string;
  example: string;
  imageDescription: string; // Used to generate the AI image
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<number, string>; // questionId -> selectedOption
  score: number;
  isFinished: boolean;
  timeTaken: number; // in seconds
}

export type AppStatus = 'idle' | 'menu' | 'loading_exam' | 'exam' | 'results' | 'loading_topics' | 'topics' | 'loading_vocab' | 'vocab' | 'error';