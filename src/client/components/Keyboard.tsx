import React from 'react';
import { TileStatus } from '../types';

/* =========================
   Types
========================= */

type KeyVariant = 'letter' | 'absent' | 'triangle' | 'circle';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStatuses: Record<string, TileStatus>;
  contractColor?: string;
}

/* =========================
   Layout constants
========================= */


/* =========================
   Keyboard Component
========================= */

export const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  keyStatuses,
  contractColor = '#4CAF50'
}) => {
  const row1 = 'QWERTYUIOP'.split('');
  const row2 = 'ASDFGHJKL'.split('');
  const row3 = 'ZXCVBNM'.split('');

  const getVariant = (char: string): KeyVariant => {
    const status = keyStatuses[char];
    if (status === 'correct') return 'circle';
    if (status === 'present') return 'triangle';
    if (status === 'absent') return 'absent';
    return 'letter';
  };

  return (
    <div className="w-full max-w-md mx-auto p-1 select-none">
      <div className="flex flex-col gap-1.5 px-1">

        {/* ROW 1 */}
        <div className="flex gap-1.5 touch-action-manipulation">
          {row1.map((char) => (
            <Key
              key={char}
              label={char}
              variant={getVariant(char)}
              onClick={() => onKeyPress(char)}
            />
          ))}
        </div>

        {/* ROW 2 */}
        <div className="flex gap-1.5 px-4 touch-action-manipulation">
          {row2.map((char) => (
            <Key
              key={char}
              label={char}
              variant={getVariant(char)}
              onClick={() => onKeyPress(char)}
            />
          ))}
        </div>

        {/* ROW 3 */}
        <div className="flex gap-1.5 px-8 touch-action-manipulation">
          {row3.map((char) => (
            <Key
              key={char}
              label={char}
              variant={getVariant(char)}
              onClick={() => onKeyPress(char)}
            />
          ))}
        </div>

        {/* ROW 4 - SPECIAL KEYS */}
        <div className="flex gap-1.5 h-12 mt-1 touch-action-manipulation px-1">
          {/* BACKSPACE */}
          <button
            onClick={() => onKeyPress('BACKSPACE')}
            className="flex-[1.5] bg-[#3A3A3C] text-white rounded-lg flex items-center justify-center active:scale-95 transition hover:brightness-110 shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-9.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>

          {/* VISUALIZER KEY */}
          <button
            onClick={() => onKeyPress('_')}
            className="flex-[2] rounded-lg flex flex-col items-center justify-center active:scale-95 transition hover:brightness-110 shadow-sm border border-white/10"
            style={{ backgroundColor: `${contractColor}40` }}
          >
            <span className="text-[10px] font-bold text-white/90 tracking-widest mb-0.5">VIZ</span>
            <div className="w-8 h-1 bg-white/90 rounded-full" />
          </button>

          {/* ENTER */}
          <button
            onClick={() => onKeyPress('ENTER')}
            className="flex-[1.5] bg-[#3A3A3C] text-white rounded-lg flex items-center justify-center active:scale-95 transition hover:brightness-110 shadow-sm"
          >
            <span className="text-xs font-bold tracking-wider">ENTER</span>
          </button>
        </div>

      </div>
    </div>
  );
};

/* =========================
   Key Component
   ========================= */

const Key = ({
  label,
  variant,
  onClick,
}: {
  label: string;
  variant: KeyVariant;
  onClick: () => void;
}) => {
  // Base classes - shorter height (h-12), distinct rounded look (rounded-lg)
  const baseClasses = "flex-1 h-12 flex items-center justify-center text-lg font-bold rounded-lg transition-all duration-100 active:scale-95 shadow-sm select-none touch-action-manipulation mx-0.5";

  let styles = "";

  switch (variant) {
    case 'circle': // CORRECT
      styles = "key-circle-modern text-white shadow-md";
      break;
    case 'triangle': // PRESENT
      styles = "key-triangle-modern text-black shadow-md";
      break;
    case 'absent': // ABSENT
      styles = "bg-[#3A3A3C] text-white/50";
      break;
    default: // UNUSED
      // Removed the heavy bottom border for a flat, modern 'iOS-style' look.
      styles = "bg-[#D3D6DA] text-black shadow-sm";
      break;
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${styles}`}>
      {label}
    </button>
  );
};

