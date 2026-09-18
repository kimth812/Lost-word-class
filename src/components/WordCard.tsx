import { useState, useRef } from 'react';
import { Volume2, Move, Sparkles, Compass } from 'lucide-react';
import { motion, PanInfo } from 'motion/react';
import { WordItem, PartOfSpeech } from '../types';
import { speakEnglishWord, playClickSound } from '../utils/audio';

interface WordCardProps {
  wordItem: WordItem;
  soundEnabled: boolean;
  onDropOnPos?: (pos: PartOfSpeech) => void;
  onHoverPos?: (pos: PartOfSpeech | null) => void;
  disabled?: boolean;
}

export function WordCard({
  wordItem,
  soundEnabled,
  onDropOnPos,
  onHoverPos,
  disabled,
}: WordCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentTouchingPos, setCurrentTouchingPos] = useState<PartOfSpeech | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) playClickSound();
    speakEnglishWord(wordItem.word);
  };

  // Generous collision detection: checks if card touches or overlaps ANY signpost
  const detectTouchedSignpost = (pointerPoint?: { x: number; y: number }): PartOfSpeech | null => {
    if (!cardRef.current) return null;

    const cardRect = cardRef.current.getBoundingClientRect();
    const signposts = document.querySelectorAll<HTMLElement>('[data-pos-sign]');

    let matchedPos: PartOfSpeech | null = null;
    let highestScore = 0;

    signposts.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const pos = el.getAttribute('data-pos-sign') as PartOfSpeech | null;
      if (!pos) return;

      // Generous hitbox margin (+25px in all directions): 닿게만 해도 유효!
      const margin = 25;
      const targetBounds = {
        left: rect.left - margin,
        right: rect.right + margin,
        top: rect.top - margin,
        bottom: rect.bottom + margin,
      };

      // 1. Check card-to-signpost bounding box overlap
      const overlapX = Math.max(
        0,
        Math.min(cardRect.right, targetBounds.right) - Math.max(cardRect.left, targetBounds.left)
      );
      const overlapY = Math.max(
        0,
        Math.min(cardRect.bottom, targetBounds.bottom) - Math.max(cardRect.top, targetBounds.top)
      );
      const overlapArea = overlapX * overlapY;

      // 2. Check pointer coordinate proximity
      let pointerInside = false;
      if (pointerPoint) {
        pointerInside =
          pointerPoint.x >= targetBounds.left &&
          pointerPoint.x <= targetBounds.right &&
          pointerPoint.y >= targetBounds.top &&
          pointerPoint.y <= targetBounds.bottom;
      }

      // 3. Distance between centers
      const cardCenterX = (cardRect.left + cardRect.right) / 2;
      const cardCenterY = (cardRect.top + cardRect.bottom) / 2;
      const signCenterX = (rect.left + rect.right) / 2;
      const signCenterY = (rect.top + rect.bottom) / 2;
      const dist = Math.hypot(cardCenterX - signCenterX, cardCenterY - signCenterY);

      let score = overlapArea;
      if (pointerInside) score += 50000;
      if (overlapArea > 0 || pointerInside) {
        score += Math.max(0, 1000 - dist);
      }

      if (score > highestScore) {
        highestScore = score;
        matchedPos = pos;
      }
    });

    return matchedPos;
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const touching = detectTouchedSignpost(info.point);
    if (touching !== currentTouchingPos) {
      setCurrentTouchingPos(touching);
      onHoverPos?.(touching);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const targetPos = detectTouchedSignpost(info.point) || currentTouchingPos;

    setCurrentTouchingPos(null);
    onHoverPos?.(null);

    if (disabled || !onDropOnPos) return;

    if (targetPos) {
      onDropOnPos(targetPos);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center relative py-1">
      {/* Draggable Explorer's Map Card Container */}
      <motion.div
        ref={cardRef}
        drag={!disabled}
        dragSnapToOrigin
        dragElastic={0.4}
        onDragStart={() => setIsDragging(true)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        id="draggable-word-card"
        className={`relative w-full max-w-[290px] sm:max-w-[310px] select-none touch-manipulation cursor-grab active:cursor-grabbing transition-all ${
          isDragging ? 'z-50 scale-105 rotate-1' : 'z-20'
        }`}
      >
        {/* Left Explorer Hand Gripping Map */}
        <div className="absolute -left-5 sm:-left-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none drop-shadow-md">
          <svg width="42" height="68" viewBox="0 0 42 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Blue explorer jacket sleeve */}
            <path
              d="M0 16C0 11.5817 3.58172 8 8 8H16C18.2091 8 20 9.79086 20 12V56C20 58.2091 18.2091 60 16 60H8C3.58172 60 0 56.4183 0 52V16Z"
              fill="#2563EB"
            />
            <path d="M14 8V60" stroke="#1D4ED8" strokeWidth="2.5" />
            {/* Sleeve cuff border */}
            <rect x="14" y="10" width="6" height="48" rx="3" fill="#60A5FA" />
            {/* Explorer palm base */}
            <rect x="16" y="16" width="16" height="36" rx="8" fill="#FED7AA" />
            {/* Fingers curled behind */}
            <rect x="22" y="18" width="14" height="8" rx="4" fill="#FDBA74" />
            <rect x="23" y="27" width="14" height="8" rx="4" fill="#FDBA74" />
            <rect x="23" y="36" width="14" height="8" rx="4" fill="#FDBA74" />
            <rect x="21" y="45" width="14" height="7" rx="3.5" fill="#FDBA74" />
            {/* Thumb curled over the FRONT of the map parchment */}
            <ellipse
              cx="30"
              cy="33"
              rx="7"
              ry="11"
              transform="rotate(-15 30 33)"
              fill="#FED7AA"
              stroke="#EA580C"
              strokeWidth="1.2"
            />
            {/* Thumb nail */}
            <ellipse
              cx="32"
              cy="31"
              rx="2.5"
              ry="3.8"
              transform="rotate(-15 32 31)"
              fill="#FFFBEB"
            />
          </svg>
        </div>

        {/* Right Explorer Hand Gripping Map */}
        <div className="absolute -right-5 sm:-right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none drop-shadow-md">
          <svg width="42" height="68" viewBox="0 0 42 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Blue explorer jacket sleeve */}
            <path
              d="M42 16C42 11.5817 38.4183 8 34 8H26C23.7909 8 22 9.79086 22 12V56C22 58.2091 23.7909 60 26 60H34C38.4183 60 42 56.4183 42 52V16Z"
              fill="#2563EB"
            />
            <path d="M28 8V60" stroke="#1D4ED8" strokeWidth="2.5" />
            {/* Sleeve cuff border */}
            <rect x="22" y="10" width="6" height="48" rx="3" fill="#60A5FA" />
            {/* Explorer palm base */}
            <rect x="10" y="16" width="16" height="36" rx="8" fill="#FED7AA" />
            {/* Fingers curled behind */}
            <rect x="6" y="18" width="14" height="8" rx="4" fill="#FDBA74" />
            <rect x="5" y="27" width="14" height="8" rx="4" fill="#FDBA74" />
            <rect x="5" y="36" width="14" height="8" rx="4" fill="#FDBA74" />
            <rect x="7" y="45" width="14" height="7" rx="3.5" fill="#FDBA74" />
            {/* Thumb curled over the FRONT of the map parchment */}
            <ellipse
              cx="12"
              cy="33"
              rx="7"
              ry="11"
              transform="rotate(15 12 33)"
              fill="#FED7AA"
              stroke="#EA580C"
              strokeWidth="1.2"
            />
            {/* Thumb nail */}
            <ellipse
              cx="10"
              cy="31"
              rx="2.5"
              ry="3.8"
              transform="rotate(15 10 31)"
              fill="#FFFBEB"
            />
          </svg>
        </div>

        {/* Vintage Parchment Map Body */}
        <div
          className={`relative overflow-hidden rounded-2xl border-2 p-3.5 sm:p-4 text-center shadow-xl transition-all ${
            isDragging
              ? 'border-amber-500 shadow-2xl ring-4 ring-amber-400/70 bg-amber-50'
              : 'border-amber-700/60 bg-linear-to-b from-[#FEF9E7] via-[#FFFDF5] to-[#FDF6D8] hover:border-amber-600'
          }`}
        >
          {/* Antique Map Background Texture & Coordinates */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#D97706_1px,transparent_1px)] [background-size:12px_12px]" />
          <Compass className="absolute -right-3 -bottom-3 w-20 h-20 text-amber-900/10 pointer-events-none" />

          {/* Map Inner Stitched Border */}
          <div className="absolute inset-1.5 border border-dashed border-amber-600/30 rounded-xl pointer-events-none" />

          {/* Map Header: Explorer Compass Tag */}
          <div className="relative z-10 flex items-center justify-between px-1 mb-1">
            <div className="inline-flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-200/80 border border-amber-400/70 px-2 py-0.5 rounded-full shadow-2xs">
              <Compass className="w-3 h-3 text-amber-700" />
              <span>탐험 지도 · 길찾기 중</span>
            </div>

            <span className="text-[9px] font-mono text-amber-800/70 font-semibold tracking-wider">
              LAT 37° / LON 127°
            </span>
          </div>

          {/* Root Family Banner (어원 족보 스탬프) */}
          <div className="relative z-10 inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 border border-amber-300 rounded-md text-[11px] text-amber-950 font-extrabold my-1 shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>뿌리: {wordItem.rootName}</span>
          </div>

          {/* Target Word in Map Center */}
          <div className="relative z-10 flex items-center justify-center gap-2 my-1">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif drop-shadow-xs break-all">
              {wordItem.word}
            </h2>

            <button
              id="btn-speak-word"
              type="button"
              onClick={handleSpeak}
              title="원어민 발음 듣기"
              className="p-1.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-950 transition-transform active:scale-90 shrink-0 shadow-2xs"
              aria-label="발음 듣기"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Visual Instruction Cue */}
          <div className="relative z-10 flex items-center justify-center gap-1 text-[11px] text-amber-900 font-bold mt-1">
            <Move className="w-3.5 h-3.5 text-amber-700 animate-bounce shrink-0" />
            <span>
              {isDragging && currentTouchingPos ? (
                <strong className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  표지판에 닿음! 손을 놓으세요 🎯
                </strong>
              ) : (
                '지도를 들고 원하는 표지판에 닿게 놓으세요!'
              )}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
