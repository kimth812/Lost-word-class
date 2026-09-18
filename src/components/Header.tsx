import { Volume2, VolumeX, Home, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  scoreDelta: number | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onExit: () => void;
}

export function Header({
  currentIndex,
  totalQuestions,
  score,
  streak,
  scoreDelta,
  soundEnabled,
  onToggleSound,
  onExit,
}: HeaderProps) {
  const progressPercent = Math.min(100, Math.round(((currentIndex) / totalQuestions) * 100));

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-amber-200/70 px-4 py-3 sticky top-0 z-20 shadow-xs">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Left: Home & Question Index */}
        <div className="flex items-center gap-2">
          <button
            id="btn-home-exit"
            type="button"
            onClick={onExit}
            title="홈으로 가기"
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-amber-100/60 transition-colors active:scale-95"
            aria-label="홈으로 이동"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Question Index Badge (3/10 format) */}
          <div className="flex items-baseline gap-1 bg-amber-100/80 text-amber-900 px-3 py-1.5 rounded-full font-bold text-sm border border-amber-300/60 shadow-inner">
            <span className="text-amber-700 text-xs font-medium">문제</span>
            <span className="text-base text-amber-950 font-black">{currentIndex + 1}</span>
            <span className="text-amber-600 text-xs">/ {totalQuestions}</span>
          </div>

          {/* Streak indicator if >= 2 */}
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
              <span>{streak}연속!</span>
            </motion.div>
          )}
        </div>

        {/* Right: Sound & Score Display */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-sound"
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-amber-100/60 transition-colors active:scale-95"
            aria-label="효과음 켜기/끄기"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-stone-400" />}
          </button>

          {/* Score Badge */}
          <div className="relative flex items-center bg-stone-900 text-amber-300 px-3.5 py-1.5 rounded-full font-mono font-black text-sm tracking-tight border border-amber-400/40 shadow-sm">
            <span className="text-amber-400 text-xs mr-1 font-sans">점수</span>
            <span>{score}</span>
            <span className="text-stone-400 text-[11px] ml-0.5 font-sans">점</span>

            {/* Score popup animation (+10) */}
            <AnimatePresence>
              {scoreDelta !== null && (
                <motion.span
                  key={scoreDelta}
                  initial={{ y: 0, opacity: 1, scale: 0.8 }}
                  animate={{ y: -24, opacity: 0, scale: 1.25 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute -top-1 right-2 text-emerald-400 font-extrabold text-sm pointer-events-none drop-shadow-md"
                >
                  +{scoreDelta}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto mt-2 h-1.5 w-full bg-stone-200/80 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-linear-to-r from-amber-500 to-emerald-500"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </header>
  );
}
