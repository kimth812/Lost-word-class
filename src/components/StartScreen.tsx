import { useState } from 'react';
import { Play, Compass, Award, Sparkles, ChevronRight, Zap, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { CharacterIllustration } from './CharacterIllustration';

interface StartScreenProps {
  onStartGame: (mode: 'standard' | 'rootMaster') => void;
  bestScore: number | null;
  totalGamesPlayed: number;
}

export function StartScreen({ onStartGame, bestScore, totalGamesPlayed }: StartScreenProps) {
  const [selectedMode, setSelectedMode] = useState<'standard' | 'rootMaster'>('standard');

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col items-center justify-between min-h-screen text-center">
      {/* Top Tag & Logo */}
      <div className="w-full flex flex-col items-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs text-amber-900 font-bold mb-3 shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-amber-700" />
          <span>고등 1학년 3분 품사 길찾기</span>
        </div>

        {/* Title Logo */}
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight leading-none">
            LOST! <span className="text-amber-600">word class</span>
          </h1>
          <p className="text-xs sm:text-sm font-bold text-stone-600 mt-2">
            길을 잃은 단어들에게 올바른 품사 표지판을 찾아주세요!
          </p>
        </div>
      </div>

      {/* Hero Character Illustration */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="my-3 relative"
      >
        <CharacterIllustration className="w-44 h-44 sm:w-52 sm:h-52" />
        
        {/* Floating badge */}
        <div className="absolute -bottom-2 right-0 bg-white/95 border border-amber-300 text-stone-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>점심시간 3분 완성!</span>
        </div>
      </motion.div>

      {/* 30-Second Quick Visual Guide (고등학생이 설명 없이 바로 이해) */}
      <div className="w-full bg-white/80 border border-stone-200/80 rounded-2xl p-3.5 shadow-xs text-left mb-4">
        <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1 mb-2 uppercase tracking-wide">
          <Zap className="w-3 h-3 text-amber-600" />
          <span>30초 초간단 플레이 방법</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
            <div className="font-black text-amber-900 text-sm">1. 단어 확인</div>
            <div className="text-[10px] text-stone-500 mt-0.5">화면 중앙의 영단어와 어원 힌트 보기</div>
          </div>
          <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/60">
            <div className="font-black text-emerald-900 text-sm">2. 갈림길 표지판</div>
            <div className="text-[10px] text-stone-500 mt-0.5">4갈래 길 중 맞는 표지판으로 드래그 or 탭</div>
          </div>
          <div className="bg-sky-50/70 p-2 rounded-xl border border-sky-200/60">
            <div className="font-black text-sky-900 text-sm">3. 족보 정복</div>
            <div className="text-[10px] text-stone-500 mt-0.5">한 판에 같은 뿌리 4형제 단어 자동 습득</div>
          </div>
        </div>
      </div>

      {/* Mode Selection Tabs */}
      <div className="w-full bg-stone-100 p-1.5 rounded-2xl flex items-center gap-1 mb-4 border border-stone-200">
        <button
          type="button"
          onClick={() => setSelectedMode('standard')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            selectedMode === 'standard'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>스피드 10문제 (랜덤)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('rootMaster')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            selectedMode === 'rootMaster'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>어원 3총사 정복 (12문제)</span>
        </button>
      </div>

      {/* Center Big Start Button (눈에 띄는 큰 글씨) */}
      <div className="w-full pb-4">
        <motion.button
          id="btn-start-game"
          type="button"
          onClick={() => onStartGame(selectedMode)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xl sm:text-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer border-b-4 border-orange-700 active:border-b-0 active:translate-y-1"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>게임 시작</span>
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {/* Best Score & History footer */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-stone-500 font-medium">
          {bestScore !== null && (
            <div className="flex items-center gap-1 text-amber-800 font-bold bg-amber-100/60 px-2.5 py-1 rounded-md border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>최고 점수: {bestScore}점</span>
            </div>
          )}
          <span>누적 플레이: {totalGamesPlayed}회</span>
        </div>
      </div>
    </div>
  );
}
