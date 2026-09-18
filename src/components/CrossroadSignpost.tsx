import { PartOfSpeech } from '../types';
import { POS_CONFIG } from '../data/wordFamilies';
import { Landmark, Zap, Palette, Compass, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CrossroadSignpostProps {
  posKey: PartOfSpeech;
  direction: 'left' | 'right';
  roadNumber: string; // e.g. "1번 길", "2번 길"
  isHighlighted?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const POS_ICONS: Record<PartOfSpeech, React.ComponentType<{ className?: string }>> = {
  noun: Landmark,
  verb: Zap,
  adjective: Palette,
  adverb: Compass,
};

export function CrossroadSignpost({
  posKey,
  direction,
  roadNumber,
  isHighlighted,
  disabled,
  onClick,
}: CrossroadSignpostProps) {
  const config = POS_CONFIG[posKey];
  const Icon = POS_ICONS[posKey];
  const isLeft = direction === 'left';

  // Distinct road colors
  const colorThemes = {
    noun: {
      boardBg: 'from-emerald-700 via-emerald-800 to-teal-900',
      boardBorder: 'border-emerald-400',
      accentGlow: 'shadow-emerald-500/30 ring-emerald-400',
      badgeBg: 'bg-emerald-400 text-emerald-950',
      arrowColor: 'text-emerald-300',
      subText: 'text-emerald-100',
      bolt: 'bg-emerald-300',
    },
    verb: {
      boardBg: 'from-amber-700 via-amber-800 to-orange-900',
      boardBorder: 'border-amber-400',
      accentGlow: 'shadow-amber-500/30 ring-amber-400',
      badgeBg: 'bg-amber-300 text-amber-950',
      arrowColor: 'text-amber-300',
      subText: 'text-amber-100',
      bolt: 'bg-amber-300',
    },
    adjective: {
      boardBg: 'from-sky-700 via-sky-800 to-blue-900',
      boardBorder: 'border-sky-400',
      accentGlow: 'shadow-sky-500/30 ring-sky-400',
      badgeBg: 'bg-sky-300 text-sky-950',
      arrowColor: 'text-sky-300',
      subText: 'text-sky-100',
      bolt: 'bg-sky-300',
    },
    adverb: {
      boardBg: 'from-purple-700 via-purple-800 to-indigo-950',
      boardBorder: 'border-purple-400',
      accentGlow: 'shadow-purple-500/30 ring-purple-400',
      badgeBg: 'bg-purple-300 text-purple-950',
      arrowColor: 'text-purple-300',
      subText: 'text-purple-100',
      bolt: 'bg-purple-300',
    },
  }[posKey];

  return (
    <motion.button
      id={`btn-signpost-${posKey}`}
      data-pos-sign={posKey}
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      className={`group relative z-10 w-full text-left cursor-pointer select-none touch-manipulation transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${isHighlighted ? 'ring-4 ring-offset-2 ' + colorThemes.accentGlow + ' scale-105 z-30' : ''}`}
    >
      {/* Touched notification banner during drag */}
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-40 bg-white text-stone-900 font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg border border-amber-400 whitespace-nowrap animate-bounce">
          🎯 손을 놓으면 이 길로 결정!
        </div>
      )}

      {/* Real Arrowhead Signpost Plaque using CSS Clip-Path / SVG */}
      <div
        className={`relative overflow-hidden rounded-xl border-2 ${colorThemes.boardBorder} bg-linear-to-r ${
          colorThemes.boardBg
        } p-3 sm:p-3.5 text-white shadow-lg transition-shadow hover:shadow-xl ${
          isLeft ? 'pr-4 pl-3' : 'pl-4 pr-3'
        }`}
        style={{
          // Authentic trail signpost pointed edge
          clipPath: isLeft
            ? 'polygon(16px 0%, 100% 0%, 100% 100%, 16px 100%, 0% 50%)'
            : 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%)',
        }}
      >
        {/* Subtle woodgrain horizontal texture lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_6px,rgba(0,0,0,0.4)_6px,rgba(0,0,0,0.4)_7px)]" />

        {/* Mounting Bolts (🔩 나사 볼트) on the pole-attached side */}
        <div
          className={`absolute top-2 bottom-2 flex flex-col justify-between pointer-events-none ${
            isLeft ? 'right-2' : 'left-2'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-stone-300 border border-stone-600 shadow-inner flex items-center justify-center">
            <div className="w-1 h-0.5 bg-stone-700" />
          </div>
          <div className="w-2 h-2 rounded-full bg-stone-300 border border-stone-600 shadow-inner flex items-center justify-center">
            <div className="w-1 h-0.5 bg-stone-700" />
          </div>
        </div>

        {/* Plaque Content Container */}
        <div className={`relative z-10 flex flex-col justify-between min-h-[78px] ${isLeft ? 'pl-2' : 'pr-2'}`}>
          {/* Header row: Road number badge + Arrow Direction + English POS */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1.5">
              {isLeft && <ArrowLeft className={`w-4 h-4 ${colorThemes.arrowColor} shrink-0 animate-pulse`} />}
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/30 px-1.5 py-0.5 rounded text-stone-200">
                {roadNumber}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${colorThemes.badgeBg}`}>
                {config.enName}
              </span>
            </div>

            {!isLeft && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono opacity-80">{config.shortCode}</span>
                <ArrowRight className={`w-4 h-4 ${colorThemes.arrowColor} shrink-0 animate-pulse`} />
              </div>
            )}
            {isLeft && <span className="text-[10px] font-mono opacity-80">{config.shortCode}</span>}
          </div>

          {/* Main Title: Korean POS with directional arrow */}
          <div className="flex items-center gap-2 my-0.5">
            <div className="p-1 rounded-md bg-white/15 backdrop-blur-xs shrink-0">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm leading-tight text-white">
              {config.krName}
            </h3>
            <span className="text-xs text-white/80 font-normal">길</span>
          </div>

          {/* Suffix Clue / Road Milestone */}
          <div className="mt-1 pt-1 border-t border-white/20 flex items-center justify-between text-[11px] font-medium">
            <span className={`truncate ${colorThemes.subText}`}>
              단서: <strong className="text-white font-bold">{config.suffixTips}</strong>
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
