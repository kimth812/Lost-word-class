import { PartOfSpeech } from '../types';
import { POS_CONFIG } from '../data/wordFamilies';
import { Landmark, Zap, Palette, Compass, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CrossroadSignpostProps {
  posKey: PartOfSpeech;
  direction: 'left' | 'right';
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

// Clean formatted suffix clues using mid-dots (·)
const CLEAN_SUFFIX_TIPS: Record<PartOfSpeech, string> = {
  noun: '-tion · -ment · -ness · -ty',
  verb: '-ate · -ize · -en · -fy',
  adjective: '-ful · -able · -ive · -al · -ous',
  adverb: '-ly (형용사 + ly)',
};

export function CrossroadSignpost({
  posKey,
  direction,
  isHighlighted,
  disabled,
  onClick,
}: CrossroadSignpostProps) {
  const config = POS_CONFIG[posKey];
  const Icon = POS_ICONS[posKey];
  const isLeft = direction === 'left';
  const suffixText = CLEAN_SUFFIX_TIPS[posKey];

  // Natural wood plank color themes: unified wood hues with differing brightness levels
  const woodThemes = {
    // 1. Noun: 밝은 살색/베이지 자작나무 (Light Birch Wood - Brightest)
    noun: {
      boardBg: 'from-[#EFE4D3] via-[#E4D4BC] to-[#D5C2A4]',
      boardBorder: 'border-[#947854]',
      boardShadow: 'shadow-[#8C6D4C]/25',
      titleText: 'text-[#3E2815]',
      krText: 'text-[#61442B]',
      clueText: 'text-[#4A321B]',
      arrowColor: 'text-[#5C3E24]',
      iconBg: 'bg-[#5C3E24]/12 text-[#4A321B]',
      bolt: 'bg-[#826647] border-[#4A3521]',
      glowRing: 'ring-[#826647] ring-offset-1 shadow-md shadow-[#826647]/40',
      stakeBg: 'from-[#C9B393] to-[#B09774]',
    },
    // 2. Verb: 따뜻한 황토색 나무 (Warm Ochre Wood - Medium Bright)
    verb: {
      boardBg: 'from-[#CCA36B] via-[#BD9054] to-[#A97D41]',
      boardBorder: 'border-[#754E20]',
      boardShadow: 'shadow-[#663E14]/25',
      titleText: 'text-[#FFFDF7]',
      krText: 'text-[#FEF3C7]',
      clueText: 'text-[#FFF9E5]',
      arrowColor: 'text-[#FFF0D4]',
      iconBg: 'bg-black/15 text-[#FFF9E5]',
      bolt: 'bg-[#6E471E] border-[#3D250C]',
      glowRing: 'ring-[#BD9054] ring-offset-1 shadow-md shadow-[#96632E]/40',
      stakeBg: 'from-[#A87A41] to-[#8C612B]',
    },
    // 3. Adjective: 차분한 미디엄 브라운 나무 (Medium Teak Wood - Medium Dark)
    adjective: {
      boardBg: 'from-[#9B7047] via-[#895E36] to-[#764C26]',
      boardBorder: 'border-[#4F2D13]',
      boardShadow: 'shadow-[#42220A]/25',
      titleText: 'text-[#FFFDF8]',
      krText: 'text-[#FDE8D0]',
      clueText: 'text-[#FFF1E0]',
      arrowColor: 'text-[#FCE5CB]',
      iconBg: 'bg-black/20 text-[#FFF1E0]',
      bolt: 'bg-[#523015] border-[#291506]',
      glowRing: 'ring-[#895E36] ring-offset-1 shadow-md shadow-[#613D1D]/40',
      stakeBg: 'from-[#784E29] to-[#5F3B1A]',
    },
    // 4. Adverb: 짙은 밤색/월넛 나무 (Dark Walnut Wood - Darkest)
    adverb: {
      boardBg: 'from-[#6B4B2E] via-[#593A1F] to-[#472A11]',
      boardBorder: 'border-[#2D1808]',
      boardShadow: 'shadow-[#1F0E03]/30',
      titleText: 'text-[#FFFDF7]',
      krText: 'text-[#EEDBC5]',
      clueText: 'text-[#F9F0E6]',
      arrowColor: 'text-[#ECD9C2]',
      iconBg: 'bg-black/25 text-[#F9F0E6]',
      bolt: 'bg-[#3B220F] border-[#1A0B02]',
      glowRing: 'ring-[#593A1F] ring-offset-1 shadow-md shadow-[#381F0B]/40',
      stakeBg: 'from-[#4D2F15] to-[#361E08]',
    },
  }[posKey];

  return (
    <div className="relative w-full">
      {/* Individual Wooden Stake planted directly into this road branch */}
      <div
        className={`absolute bottom-0 ${
          isLeft ? 'right-6' : 'left-6'
        } -mb-3.5 w-3.5 h-6 bg-linear-to-b ${woodThemes.stakeBg} rounded-b-xs shadow-xs border-x border-b border-black/35 z-0 pointer-events-none`}
      />

      {/* Selectable Road Choice Button */}
      <motion.button
        id={`btn-signpost-${posKey}`}
        data-pos-sign={posKey}
        type="button"
        disabled={disabled}
        onClick={onClick}
        whileHover={!disabled ? { scale: 1.03, y: -2 } : {}}
        whileTap={!disabled ? { scale: 0.96 } : {}}
        className={`group relative z-10 w-full text-left cursor-pointer select-none touch-manipulation transition-all duration-150 outline-hidden ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${isHighlighted ? 'ring-3 ' + woodThemes.glowRing + ' scale-103 z-30' : ''}`}
      >
        {/* Drop indicator tooltip on drag touch */}
        {isHighlighted && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-40 bg-amber-950 text-amber-100 font-black text-[10px] px-2 py-0.5 rounded-full shadow-md border border-amber-300 whitespace-nowrap animate-bounce">
            🎯 놓으면 선택!
          </div>
        )}

        {/* Clear Tactile Arrowhead Plaque Button */}
        <div
          className={`relative overflow-hidden rounded-lg border-2 ${woodThemes.boardBorder} bg-linear-to-r ${
            woodThemes.boardBg
          } py-2 px-2.5 shadow-sm hover:shadow-md transition-all ${woodThemes.boardShadow} ${
            isLeft ? 'pr-3.5 pl-2' : 'pl-3.5 pr-2'
          }`}
          style={{
            // Directional arrowhead cut (left points ◀, right points ▶)
            clipPath: isLeft
              ? 'polygon(12px 0%, 100% 0%, 100% 100%, 12px 100%, 0% 50%)'
              : 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)',
          }}
        >
          {/* Subtle wood texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_5px,rgba(0,0,0,0.3)_5px,rgba(0,0,0,0.3)_6px)]" />

          {/* Wooden Mounting Screws (말뚝 고정 나사) */}
          <div
            className={`absolute top-1.5 bottom-1.5 flex flex-col justify-between pointer-events-none ${
              isLeft ? 'right-1.5' : 'left-1.5'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${woodThemes.bolt} border shadow-2xs`} />
            <div className={`w-1.5 h-1.5 rounded-full ${woodThemes.bolt} border shadow-2xs`} />
          </div>

          {/* Plaque Content: Clean Hierarchy (Noun 명사 prominent, Suffix clean below) */}
          <div className={`relative z-10 flex flex-col justify-center min-h-[46px] ${isLeft ? 'pl-1' : 'pr-1'}`}>
            {/* Top row: Icon + Noun 명사 (Harmonious pairing, no competition) + Direction Arrow */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5">
                {isLeft && <ArrowLeft className={`w-3.5 h-3.5 ${woodThemes.arrowColor} shrink-0`} />}
                <div className={`p-0.5 rounded-md ${woodThemes.iconBg} shrink-0`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex items-baseline gap-1 leading-none">
                  <span className={`text-base sm:text-lg font-black tracking-tight ${woodThemes.titleText}`}>
                    {config.enName}
                  </span>
                  <span className={`text-xs font-bold ${woodThemes.krText}`}>
                    {config.krName}
                  </span>
                </div>
              </div>

              {!isLeft && (
                <ArrowRight className={`w-3.5 h-3.5 ${woodThemes.arrowColor} shrink-0 ml-1`} />
              )}
            </div>

            {/* Bottom: Clean Suffix Clue (-tion · -ment · -ness) */}
            <div className="mt-1 pt-0.5 border-t border-black/10 text-[10px] sm:text-[11px] font-medium leading-tight truncate">
              <span className={woodThemes.clueText}>
                {suffixText}
              </span>
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
