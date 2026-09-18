import { Question, WordItem, WordFamily } from '../types';
import { WORD_FAMILIES } from '../data/wordFamilies';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 10 Random unique questions without duplicates
export function generateStandardQuestions(count = 10): Question[] {
  const allWords: WordItem[] = [];
  WORD_FAMILIES.forEach((fam) => {
    allWords.push(fam.noun, fam.verb, fam.adjective, fam.adverb);
  });

  const shuffled = shuffleArray(allWords);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((wordItem, index) => ({
    id: `q-${Date.now()}-${index}-${wordItem.id}`,
    wordItem,
  }));
}

// 12 questions from 3 root families (3 roots x 4 forms = 12 words)
export function generateRootMasterQuestions(): Question[] {
  const shuffledFamilies = shuffleArray(WORD_FAMILIES);
  const selectedFamilies = shuffledFamilies.slice(0, 3);

  const words: WordItem[] = [];
  selectedFamilies.forEach((fam) => {
    words.push(fam.noun, fam.verb, fam.adjective, fam.adverb);
  });

  const shuffledWords = shuffleArray(words);
  return shuffledWords.map((wordItem, index) => ({
    id: `q-root-${Date.now()}-${index}-${wordItem.id}`,
    wordItem,
  }));
}

// Retry only incorrect questions
export function generateRetryQuestions(previousQuestions: Question[]): Question[] {
  const wrongOnly = previousQuestions.filter((q) => !q.isCorrect);
  const shuffled = shuffleArray(wrongOnly);

  return shuffled.map((q, index) => ({
    id: `retry-${Date.now()}-${index}-${q.wordItem.id}`,
    wordItem: q.wordItem,
  }));
}
