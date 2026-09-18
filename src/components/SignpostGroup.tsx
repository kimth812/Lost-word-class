import { PartOfSpeech } from '../types';
import { POS_CONFIG } from '../data/wordFamilies';
import { Landmark, Zap, Palette, Compass, ArrowRight, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SignpostGroupProps {
  onSelectPos: (pos: PartOfSpeech) => void;
  onSkip: () => void;
  disabled?: boolean;
}

const POS_ICONS: Record<PartOfSpeech, React.ComponentType<{ className?: string }>> = {
  noun: Landmark,
  verb: Zap,
  adjective: Palette,
  adverb: Compass,
};

export function SignpostGroup({ onSelectPos, onSkip, disabled }: SignpostGroupProps) {
  const posKeys: PartOfSpeech[] = ['noun', 'verb', 'adjective', 'adverb'];

  return (
    <div className="w-full max-w-md mx-auto px-4 flex flex-col gap-4 mt-2">
      {/* 4 Signpost Grid (Roadsign Pole / Signboard look) */}
      <div className="grid grid-cols-2 gap-3 relative">
        {/* Subtle center signpost pole behind items */}
        <div className="absolute left-1/2 top-2 bottom-2 -translate-x-1/2 w-3 bg-stone-300 rounded-full z-0 hidden sm:block opacity-60" />

        {posKeys.map((posKey) => {
          const config = POS_CONFIG[posKey];
          const Icon = POS_ICONS[posKey];

          return (
            <motion.button
              key={posKey}
              id={`btn-signpost-${posKey}`}
              data-pos-sign={posKey}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPos(posKey)}
              whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
              whileTap={!disabled ? { scale: 0.96 } : {}}
              className={`relative z-10 flex flex-col items-start p-3.5 sm:p-4 rounded-2xl border-2 transition-all text-left shadow-md select-none touch-manipulation min-h-[92px] sm:min-h-[100px] justify-between cursor-pointer ${
                posKey === 'noun'
                  ? 'bg-emerald-50/90 border-emerald-500/80 hover:bg-emerald-100/90 text-emerald-950 active:ring-4 active:ring-emerald-200'
                  : posKey === 'verb'
                  ? 'bg-amber-50/90 border-amber-500/80 hover:bg-amber-100/90 text-amber-950 active:ring-4 active:ring-amber-200'
                  : posKey === 'adjective'
                  ? 'bg-sky-50/90 border-sky-500/80 hover:bg-sky-100/90 text-sky-950 active:ring-4 active:ring-sky-200'
                  : 'bg-purple-50/90 border-purple-500/80 hover:bg-purple-100/90 text-purple-950 active:ring-4 active:ring-purple-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Header: Icon & English tag */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    posKey === 'noun'
                      ? 'bg-emerald-600 text-white'
                      : posKey === 'verb'
                      ? 'bg-amber-600 text-white'
                      : posKey === 'adjective'
                      ? 'bg-sky-600 text-white'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{config.enName}</span>
                </span>

                <span className="text-[10px] font-mono text-stone-500 font-semibold">{config.shortCode}</span>
              </div>

              {/* Big Korean Sign Title */}
              <div className="my-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight">{config.krName}</span>
              </div>

              {/* Suffix Clue Hint */}
              <div className="w-full flex items-center justify-between border-t border-stone-200/60 pt-1 text-[11px] text-stone-600">
                <span className="truncate font-medium">{config.suffixTips}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 shrink-0 ml-1" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Next Button (Pass / Skip) */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          id="btn-next-skip"
          type="button"
          disabled={disabled}
          onClick={onSkip}
          className="w-full py-3 px-4 rounded-xl border border-stone-300 bg-stone-100/90 hover:bg-stone-200 text-stone-700 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HelpCircle className="w-4 h-4 text-stone-500" />
          <span>모르겠다면? <strong className="text-stone-900 font-black underline underline-offset-2">Next (넘어가기)</strong></span>
          <ArrowRight className="w-4 h-4 text-stone-500" />
        </button>
      </div>
    </div>
  );
}
