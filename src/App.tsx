import { useState, useEffect, useRef } from 'react';
import { GameScreen, Question, PartOfSpeech } from './types';
import { generateStandardQuestions, generateRootMasterQuestions, generateRetryQuestions } from './utils/gameLogic';
import { playCorrectSound, playWrongSound, playClickSound } from './utils/audio';
import { getSavedStudentName, saveStudentName } from './utils/googleSheets';
import { Header } from './components/Header';
import { CrossroadsStage } from './components/CrossroadsStage';
import { FeedbackModal } from './components/FeedbackModal';
import { StartScreen } from './components/StartScreen';
import { ResultScreen } from './components/ResultScreen';

const STORAGE_KEY_BEST = 'lost_word_best_score';
const STORAGE_KEY_TOTAL = 'lost_word_total_games';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('start');
  const [studentName, setStudentName] = useState<string>(getSavedStudentName);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [scoreDelta, setScoreDelta] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Time tracking
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Modal / Feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<PartOfSpeech | 'skipped' | undefined>(undefined);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Stored stats
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);

  // Load stats from localStorage
  useEffect(() => {
    try {
      const savedBest = localStorage.getItem(STORAGE_KEY_BEST);
      if (savedBest !== null) setBestScore(parseInt(savedBest, 10));

      const savedTotal = localStorage.getItem(STORAGE_KEY_TOTAL);
      if (savedTotal !== null) setTotalGamesPlayed(parseInt(savedTotal, 10));
    } catch {
      // Storage unavailable
    }
  }, []);

  // Timer interval while playing
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (screen === 'game') {
      const start = Date.now();
      setStartTime(start);
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  // Start new game
  const handleStartGame = (mode: 'standard' | 'rootMaster') => {
    if (soundEnabled) playClickSound();
    const newQuestions = mode === 'rootMaster' ? generateRootMasterQuestions() : generateStandardQuestions(10);

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setScoreDelta(null);
    setShowFeedback(false);
    setElapsedSeconds(0);
    setScreen('game');
  };

  // Restart new game from result
  const handleRestartNewGame = () => {
    handleStartGame('standard');
  };

  // Retry only wrong questions
  const handleRetryWrongOnly = () => {
    if (soundEnabled) playClickSound();
    const retryQs = generateRetryQuestions(questions);
    if (retryQs.length === 0) return;

    setQuestions(retryQs);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setScoreDelta(null);
    setShowFeedback(false);
    setElapsedSeconds(0);
    setScreen('game');
  };

  // Student name update handler
  const handleUpdateStudentName = (name: string) => {
    setStudentName(name);
    saveStudentName(name);
  };

  // Increment tap count on card interactions (dragging, speaker, tap)
  const handleIncrementCardTap = () => {
    setQuestions((prev) => {
      if (!prev[currentIndex]) return prev;
      const updated = [...prev];
      const current = updated[currentIndex];
      updated[currentIndex] = {
        ...current,
        tapCount: (current.tapCount ?? 0) + 1,
      };
      return updated;
    });
  };

  // Handle answering or skipping
  const handleSelectPos = (selectedPos: PartOfSpeech) => {
    if (showFeedback || !questions[currentIndex]) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedPos === currentQ.wordItem.partOfSpeech;

    // Play immediate audio feedback
    if (soundEnabled) {
      if (isCorrect) playCorrectSound();
      else playWrongSound();
    }

    // Update score (+10 per correct)
    if (isCorrect) {
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
      setScoreDelta(10);
      setTimeout(() => setScoreDelta(null), 1000);
    } else {
      setStreak(0);
    }

    // Save answer state and increment tap count to current question
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...currentQ,
      userAnswer: selectedPos,
      isCorrect,
      tapCount: (currentQ.tapCount ?? 0) + 1,
    };
    setQuestions(updatedQuestions);
    setCurrentAnswer(selectedPos);
    setShowFeedback(true);
  };

  // Handle skipping (Next button without answering)
  const handleSkip = () => {
    if (showFeedback || !questions[currentIndex]) return;

    if (soundEnabled) playWrongSound();

    setStreak(0);
    const currentQ = questions[currentIndex];
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...currentQ,
      userAnswer: 'skipped',
      isCorrect: false,
      tapCount: (currentQ.tapCount ?? 0) + 1,
    };
    setQuestions(updatedQuestions);
    setCurrentAnswer('skipped');
    setShowFeedback(true);
  };

  // Proceed to next word or finish game
  const handleNextWord = () => {
    if (soundEnabled) playClickSound();
    setShowFeedback(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Game complete -> save stats & go to result
      finishGame();
    }
  };

  const finishGame = () => {
    const finalScore = score + (questions[currentIndex]?.isCorrect ? 0 : 0);
    setScreen('result');

    // Update localStorage stats
    try {
      const newTotal = totalGamesPlayed + 1;
      setTotalGamesPlayed(newTotal);
      localStorage.setItem(STORAGE_KEY_TOTAL, newTotal.toString());

      if (bestScore === null || finalScore > bestScore) {
        setBestScore(finalScore);
        localStorage.setItem(STORAGE_KEY_BEST, finalScore.toString());
      }
    } catch {
      // Ignore storage errors
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/50 via-stone-50 to-amber-100/30 text-stone-800 flex flex-col items-center justify-start">
      {/* Mobile container wrapper with responsive max-width */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-white/70 shadow-sm border-x border-stone-200/50">
        {screen === 'start' && (
          <StartScreen
            onStartGame={handleStartGame}
            bestScore={bestScore}
            totalGamesPlayed={totalGamesPlayed}
            studentName={studentName}
            onChangeStudentName={handleUpdateStudentName}
          />
        )}

        {screen === 'game' && currentQuestion && (
          <div className="flex-1 flex flex-col min-h-0 pb-2">
            <Header
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              score={score}
              streak={streak}
              scoreDelta={scoreDelta}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled((prev) => !prev)}
              onExit={() => setShowExitConfirm(true)}
            />

            {/* 4-Way Crossroads Stage: Trails, Signs & Word Card */}
            <div className="flex-1 flex flex-col min-h-0 px-2 sm:px-3 pt-1 pb-1">
              <CrossroadsStage
                wordItem={currentQuestion.wordItem}
                soundEnabled={soundEnabled}
                disabled={showFeedback}
                onSelectPos={handleSelectPos}
                onSkip={handleSkip}
                onCardInteract={handleIncrementCardTap}
              />
            </div>

            {/* Instant Feedback Overlay Modal */}
            <FeedbackModal
              isOpen={showFeedback}
              wordItem={currentQuestion.wordItem}
              userAnswer={currentAnswer}
              isCorrect={!!currentQuestion.isCorrect}
              onNext={handleNextWord}
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {screen === 'result' && (
          <ResultScreen
            questions={questions}
            score={score}
            timeSpentSeconds={elapsedSeconds}
            studentName={studentName}
            totalGamesPlayed={totalGamesPlayed}
            onRetryWrongOnly={handleRetryWrongOnly}
            onRestartNewGame={handleRestartNewGame}
            onGoHome={() => setScreen('start')}
            soundEnabled={soundEnabled}
          />
        )}
      </div>

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-stone-200 text-center">
            <h3 className="text-lg font-black text-stone-900 mb-1">게임을 종료할까요?</h3>
            <p className="text-xs text-stone-500 mb-5">
              현재 진행 중인 문제와 점수가 저장되지 않고 처음 화면으로 돌아갑니다.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-colors"
              >
                계속하기
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  setScreen('start');
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
              >
                나가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
