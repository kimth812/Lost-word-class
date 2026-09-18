export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb';

export interface PosMetadata {
  type: PartOfSpeech;
  krName: string;
  enName: string;
  shortCode: string;
  color: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    signGradient: string;
    accent: string;
  };
  suffixTips: string;
  description: string;
  iconName: string;
}

export interface WordItem {
  id: string;
  word: string;
  meaning: string;
  partOfSpeech: PartOfSpeech;
  rootId: string;
  rootName: string;
  suffixNote: string;
  exampleSentence?: string;
  exampleMeaning?: string;
}

export interface WordFamily {
  id: string;
  root: string;
  rootMeaning: string;
  noun: WordItem;
  verb: WordItem;
  adjective: WordItem;
  adverb: WordItem;
}

export interface Question {
  id: string;
  wordItem: WordItem;
  userAnswer?: PartOfSpeech | 'skipped';
  isCorrect?: boolean;
  timeTakenMs?: number;
}

export type GameScreen = 'start' | 'game' | 'result';

export interface GameSettings {
  soundEnabled: boolean;
  ttsEnabled: boolean;
}
