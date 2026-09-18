export function CharacterIllustration({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Soft background halo */}
        <circle cx="100" cy="100" r="88" fill="#FEF3C7" fillOpacity="0.7" />
        <circle cx="100" cy="100" r="86" stroke="#FDE68A" strokeWidth="2" strokeDasharray="6 4" />

        {/* Signpost stick */}
        <rect x="150" y="80" width="8" height="90" rx="4" fill="#78350F" />
        {/* Signpost plates */}
        <path d="M125 78H175L185 86L175 94H125V78Z" fill="#10B981" />
        <text x="148" y="88" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">NOUN</text>

        <path d="M175 102H125L115 110L125 118H175V102Z" fill="#F59E0B" />
        <text x="150" y="112" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">VERB</text>

        {/* Character Ground Shadow */}
        <ellipse cx="88" cy="170" rx="35" ry="8" fill="#E2E8F0" />

        {/* Adventurer Backpack */}
        <rect x="52" y="105" width="22" height="32" rx="7" fill="#EA580C" />
        <rect x="55" y="112" width="16" height="8" rx="3" fill="#C2410C" />

        {/* Body (Explorer Jacket) */}
        <rect x="66" y="98" width="46" height="48" rx="14" fill="#3B82F6" />
        {/* Jacket zipper & collar */}
        <line x1="89" y1="98" x2="89" y2="146" stroke="#1D4ED8" strokeWidth="3" />
        <path d="M78 98L89 110L100 98" fill="#60A5FA" />

        {/* Explorer Hat */}
        <ellipse cx="89" cy="58" rx="42" ry="12" fill="#D97706" />
        <path d="M64 56C64 42 74 32 89 32C104 32 114 42 114 56Z" fill="#B45309" />
        <rect x="64" y="52" width="50" height="5" fill="#78350F" />
        {/* Hat badge */}
        <circle cx="89" cy="46" r="4" fill="#FBBF24" />

        {/* Face */}
        <circle cx="89" cy="74" r="23" fill="#FED7AA" />

        {/* Cute blush */}
        <ellipse cx="74" cy="80" rx="4" ry="2.5" fill="#FCA5A5" />
        <ellipse cx="104" cy="80" rx="4" ry="2.5" fill="#FCA5A5" />

        {/* Eyes (Determined, curious) */}
        <circle cx="79" cy="73" r="3.5" fill="#1E293B" />
        <circle cx="80" cy="71.5" r="1.2" fill="white" />
        <circle cx="99" cy="73" r="3.5" fill="#1E293B" />
        <circle cx="100" cy="71.5" r="1.2" fill="white" />

        {/* Confident Smile */}
        <path d="M83 83C85 86 93 86 95 83" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />

        {/* Explorer's Compass & Map in Hand */}
        {/* Left hand holding rolled map */}
        <rect x="58" y="125" width="10" height="24" rx="4" transform="rotate(-25 58 125)" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
        <circle cx="68" cy="128" r="6" fill="#FED7AA" />

        {/* Right hand holding compass */}
        <circle cx="112" cy="126" r="6" fill="#FED7AA" />
        <circle cx="120" cy="130" r="11" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
        <circle cx="120" cy="130" r="8" fill="#F8FAFC" />
        {/* Compass needle */}
        <polygon points="120,123 122,130 118,130" fill="#EF4444" />
        <polygon points="120,137 122,130 118,130" fill="#3B82F6" />
        <circle cx="120" cy="130" r="2" fill="#1E293B" />

        {/* Legs & Explorer Boots */}
        <rect x="74" y="142" width="12" height="22" rx="4" fill="#1E293B" />
        <rect x="92" y="142" width="12" height="22" rx="4" fill="#1E293B" />
        {/* Boots */}
        <path d="M72 160H88C90 160 90 168 86 168H70C68 168 68 160 72 160Z" fill="#92400E" />
        <path d="M90 160H106C108 160 108 168 104 168H88C86 168 86 160 90 160Z" fill="#92400E" />
      </svg>
    </div>
  );
}
