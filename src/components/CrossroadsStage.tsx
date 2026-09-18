import { useState } from 'react';
import { PartOfSpeech, WordItem } from '../types';
import { CrossroadSignpost } from './CrossroadSignpost';
import { WordCard } from './WordCard';
import { ArrowRight, HelpCircle, Compass, Footprints } from 'lucide-react';
import { motion } from 'motion/react';

interface CrossroadsStageProps {
  wordItem: WordItem;
  soundEnabled: boolean;
  disabled?: boolean;
  onSelectPos: (pos: PartOfSpeech) => void;
  onSkip: () => void;
}

export function CrossroadsStage({
  wordItem,
  soundEnabled,
  disabled,
  onSelectPos,
  onSkip,
}: CrossroadsStageProps) {
  const [activeHoverRoad, setActiveHoverRoad] = useState<PartOfSpeech | null>(null);

  return (
    <div className="w-full max-w-md mx-auto px-3 flex flex-col items-center select-none">
      {/* Crossroads Title Banner */}
      <div className="w-full flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
          <span>현위치: 4갈래 갈림길 교차로</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-stone-500 font-semibold">
          <Footprints className="w-3 h-3 text-stone-400" />
          <span>올바른 표지판을 선택하세요</span>
        </div>
      </div>

      {/* Crossroads Visual Stage (갈림길 무대) */}
      <div className="relative w-full rounded-3xl bg-linear-to-b from-stone-100 via-amber-50/40 to-stone-100 p-3 sm:p-4 border-2 border-stone-200/90 shadow-md overflow-hidden">
        {/* SVG Crossroads Trails Background (4갈래 길 교차로 그래픽) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Trail patterns */}
            <radialGradient id="centerJunctionGlow" cx="50%" cy="46%" r="40%">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#FDE68A" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F5F5F4" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="roadNoun" x1="50%" y1="46%" x2="15%" y2="12%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="roadVerb" x1="50%" y1="46%" x2="85%" y2="12%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="roadAdj" x1="50%" y1="46%" x2="15%" y2="88%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="roadAdv" x1="50%" y1="46%" x2="85%" y2="88%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Central Junction Ambient Glow */}
          <circle cx="50%" cy="46%" r="130" fill="url(#centerJunctionGlow)" />

          {/* 4 Dirt/Stone Road Branch Bands */}
          {/* Path 1: To Top-Left (Noun) */}
          <line
            x1="50%"
            y1="46%"
            x2="15%"
            y2="15%"
            stroke="url(#roadNoun)"
            strokeWidth={activeHoverRoad === 'noun' ? '32' : '22'}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
          <line
            x1="50%"
            y1="46%"
            x2="15%"
            y2="15%"
            stroke="#047857"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
            className="animate-pulse"
          />

          {/* Path 2: To Top-Right (Verb) */}
          <line
            x1="50%"
            y1="46%"
            x2="85%"
            y2="15%"
            stroke="url(#roadVerb)"
            strokeWidth={activeHoverRoad === 'verb' ? '32' : '22'}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
          <line
            x1="50%"
            y1="46%"
            x2="85%"
            y2="15%"
            stroke="#B45309"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
            className="animate-pulse"
          />

          {/* Path 3: To Bottom-Left (Adjective) */}
          <line
            x1="50%"
            y1="46%"
            x2="15%"
            y2="82%"
            stroke="url(#roadAdj)"
            strokeWidth={activeHoverRoad === 'adjective' ? '32' : '22'}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
          <line
            x1="50%"
            y1="46%"
            x2="15%"
            y2="82%"
            stroke="#0369A1"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
            className="animate-pulse"
          />

          {/* Path 4: To Bottom-Right (Adverb) */}
          <line
            x1="50%"
            y1="46%"
            x2="85%"
            y2="82%"
            stroke="url(#roadAdv)"
            strokeWidth={activeHoverRoad === 'adverb' ? '32' : '22'}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
          <line
            x1="50%"
            y1="46%"
            x2="85%"
            y2="82%"
            stroke="#6D28D9"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
            className="animate-pulse"
          />

          {/* Crossroads Center Marker Ring */}
          <circle cx="50%" cy="46%" r="56" stroke="#D97706" strokeWidth="2" strokeDasharray="4 3" fill="none" />
        </svg>

        {/* Real Central Signpost Pole (원목 표지판 기둥) */}
        <div className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-4 bg-linear-to-r from-amber-900 via-amber-700 to-amber-950 rounded-full shadow-md z-0 opacity-80 pointer-events-none" />

        {/* Top Two Signposts: Noun (Left) and Verb (Right) */}
        <div className="grid grid-cols-2 gap-3 relative z-10 mb-3">
          <div
            onMouseEnter={() => setActiveHoverRoad('noun')}
            onMouseLeave={() => setActiveHoverRoad(null)}
          >
            <CrossroadSignpost
              posKey="noun"
              direction="left"
              roadNumber="1번 길"
              isHighlighted={activeHoverRoad === 'noun'}
              disabled={disabled}
              onClick={() => onSelectPos('noun')}
            />
          </div>

          <div
            onMouseEnter={() => setActiveHoverRoad('verb')}
            onMouseLeave={() => setActiveHoverRoad(null)}
          >
            <CrossroadSignpost
              posKey="verb"
              direction="right"
              roadNumber="2번 길"
              isHighlighted={activeHoverRoad === 'verb'}
              disabled={disabled}
              onClick={() => onSelectPos('verb')}
            />
          </div>
        </div>

        {/* Center: The Word Card standing at the Crossroads */}
        <div className="relative z-20 my-1">
          <WordCard
            wordItem={wordItem}
            soundEnabled={soundEnabled}
            onDropOnPos={onSelectPos}
            onHoverPos={setActiveHoverRoad}
            disabled={disabled}
          />
        </div>

        {/* Bottom Two Signposts: Adjective (Left) and Adverb (Right) */}
        <div className="grid grid-cols-2 gap-3 relative z-10 mt-3">
          <div
            onMouseEnter={() => setActiveHoverRoad('adjective')}
            onMouseLeave={() => setActiveHoverRoad(null)}
          >
            <CrossroadSignpost
              posKey="adjective"
              direction="left"
              roadNumber="3번 길"
              isHighlighted={activeHoverRoad === 'adjective'}
              disabled={disabled}
              onClick={() => onSelectPos('adjective')}
            />
          </div>

          <div
            onMouseEnter={() => setActiveHoverRoad('adverb')}
            onMouseLeave={() => setActiveHoverRoad(null)}
          >
            <CrossroadSignpost
              posKey="adverb"
              direction="right"
              roadNumber="4번 길"
              isHighlighted={activeHoverRoad === 'adverb'}
              disabled={disabled}
              onClick={() => onSelectPos('adverb')}
            />
          </div>
        </div>
      </div>

      {/* Bottom Action: Next Button (모를 때 갈림길 건너뛰기) */}
      <div className="w-full mt-3">
        <motion.button
          id="btn-next-skip"
          type="button"
          disabled={disabled}
          onClick={onSkip}
          whileHover={!disabled ? { scale: 1.01 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          className="w-full py-3 px-4 rounded-2xl border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HelpCircle className="w-4 h-4 text-stone-500" />
          <span>길을 모르겠다면? <strong className="text-stone-950 underline underline-offset-2 font-black">Next (이 갈림길 넘어가기)</strong></span>
          <ArrowRight className="w-4 h-4 text-stone-500" />
        </motion.button>
      </div>
    </div>
  );
}
