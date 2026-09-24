import React from 'react';
import { Card } from '../types/poker';

interface CardSvgProps {
  card: Card;
  isHeld: boolean;
  isWinning: boolean;
  onClick?: () => void;
  canHold: boolean;
}

export const CardSvg: React.FC<CardSvgProps> = ({
  card,
  isHeld,
  isWinning,
  onClick,
  canHold,
}) => {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  // Neon color profiles matching DOGECASINO reference
  const primaryColor = isRed ? '#ff2a6d' : '#00f0ff';
  const secondaryColor = isRed ? '#ff6584' : '#7000ff';
  const glowFilter = isRed ? 'drop-shadow(0 0 8px rgba(255, 42, 109, 0.85)) drop-shadow(0 0 16px rgba(255, 42, 109, 0.45))' : 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.85)) drop-shadow(0 0 16px rgba(0, 240, 255, 0.45))';

  // Intricate SVG Suit Paths
  const renderSuitIcon = (x: number, y: number, size = 18, color = primaryColor) => {
    switch (card.suit) {
      case 'hearts':
        return (
          <path
            d={`M ${x} ${y + size * 0.3} 
               C ${x} ${y - size * 0.2}, ${x + size * 0.5} ${y - size * 0.3}, ${x + size * 0.5} ${y + size * 0.15} 
               C ${x + size * 0.5} ${y + size * 0.4}, ${x} ${y + size * 0.8}, ${x} ${y + size * 0.9} 
               C ${x} ${y + size * 0.8}, ${x - size * 0.5} ${y + size * 0.4}, ${x - size * 0.5} ${y + size * 0.15} 
               C ${x - size * 0.5} ${y - size * 0.3}, ${x} ${y - size * 0.2}, ${x} ${y + size * 0.3} Z`}
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'diamonds':
        return (
          <path
            d={`M ${x} ${y - size * 0.5} 
               L ${x + size * 0.42} ${y} 
               L ${x} ${y + size * 0.5} 
               L ${x - size * 0.42} ${y} Z`}
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'clubs':
        return (
          <g>
            {/* Top lobe */}
            <circle cx={x} cy={y - size * 0.18} r={size * 0.24} fill="none" stroke={color} strokeWidth="1.6" />
            {/* Left lobe */}
            <circle cx={x - size * 0.24} cy={y + size * 0.12} r={size * 0.24} fill="none" stroke={color} strokeWidth="1.6" />
            {/* Right lobe */}
            <circle cx={x + size * 0.24} cy={y + size * 0.12} r={size * 0.24} fill="none" stroke={color} strokeWidth="1.6" />
            {/* Stem */}
            <path
              d={`M ${x - size * 0.08} ${y + size * 0.18} L ${x - size * 0.15} ${y + size * 0.55} L ${x + size * 0.15} ${y + size * 0.55} L ${x + size * 0.08} ${y + size * 0.18}`}
              fill="none"
              stroke={color}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </g>
        );
      case 'spades':
      default:
        return (
          <g>
            <path
              d={`M ${x} ${y - size * 0.55} 
                 C ${x + size * 0.45} ${y - size * 0.15}, ${x + size * 0.5} ${y + size * 0.25}, ${x} ${y + size * 0.25} 
                 C ${x - size * 0.5} ${y + size * 0.25}, ${x - size * 0.45} ${y - size * 0.15}, ${x} ${y - size * 0.55} Z`}
              fill="none"
              stroke={color}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Stem */}
            <path
              d={`M ${x - size * 0.08} ${y + size * 0.22} L ${x - size * 0.16} ${y + size * 0.55} L ${x + size * 0.16} ${y + size * 0.55} L ${x + size * 0.08} ${y + size * 0.22}`}
              fill="none"
              stroke={color}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </g>
        );
    }
  };

  // Render intricate center court/ace/number artwork matching the prompt's glowing line art
  const renderCardCenter = () => {
    // 1. Jack: Intricate double-headed Cyber Knight
    if (card.rank === 'J') {
      return (
        <g stroke={primaryColor} strokeWidth="1.3" fill="none" opacity="0.95">
          {/* Inner frame */}
          <rect x="36" y="58" width="108" height="154" rx="4" stroke={primaryColor} strokeWidth="1" strokeDasharray="3 2" />
          
          {/* Top Half of Jack */}
          {/* Head & Cyber Helmet */}
          <path d="M 80 82 L 100 82 L 104 98 L 76 98 Z" />
          <path d="M 82 82 L 90 70 L 98 82" />
          {/* Visor */}
          <line x1="82" y1="90" x2="98" y2="90" stroke={primaryColor} strokeWidth="2" />
          {/* Armor Chest & Collar */}
          <path d="M 72 102 L 90 108 L 108 102 L 116 122 L 64 122 Z" />
          <path d="M 64 122 L 90 134 L 116 122" />
          {/* Scepter / Halberd */}
          <line x1="56" y1="72" x2="56" y2="135" stroke={primaryColor} strokeWidth="1.6" />
          <path d="M 50 78 L 56 66 L 62 78 Z" />
          <line x1="48" y1="78" x2="64" y2="78" />
          {/* Cybernetic geometric lines */}
          <line x1="74" y1="112" x2="84" y2="124" />
          <line x1="106" y1="112" x2="96" y2="124" />

          {/* Symmetrical Center Divider */}
          <line x1="40" y1="135" x2="140" y2="135" stroke={primaryColor} strokeWidth="1.2" strokeDasharray="4 3" />

          {/* Inverted Bottom Half */}
          <g transform="rotate(180 90 135)">
            <path d="M 80 82 L 100 82 L 104 98 L 76 98 Z" />
            <path d="M 82 82 L 90 70 L 98 82" />
            <line x1="82" y1="90" x2="98" y2="90" stroke={primaryColor} strokeWidth="2" />
            <path d="M 72 102 L 90 108 L 108 102 L 116 122 L 64 122 Z" />
            <path d="M 64 122 L 90 134 L 116 122" />
            <line x1="56" y1="72" x2="56" y2="135" stroke={primaryColor} strokeWidth="1.6" />
            <path d="M 50 78 L 56 66 L 62 78 Z" />
          </g>

          {/* Miniature suit stamps inside court frame */}
          {renderSuitIcon(56, 126, 12, primaryColor)}
          {renderSuitIcon(124, 144, 12, primaryColor)}
        </g>
      );
    }

    // 2. Queen: Intricate Cyber Matriarch
    if (card.rank === 'Q') {
      return (
        <g stroke={primaryColor} strokeWidth="1.3" fill="none" opacity="0.95">
          <rect x="36" y="58" width="108" height="154" rx="4" stroke={primaryColor} strokeWidth="1" strokeDasharray="3 2" />
          {/* Crown */}
          <path d="M 76 78 L 82 66 L 90 76 L 98 66 L 104 78 Z" />
          <line x1="76" y1="78" x2="104" y2="78" />
          {/* Cyber Visage */}
          <path d="M 80 80 L 100 80 L 96 98 L 84 98 Z" />
          <line x1="84" y1="88" x2="96" y2="88" stroke={primaryColor} strokeWidth="1.8" />
          {/* Royal Scepter with Flower/Rose */}
          <line x1="124" y1="74" x2="124" y2="134" stroke={primaryColor} strokeWidth="1.5" />
          <circle cx="124" cy="70" r="6" />
          {/* Ornate robes */}
          <path d="M 70 102 L 90 108 L 110 102 L 120 128 L 60 128 Z" />
          <line x1="40" y1="135" x2="140" y2="135" strokeDasharray="4 3" />
          {/* Inverted Half */}
          <g transform="rotate(180 90 135)">
            <path d="M 76 78 L 82 66 L 90 76 L 98 66 L 104 78 Z" />
            <path d="M 80 80 L 100 80 L 96 98 L 84 98 Z" />
            <path d="M 70 102 L 90 108 L 110 102 L 120 128 L 60 128 Z" />
            <line x1="124" y1="74" x2="124" y2="134" strokeWidth="1.5" />
            <circle cx="124" cy="70" r="6" />
          </g>
          {renderSuitIcon(62, 126, 12, primaryColor)}
          {renderSuitIcon(118, 144, 12, primaryColor)}
        </g>
      );
    }

    // 3. King: Cyber Emperor with Crown and Broadsword
    if (card.rank === 'K') {
      return (
        <g stroke={primaryColor} strokeWidth="1.3" fill="none" opacity="0.95">
          <rect x="36" y="58" width="108" height="154" rx="4" stroke={primaryColor} strokeWidth="1" strokeDasharray="3 2" />
          {/* King Crown */}
          <path d="M 72 76 L 78 62 L 90 72 L 102 62 L 108 76 Z" />
          <circle cx="90" cy="62" r="3" />
          {/* Bearded cyber face */}
          <path d="M 78 78 L 102 78 L 98 94 L 90 100 L 82 94 Z" />
          <line x1="82" y1="86" x2="98" y2="86" stroke={primaryColor} strokeWidth="2" />
          {/* Royal Broadsword */}
          <line x1="54" y1="62" x2="54" y2="134" stroke={primaryColor} strokeWidth="2" />
          <line x1="46" y1="74" x2="62" y2="74" strokeWidth="2" />
          {/* Heavy Pauldrons */}
          <path d="M 66 102 L 90 108 L 114 102 L 124 130 L 56 130 Z" />
          <line x1="40" y1="135" x2="140" y2="135" strokeDasharray="4 3" />
          {/* Inverted Half */}
          <g transform="rotate(180 90 135)">
            <path d="M 72 76 L 78 62 L 90 72 L 102 62 L 108 76 Z" />
            <path d="M 78 78 L 102 78 L 98 94 L 90 100 L 82 94 Z" />
            <line x1="54" y1="62" x2="54" y2="134" strokeWidth="2" />
            <line x1="46" y1="74" x2="62" y2="74" strokeWidth="2" />
            <path d="M 66 102 L 90 108 L 114 102 L 124 130 L 56 130 Z" />
          </g>
          {renderSuitIcon(122, 126, 12, primaryColor)}
          {renderSuitIcon(58, 144, 12, primaryColor)}
        </g>
      );
    }

    // 4. Ace: Giant ornate cyber insignia
    if (card.rank === 'A') {
      return (
        <g>
          {/* Center giant ornate suit with fractal circuit lines */}
          <g transform="scale(1.9) translate(-43, -26)">
            {renderSuitIcon(70, 85, 34, primaryColor)}
          </g>
          {/* Geometric cyber brackets around Ace */}
          <circle cx="90" cy="135" r="46" stroke={primaryColor} strokeWidth="0.8" strokeDasharray="4 4" fill="none" opacity="0.6" />
          <circle cx="90" cy="135" r="54" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="2 6" fill="none" opacity="0.4" />
          {/* Diamond telemetry marks */}
          <polygon points="90,72 93,75 90,78 87,75" fill={primaryColor} opacity="0.8" />
          <polygon points="90,192 93,195 90,198 87,195" fill={primaryColor} opacity="0.8" />
          <polygon points="30,135 33,132 36,135 33,138" fill={primaryColor} opacity="0.8" />
          <polygon points="150,135 147,132 144,135 147,138" fill={primaryColor} opacity="0.8" />
        </g>
      );
    }

    // 5. 10: As featured on image 1 (two columns of 4 plus 2 center)
    if (card.rank === '10') {
      return (
        <g>
          {/* Left column */}
          {renderSuitIcon(62, 75, 18, primaryColor)}
          {renderSuitIcon(62, 115, 18, primaryColor)}
          {renderSuitIcon(62, 155, 18, primaryColor)}
          {renderSuitIcon(62, 195, 18, primaryColor)}
          {/* Right column */}
          {renderSuitIcon(118, 75, 18, primaryColor)}
          {renderSuitIcon(118, 115, 18, primaryColor)}
          {renderSuitIcon(118, 155, 18, primaryColor)}
          {renderSuitIcon(118, 195, 18, primaryColor)}
          {/* Center column */}
          {renderSuitIcon(90, 95, 18, primaryColor)}
          {renderSuitIcon(90, 175, 18, primaryColor)}
        </g>
      );
    }

    // 6. Generic numbered cards (2 - 9)
    const count = card.value;
    const positions: [number, number][] = [];
    if (count === 2) positions.push([90, 90], [90, 180]);
    else if (count === 3) positions.push([90, 85], [90, 135], [90, 185]);
    else if (count === 4) positions.push([65, 85], [115, 85], [65, 185], [115, 185]);
    else if (count === 5) positions.push([65, 85], [115, 85], [90, 135], [65, 185], [115, 185]);
    else if (count === 6) positions.push([65, 85], [115, 85], [65, 135], [115, 135], [65, 185], [115, 185]);
    else if (count === 7) positions.push([65, 85], [115, 85], [90, 110], [65, 135], [115, 135], [65, 185], [115, 185]);
    else if (count === 8) positions.push([65, 80], [115, 80], [90, 110], [65, 135], [115, 135], [90, 160], [65, 190], [115, 190]);
    else if (count === 9) positions.push([65, 80], [115, 80], [65, 115], [115, 115], [90, 135], [65, 155], [115, 155], [65, 190], [115, 190]);

    return (
      <g>
        {positions.map(([px, py], i) => (
          <React.Fragment key={i}>
            {renderSuitIcon(px, py, 20, primaryColor)}
          </React.Fragment>
        ))}
      </g>
    );
  };

  return (
    <div
      onClick={canHold ? onClick : undefined}
      className={`relative flex flex-col items-center select-none transition-all duration-200 ${
        canHold ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'
      }`}
    >
      {/* Upper Yellow Glowing [ HELD ] Indicator (as in image) */}
      <div
        className={`h-7 flex items-center justify-center font-mono font-bold text-xs tracking-wider transition-opacity duration-200 ${
          isHeld ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          color: '#ffe600',
          textShadow: '0 0 8px #ffe600, 0 0 16px #ffbe0b, 0 0 24px #ffd166',
        }}
      >
        [ HELD ]
      </div>

      {/* Holographic Glowing Card Container */}
      <div
        className={`relative w-[130px] sm:w-[155px] md:w-[172px] h-[195px] sm:h-[235px] md:h-[260px] rounded-xl transition-all duration-300 ${
          isWinning ? 'ring-2 ring-yellow-400 scale-[1.04]' : ''
        } ${isHeld ? 'translate-y-[-4px]' : ''}`}
        style={{
          perspective: '1000px',
        }}
      >
        {/* Holographic Card Surface & Bevel */}
        <div
          className="w-full h-full rounded-xl relative overflow-hidden backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, rgba(8, 14, 28, 0.94) 0%, rgba(3, 7, 16, 0.98) 100%)',
            boxShadow: isHeld
              ? `0 0 24px ${primaryColor}66, inset 0 0 15px ${primaryColor}44, 0 10px 25px rgba(0,0,0,0.85)`
              : `0 0 14px ${primaryColor}33, inset 0 0 10px ${primaryColor}22, 0 6px 20px rgba(0,0,0,0.75)`,
            border: `2px solid ${primaryColor}`,
            filter: glowFilter,
          }}
        >
          {/* Holographic light scanlines & subtle reflection */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.06) 3px, rgba(255,255,255,0.06) 4px)',
            }}
          />

          {/* SVG Line-Art Content */}
          <svg
            viewBox="0 0 180 270"
            className="w-full h-full relative z-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Inner Border Line */}
            <rect
              x="12"
              y="12"
              width="156"
              height="246"
              rx="8"
              fill="none"
              stroke={primaryColor}
              strokeWidth="1.2"
              opacity="0.85"
            />

            {/* Top-Left Rank & Mini Suit */}
            <text
              x="22"
              y="38"
              fill={primaryColor}
              fontFamily="monospace, sans-serif"
              fontSize="24"
              fontWeight="900"
              style={{
                textShadow: `0 0 6px ${primaryColor}`,
              }}
            >
              {card.rank}
            </text>
            <g transform="translate(0, 0)">
              {renderSuitIcon(28, 52, 13, primaryColor)}
            </g>

            {/* Center Intricate Line-Art Representation */}
            {renderCardCenter()}

            {/* Bottom-Right Inverted Rank & Mini Suit */}
            <g transform="rotate(180 158 232)">
              <text
                x="152"
                y="244"
                fill={primaryColor}
                fontFamily="monospace, sans-serif"
                fontSize="24"
                fontWeight="900"
                style={{
                  textShadow: `0 0 6px ${primaryColor}`,
                }}
              >
                {card.rank}
              </text>
              {renderSuitIcon(158, 258, 13, primaryColor)}
            </g>
          </svg>
        </div>
      </div>

      {/* Lower Yellow Glowing [ HELD ] Indicator (as in image) */}
      <div
        className={`h-7 flex items-center justify-center font-mono font-bold text-xs tracking-wider transition-opacity duration-200 ${
          isHeld ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          color: '#ffe600',
          textShadow: '0 0 8px #ffe600, 0 0 16px #ffbe0b, 0 0 24px #ffd166',
        }}
      >
        [ HELD ]
      </div>
    </div>
  );
};
