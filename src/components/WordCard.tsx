import { useState, useRef } from 'react';
import { Volume2, Move } from 'lucide-react';
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

      // Generous hitbox margin (+25px in all directions): 닿기만 해도 유효!
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
        className={`relative w-full max-w-[285px] sm:max-w-[315px] select-none touch-manipulation cursor-grab active:cursor-grabbing transition-all ${
          isDragging ? 'z-50 scale-105 rotate-1' : 'z-20'
        }`}
      >
        {/* ====================================================================== */}
        {/* Hands: Just ONE Circle (동그라미 하나만! 손가락 없음)                  */}
        {/* ====================================================================== */}

        {/* Left Arm & Hand: 소매 위치는 고정하고 손 동그라미를 소매 중심에 맞춰 바깥쪽으로 이동 */}
        <div className="absolute -left-5 sm:-left-6 -bottom-3 w-20 sm:w-22 h-20 pointer-events-none z-30 drop-shadow-md">
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Hand circle: drawn first (underneath the sleeve, moved outward from cx=50 to cx=43) */}
            <circle cx="43" cy="35" r="12" fill="#FED7AA" stroke="#FED7AA" />

            {/* Grey arm sleeve angled inward directly towards the hand (고정) */}
            <path d="M8 80 L34 32 L52 42 L28 80 Z" fill="#94A3B8" />
            <path d="M12 80 L36 34 L48 40 L22 80 Z" fill="#CBD5E1" />
            {/* Ribbed sleeve cuff overlapping the base of the hand */}
            <path d="M32 31 L52 42 L48 48 L28 37 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Right Arm & Hand: 소매 위치는 고정하고 손 동그라미를 소매 중심에 맞춰 바깥쪽으로 이동 */}
        <div className="absolute -right-5 sm:-right-6 -bottom-3 w-20 sm:w-22 h-20 pointer-events-none z-30 drop-shadow-md">
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Hand circle: drawn first (underneath the sleeve, moved outward from cx=30 to cx=37) */}
            <circle cx="37" cy="35" r="12" fill="#FED7AA" stroke="#FED7AA" />

            {/* Grey arm sleeve angled inward directly towards the hand (고정) */}
            <path d="M72 80 L46 32 L28 42 L52 80 Z" fill="#94A3B8" />
            <path d="M68 80 L44 34 L32 40 L58 80 Z" fill="#CBD5E1" />
            {/* Ribbed sleeve cuff overlapping the base of the hand */}
            <path d="M48 31 L28 42 L32 48 L52 37 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.2" />
          </svg>
        </div>

        {/* ====================================================================== */}
        {/* Folded Map Shape: 6-Panel Accordion Silhouette (6칸으로 나뉜 지도)    */}
        {/* ====================================================================== */}
        <div
          className={`relative overflow-hidden py-3 px-3.5 sm:px-4 text-center shadow-lg transition-all ${
            isDragging
              ? 'bg-[#FEF5E7] shadow-2xl ring-3 ring-amber-400/80 scale-102'
              : 'bg-linear-to-b from-[#FFFDF8] via-[#FAF4E5] to-[#F5EAD2]'
          }`}
          style={{
            // 6-fold accordion folded map silhouette (6칸 지그재그 부채꼴 지도 테두리)
            clipPath:
              'polygon(0% 2.5%, 16.67% 0%, 33.33% 2.5%, 50% 0%, 66.67% 2.5%, 83.33% 0%, 100% 2.5%, 100% 97.5%, 83.33% 100%, 66.67% 97.5%, 50% 100%, 33.33% 97.5%, 16.67% 100%, 0% 97.5%)',
          }}
        >
          {/* 6-Fold Map Creases: 6 equal vertical panels with alternating fold lighting (6칸 나뉨) */}
          <div className="absolute inset-0 flex pointer-events-none">
            {/* Panel 1 (0% ~ 16.67%) */}
            <div className="w-[16.666%] h-full border-r border-amber-900/10 bg-white/10" />
            {/* Panel 2 (16.67% ~ 33.33%) */}
            <div className="w-[16.666%] h-full border-r border-amber-900/10 bg-amber-950/[0.04]" />
            {/* Panel 3 (33.33% ~ 50.00%) */}
            <div className="w-[16.666%] h-full border-r border-amber-900/10 bg-white/10" />
            {/* Panel 4 (50.00% ~ 66.67%) */}
            <div className="w-[16.666%] h-full border-r border-amber-900/10 bg-amber-950/[0.04]" />
            {/* Panel 5 (66.67% ~ 83.33%) */}
            <div className="w-[16.666%] h-full border-r border-amber-900/10 bg-white/10" />
            {/* Panel 6 (83.33% ~ 100%) */}
            <div className="w-[16.67%] h-full bg-amber-950/[0.04]" />
          </div>

          {/* Paper Edge Border */}
          <div className="absolute inset-0 border-2 border-[#9C7A4E]/50 pointer-events-none" />

          {/* Target Content */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* 1. THE HERO: Current English Word */}
            <div className="flex items-center justify-center gap-2 mt-0.5 mb-1 max-w-full">
              <h2 className="text-2xl sm:text-3xl font-black text-[#26170A] tracking-tight font-serif drop-shadow-2xs break-all leading-tight">
                {wordItem.word}
              </h2>

              {/* TTS Speaker Audio Button */}
              <button
                id="btn-speak-word"
                type="button"
                onClick={handleSpeak}
                title="원어민 발음 듣기"
                className="p-1.5 rounded-full bg-[#E8D2AA]/80 hover:bg-[#DCBE8C] text-[#3D250C] transition-transform active:scale-90 shrink-0 shadow-2xs cursor-pointer"
                aria-label="발음 듣기"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* 2. 어근 정보 */}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#E8DAC2]/80 border border-[#BFA782]/70 rounded-full text-[11px] text-[#4A3215] font-bold shadow-2xs my-0.5">
              <span>어근 · <strong>{wordItem.rootName}</strong></span>
            </div>

            {/* 3. Action Cue */}
            <div className="flex items-center justify-center gap-1 text-[10.5px] font-medium text-[#7A552C] mt-1">
              <Move className="w-3 h-3 text-[#A86F2C] animate-bounce shrink-0" />
              <span>
                {isDragging && currentTouchingPos ? (
                  <strong className="text-amber-950 bg-amber-300/80 px-2 py-0.5 rounded font-black">
                    표지판에 닿음! 손을 놓으세요 🎯
                  </strong>
                ) : (
                  '표지판을 누르거나 지도를 대어보세요'
                )}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
