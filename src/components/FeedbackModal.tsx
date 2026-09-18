import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Volume2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WordItem, PartOfSpeech, WordFamily } from '../types';
import { POS_CONFIG, WORD_FAMILIES } from '../data/wordFamilies';
import { speakEnglishWord, playClickSound } from '../utils/audio';

interface FeedbackModalProps {
  isOpen: boolean;
  wordItem: WordItem;
  userAnswer?: PartOfSpeech | 'skipped';
  isCorrect: boolean;
  onNext: () => void;
  soundEnabled: boolean;
}

export function FeedbackModal({
  isOpen,
  wordItem,
  userAnswer,
  isCorrect,
  onNext,
  soundEnabled,
}: FeedbackModalProps) {
  if (!isOpen) return null;

  const correctPosConfig = POS_CONFIG[wordItem.partOfSpeech];
  const userPosConfig = userAnswer && userAnswer !== 'skipped' ? POS_CONFIG[userAnswer] : null;

  // Find the family tree for this word
  const family: WordFamily | undefined = WORD_FAMILIES.find((f) => f.id === wordItem.rootId);

  const handleSpeak = (text: string) => {
    if (soundEnabled) playClickSound();
    speakEnglishWord(text);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[88vh] flex flex-col"
        >
          {/* Top Banner: Correct / Incorrect Status */}
          <div
            className={`px-5 py-4 flex items-center justify-between text-white ${
              isCorrect ? 'bg-emerald-600' : userAnswer === 'skipped' ? 'bg-stone-700' : 'bg-rose-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 shrink-0" />
              ) : userAnswer === 'skipped' ? (
                <HelpCircle className="w-6 h-6 shrink-0 text-amber-300" />
              ) : (
                <XCircle className="w-6 h-6 shrink-0" />
              )}
              <div>
                <h3 className="text-lg font-black tracking-tight">
                  {isCorrect ? '정답입니다! (+10점)' : userAnswer === 'skipped' ? '건너뛴 단어 학습하기' : '틀렸습니다!'}
                </h3>
                <p className="text-xs text-white/90">
                  {isCorrect
                    ? `[${correctPosConfig.krName}] 표지판을 정확히 찾았어요!`
                    : `올바른 길은 [${correctPosConfig.krName}] (${correctPosConfig.enName}) 표지판입니다.`}
                </p>
              </div>
            </div>

            {/* Target Pos Tag */}
            <span className="px-3 py-1 bg-white/20 rounded-full font-bold text-xs">
              {correctPosConfig.shortCode}
            </span>
          </div>

          {/* Scrollable Content: Word Detail & Root Family */}
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Word & Meaning Spotlight */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-stone-900">{wordItem.word}</span>
                  <button
                    id="btn-feedback-speak"
                    type="button"
                    onClick={() => handleSpeak(wordItem.word)}
                    title="발음 듣기"
                    className="p-1.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${correctPosConfig.color.badge}`}>
                  {correctPosConfig.krName} ({correctPosConfig.enName})
                </span>
              </div>

              {/* Korean Meaning */}
              <div className="mt-2 text-base font-bold text-stone-800">
                뜻: <span className="text-amber-950 font-black">{wordItem.meaning}</span>
              </div>

              {/* Suffix Note */}
              <div className="mt-2 text-xs text-stone-600 bg-white/90 rounded-lg p-2.5 border border-amber-200/60 leading-relaxed">
                <strong className="text-amber-800 font-bold">💡 품사 힌트: </strong>
                {wordItem.suffixNote}
              </div>

              {/* Example sentence */}
              {wordItem.exampleSentence && (
                <div className="mt-2 pt-2 border-t border-amber-200/60 text-xs text-stone-600">
                  <p className="italic text-stone-700 font-serif">"{wordItem.exampleSentence}"</p>
                  <p className="text-stone-500 text-[11px] mt-0.5">{wordItem.exampleMeaning}</p>
                </div>
              )}
            </div>

            {/* 4-Form Word Family Tree (같은 뿌리의 4형제 단어 족보) */}
            {family && (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>같은 뿌리({family.root})의 4형제 품사 비교</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Noun */}
                  <div
                    className={`p-2 rounded-xl border ${
                      wordItem.partOfSpeech === 'noun'
                        ? 'bg-emerald-100/90 border-emerald-500 font-bold'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                      <span>명사 (n.)</span>
                      {wordItem.partOfSpeech === 'noun' && <span className="text-[10px] text-emerald-700">★문제단어</span>}
                    </div>
                    <div className="font-semibold text-stone-900 mt-0.5">{family.noun.word}</div>
                    <div className="text-[11px] text-stone-500 truncate">{family.noun.meaning}</div>
                  </div>

                  {/* Verb */}
                  <div
                    className={`p-2 rounded-xl border ${
                      wordItem.partOfSpeech === 'verb'
                        ? 'bg-amber-100/90 border-amber-500 font-bold'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-amber-800 font-bold">
                      <span>동사 (v.)</span>
                      {wordItem.partOfSpeech === 'verb' && <span className="text-[10px] text-amber-700">★문제단어</span>}
                    </div>
                    <div className="font-semibold text-stone-900 mt-0.5">{family.verb.word}</div>
                    <div className="text-[11px] text-stone-500 truncate">{family.verb.meaning}</div>
                  </div>

                  {/* Adjective */}
                  <div
                    className={`p-2 rounded-xl border ${
                      wordItem.partOfSpeech === 'adjective'
                        ? 'bg-sky-100/90 border-sky-500 font-bold'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-sky-800 font-bold">
                      <span>형용사 (adj.)</span>
                      {wordItem.partOfSpeech === 'adjective' && <span className="text-[10px] text-sky-700">★문제단어</span>}
                    </div>
                    <div className="font-semibold text-stone-900 mt-0.5">{family.adjective.word}</div>
                    <div className="text-[11px] text-stone-500 truncate">{family.adjective.meaning}</div>
                  </div>

                  {/* Adverb */}
                  <div
                    className={`p-2 rounded-xl border ${
                      wordItem.partOfSpeech === 'adverb'
                        ? 'bg-purple-100/90 border-purple-500 font-bold'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-purple-800 font-bold">
                      <span>부사 (adv.)</span>
                      {wordItem.partOfSpeech === 'adverb' && <span className="text-[10px] text-purple-700">★문제단어</span>}
                    </div>
                    <div className="font-semibold text-stone-900 mt-0.5">{family.adverb.word}</div>
                    <div className="text-[11px] text-stone-500 truncate">{family.adverb.meaning}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action: Next Button */}
          <div className="p-4 bg-stone-50 border-t border-stone-200">
            <button
              id="btn-feedback-next"
              type="button"
              onClick={onNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 active:bg-black text-white font-black text-base flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
            >
              <span>다음 단어로 계속하기</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
