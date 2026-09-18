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

        {/* Small wood signpost in background */}
        <rect x="156" y="80" width="6" height="90" rx="3" fill="#8D5B34" />
        <path d="M135 78H175L183 85L175 92H135V78Z" fill="#B8864E" />
        <text x="154" y="86.5" fill="#FFFDF5" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">NOUN</text>

        <path d="M175 98H135L127 105L135 112H175V98Z" fill="#654321" />
        <text x="154" y="106.5" fill="#FFFDF5" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">VERB</text>

        {/* Floating lost/confused question marks (길 잃음 표현) */}
        <g className="animate-bounce">
          <text x="50" y="52" fill="#D97706" fontSize="18" fontWeight="900" fontFamily="sans-serif">?</text>
          <text x="135" y="45" fill="#D97706" fontSize="16" fontWeight="900" fontFamily="sans-serif">?</text>
        </g>

        {/* Character Ground Shadow */}
        <ellipse cx="90" cy="172" rx="36" ry="8" fill="#E2E8F0" />

        {/* Adventurer Backpack behind body */}
        <rect x="54" y="106" width="20" height="30" rx="6" fill="#A855F7" />
        <rect x="56" y="112" width="16" height="8" rx="2" fill="#7E22CE" />

        {/* Body (Explorer Jacket) */}
        <rect x="68" y="100" width="44" height="46" rx="14" fill="#2563EB" />
        <line x1="90" y1="100" x2="90" y2="146" stroke="#1D4ED8" strokeWidth="2.5" />
        <path d="M80 100L90 110L100 100" fill="#60A5FA" />

        {/* Legs & Explorer Boots */}
        <rect x="76" y="142" width="11" height="22" rx="4" fill="#334155" />
        <rect x="93" y="142" width="11" height="22" rx="4" fill="#334155" />
        {/* Boots */}
        <path d="M73 161H88C90 161 90 168 86 168H71C69 168 70 161 73 161Z" fill="#78350F" />
        <path d="M91 161H106C108 161 108 168 104 168H89C87 168 88 161 91 161Z" fill="#78350F" />

        {/* Neck */}
        <rect x="85" y="90" width="10" height="12" rx="3" fill="#FED7AA" />

        {/* Head Base (Face) */}
        <circle cx="90" cy="74" r="23" fill="#FED7AA" />

        {/* Blushing cheeks from embarrassment/confusion */}
        <ellipse cx="76" cy="80" rx="4.5" ry="3" fill="#F87171" fillOpacity="0.6" />
        <ellipse cx="104" cy="80" rx="4.5" ry="3" fill="#F87171" fillOpacity="0.6" />

        {/* Worried / Perplexed Eyebrows (팔(八)자 곤란한 눈썹) */}
        <path d="M74 65 Q79 61 84 66" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M106 65 Q101 61 96 66" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Lost / Flustered Teardrop Eyes (동공 지진 & 난감한 눈) */}
        {/* Left eye: wide round with worried highlight */}
        <circle cx="79" cy="74" r="4.5" fill="#1E293B" />
        <circle cx="78" cy="72" r="1.5" fill="white" />
        <circle cx="81" cy="76" r="0.8" fill="white" />

        {/* Right eye: wide round with worried highlight */}
        <circle cx="101" cy="74" r="4.5" fill="#1E293B" />
        <circle cx="100" cy="72" r="1.5" fill="white" />
        <circle cx="103" cy="76" r="0.8" fill="white" />

        {/* Wavy / Trembling Troubled Mouth (어쩔 줄 몰라 삐뚤어진 입) */}
        <path
          d="M83 85 Q86 83 89 86 Q93 89 97 84"
          stroke="#9A3412"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Nervous Sweat Drop (삐질 땀방울 💧) */}
        <path
          d="M109 68 C109 68 114 74 114 77 C114 80 111.5 82 109 82 C106.5 82 104 80 104 77 C104 74 109 68 109 68 Z"
          fill="#38BDF8"
          stroke="#0284C7"
          strokeWidth="1"
        />
        <circle cx="108" cy="76" r="1" fill="white" />

        {/* EXPLORER HAT - RENDERED IN FRONT OF HEAD! (모자가 얼굴/머리 앞으로 덮어씌워짐) */}
        {/* Hat shadow on forehead */}
        <ellipse cx="90" cy="62" rx="22" ry="4" fill="#78350F" fillOpacity="0.25" />

        {/* Hat Crown (모자 윗부분) */}
        <path d="M68 56 C68 40 78 30 90 30 C102 30 112 40 112 56 Z" fill="#D97706" />
        {/* Hat Crown highlight/shadow */}
        <path d="M72 52 C73 43 80 34 90 32" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Hat Ribbon Band */}
        <rect x="68" y="52" width="44" height="6" fill="#78350F" />
        {/* Explorer Hat Compass Badge */}
        <circle cx="90" cy="55" r="4.5" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
        <polygon points="90,52 91.5,55 90,58 88.5,55" fill="#EF4444" />

        {/* Hat Brim (앞으로 튀어나온 챙 - 머리 앞으로 덮임) */}
        <ellipse cx="90" cy="58" rx="38" ry="10" fill="#B45309" />
        <ellipse cx="90" cy="57" rx="36" ry="8.5" fill="#D97706" />

        {/* Arms & Hands (캐릭터가 지도를 들고 머리를 긁적이며 길을 찾는 모습) */}
        {/* Left hand scratching head/hat in confusion */}
        <path d="M68 108 L55 90 L65 74" stroke="#2563EB" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="65" cy="74" r="6" fill="#FED7AA" />

        {/* Right arm reaching forward */}
        <path d="M112 110 L122 120" stroke="#2563EB" strokeWidth="8" strokeLinecap="round" />

        {/* Folded Map Paper in character's hand (나침반 대신 지도를 들고 있음) */}
        <g transform="translate(117, 105) rotate(14)">
          {/* 3-panel folded paper map */}
          <polygon
            points="0,3 9,0 18,3 27,0 27,24 18,27 9,24 0,27"
            fill="#FFFDF7"
            stroke="#9C7A4E"
            strokeWidth="1.2"
          />
          {/* Paper creases */}
          <line x1="9" y1="0" x2="9" y2="24" stroke="#D97706" strokeWidth="0.8" strokeOpacity="0.4" />
          <line x1="18" y1="3" x2="18" y2="27" stroke="#D97706" strokeWidth="0.8" strokeOpacity="0.4" />
          {/* Mini trail line on map */}
          <path d="M4 14 Q10 18 15 12 T23 18" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="1.5 1.5" fill="none" />
          <text x="21" y="20" fill="#DC2626" fontSize="5" fontWeight="bold" fontFamily="sans-serif">✕</text>
        </g>
      </svg>
    </div>
  );
}
