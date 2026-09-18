import { useState } from 'react';
import { PartOfSpeech, WordItem } from '../types';
import { CrossroadSignpost } from './CrossroadSignpost';
import { WordCard } from './WordCard';

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
    <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between h-full select-none">
      {/* Crossroads Visual Stage: Fills vertical space with generous immersion */}
      <div className="relative w-full flex-1 flex flex-col justify-between min-h-[440px] sm:min-h-[480px] rounded-2xl bg-linear-to-b from-[#FAF5EB] via-[#F4EDE0] to-[#FAF5EB] p-3 sm:p-4 border border-stone-300/70 shadow-sm overflow-hidden">
        {/* SVG Crossroads Trails: 4 distinct roads connecting central map to the 4 signposts */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 400 480"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Center Crossroads clearing glow */}
            <radialGradient id="crossroadCenter" cx="50%" cy="50%" r="48%">
              <stop offset="0%" stopColor="#EFE1C9" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#E4D2B5" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FAF5EB" stopOpacity="0" />
            </radialGradient>

            {/* Earthy dirt road trail gradients */}
            <linearGradient id="roadNoun" x1="50%" y1="50%" x2="16%" y2="10%">
              <stop offset="0%" stopColor="#D5C2A4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#B09774" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="roadVerb" x1="50%" y1="50%" x2="84%" y2="10%">
              <stop offset="0%" stopColor="#CCA36B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#A97D41" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="roadAdj" x1="50%" y1="50%" x2="16%" y2="90%">
              <stop offset="0%" stopColor="#9B7047" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#764C26" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="roadAdv" x1="50%" y1="50%" x2="84%" y2="90%">
              <stop offset="0%" stopColor="#6B4B2E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#472A11" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Center crossroads ground clearing */}
          <circle cx="200" cy="240" r="130" fill="url(#crossroadCenter)" />

          {/* Road 1: Top-Left (Noun Road) */}
          <line
            x1="200"
            y1="240"
            x2="65"
            y2="55"
            stroke="url(#roadNoun)"
            strokeWidth={activeHoverRoad === 'noun' ? '32' : '22'}
            strokeLinecap="round"
            className="transition-all duration-200"
          />
          <line
            x1="200"
            y1="240"
            x2="65"
            y2="55"
            stroke="#947854"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            strokeLinecap="round"
            strokeOpacity={activeHoverRoad === 'noun' ? '0.9' : '0.45'}
          />

          {/* Road 2: Top-Right (Verb Road) */}
          <line
            x1="200"
            y1="240"
            x2="335"
            y2="55"
            stroke="url(#roadVerb)"
            strokeWidth={activeHoverRoad === 'verb' ? '32' : '22'}
            strokeLinecap="round"
            className="transition-all duration-200"
          />
          <line
            x1="200"
            y1="240"
            x2="335"
            y2="55"
            stroke="#754E20"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            strokeLinecap="round"
            strokeOpacity={activeHoverRoad === 'verb' ? '0.9' : '0.45'}
          />

          {/* Road 3: Bottom-Left (Adjective Road) */}
          <line
            x1="200"
            y1="240"
            x2="65"
            y2="425"
            stroke="url(#roadAdj)"
            strokeWidth={activeHoverRoad === 'adjective' ? '32' : '22'}
            strokeLinecap="round"
            className="transition-all duration-200"
          />
          <line
            x1="200"
            y1="240"
            x2="65"
            y2="425"
            stroke="#4F2D13"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            strokeLinecap="round"
            strokeOpacity={activeHoverRoad === 'adjective' ? '0.9' : '0.45'}
          />

          {/* Road 4: Bottom-Right (Adverb Road) */}
          <line
            x1="200"
            y1="240"
            x2="335"
            y2="425"
            stroke="url(#roadAdv)"
            strokeWidth={activeHoverRoad === 'adverb' ? '32' : '22'}
            strokeLinecap="round"
            className="transition-all duration-200"
          />
          <line
            x1="200"
            y1="240"
            x2="335"
            y2="425"
            stroke="#2D1808"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            strokeLinecap="round"
            strokeOpacity={activeHoverRoad === 'adverb' ? '0.9' : '0.45'}
          />

          {/* Directional intersection compass ring */}
          <circle cx="200" cy="240" r="64" stroke="#CBB99C" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.6" />
        </svg>

        {/* Top Row: Two Primary Selectable Signposts (명사 & 동사) */}
        <div className="grid grid-cols-2 gap-2.5 relative z-10 pt-0.5">
          <div
            onMouseEnter={() => setActiveHoverRoad('noun')}
            onMouseLeave={() => setActiveHoverRoad(null)}
          >
            <CrossroadSignpost
              posKey="noun"
              direction="left"
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
              isHighlighted={activeHoverRoad === 'verb'}
              disabled={disabled}
              onClick={() => onSelectPos('verb')}
            />
          </div>
        </div>

        {/* Center: The Word Card (The Hero protagonist at the crossroads) */}
        <div className="relative z-20 my-auto py-2">
          <WordCard
            wordItem={wordItem}
            soundEnabled={soundEnabled}
            onDropOnPos={onSelectPos}
            onHoverPos={setActiveHoverRoad}
            disabled={disabled}
          />
        </div>

        {/* Bottom Row: Two Primary Selectable Signposts (형용사 & 부사) */}
        <div className="grid grid-cols-2 gap-2.5 relative z-10 pb-0.5">
          <div
            onMouseEnter={() => setActiveHoverRoad('adjective')}
            onMouseLeave={() => setActiveHoverRoad(null)}
          >
            <CrossroadSignpost
              posKey="adjective"
              direction="left"
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
              isHighlighted={activeHoverRoad === 'adverb'}
              disabled={disabled}
              onClick={() => onSelectPos('adverb')}
            />
          </div>
        </div>
      </div>

      {/* Bottom Subordinate Action: Quiet Next Skip Link */}
      <div className="w-full flex justify-center py-2 shrink-0">
        <button
          id="btn-next-skip"
          type="button"
          disabled={disabled}
          onClick={onSkip}
          className="text-stone-500 hover:text-stone-800 text-xs py-1.5 px-3.5 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-200/50"
        >
          <span>길을 모르겠다면?</span>
          <span className="font-semibold text-stone-700 underline underline-offset-2">Next →</span>
        </button>
      </div>
    </div>
  );
}
