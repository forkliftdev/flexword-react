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

const MAX_WIDTH = 520;

const LETTER_KEY = 'w-[44px] h-[52px]';
const CLUE_KEY = 'w-[44px] h-[44px]';
const ACTION_KEY = 'w-[64px] h-[44px]';
const CENTER_KEY = 'w-[56px] h-[44px]';

/* =========================
   Keyboard Component
========================= */

export const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  keyStatuses,
  contractColor = '#4CAF50' // Default safe green props fallback
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
    <div
      className="w-full mx-auto select-none border-t border-white/10 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
      style={{
        maxWidth: MAX_WIDTH,
        backgroundColor: `${contractColor}15`
      }}
    >
      {/* ROW 1 */}
      <Row>
        {row1.map((c) => (
          <Key
            key={c}
            label={c}
            variant={getVariant(c)}
            onClick={() => onKeyPress(c)}
          />
        ))}
      </Row>

      {/* ROW 2 */}
      <Row>
        {row2.map((c) => (
          <Key
            key={c}
            label={c}
            variant={getVariant(c)}
            onClick={() => onKeyPress(c)}
          />
        ))}
      </Row>

      {/* ROW 3 */}
      <Row>
        {row3.map((c) => (
          <Key
            key={c}
            label={c}
            variant={getVariant(c)}
            onClick={() => onKeyPress(c)}
          />
        ))}
      </Row>

      {/* BOTTOM ROW - Functional Keys */}
      <div className="flex justify-center gap-2 mt-1 mb-2">
        {/* BACKSPACE */}
        <button
          onClick={() => onKeyPress('BACKSPACE')}
          className={`
                        ${ACTION_KEY}
                        rounded-md
                        bg-gradient-to-b from-[#6A3A3A] to-[#5A2A2A]
                        border border-[#F44336]/30
                        flex items-center justify-center
                        transition-all duration-200
                        active:scale-95 active:translate-y-0.5
                        hover:brightness-110
                        shadow-[0_4px_12px_rgba(0,0,0,0.3)]
                    `}
        >
          <BackspaceIcon />
        </button>

        {/* VISUALIZER - Interactive */}
        <button
          onClick={() => onKeyPress('_')}
          className={`
                        ${CENTER_KEY}
                        rounded-md
                        border
                        flex flex-col items-center justify-center
                        transition-all duration-200
                        active:scale-95 active:translate-y-0.5
                        hover:brightness-110
                        shadow-[0_4px_12px_rgba(0,0,0,0.3)]
                        cursor-pointer
                    `}
          style={{
            backgroundColor: `${contractColor}40`,
            borderColor: `${contractColor}80`
          }}
        >
          <span className="text-[10px] text-white/90 font-bold tracking-wide">VIZ</span>
          <span className="text-lg leading-none text-white font-bold">_</span>
        </button>

        {/* ENTER */}
        <button
          onClick={() => onKeyPress('ENTER')}
          className={`
                        ${ACTION_KEY}
                        rounded-md
                        bg-gradient-to-b from-[#3A6A3A] to-[#2A5A2A]
                        border border-[#4CAF50]/30
                        flex items-center justify-center
                        transition-all duration-200
                        active:scale-95 active:translate-y-0.5
                        hover:brightness-110
                        shadow-[0_4px_12px_rgba(0,0,0,0.3)]
                    `}
        >
          <EnterIcon />
        </button>
      </div>
    </div>
  );
};

/* =========================
   Subcomponents
   ========================= */

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-center gap-1 mb-2">{children}</div>
);

const Key = ({
  label,
  variant,
  onClick,
}: {
  label: string;
  variant: KeyVariant;
  onClick: () => void;
}) => {
  // Base classes shared by all keys
  const baseClasses = "flex items-center justify-center font-bold text-lg text-white transition-all duration-200 active:scale-95 active:translate-y-0.5 hover:brightness-110";

  let sizeClass = LETTER_KEY;
  let styleClass = "";

  switch (variant) {
    case 'circle':
      sizeClass = CLUE_KEY;
      // .key-circle is defined in index.css (blue circle with shadow)
      styleClass = "key-circle";
      break;
    case 'triangle':
      sizeClass = CLUE_KEY;
      // .key-triangle is defined in index.css (yellow triangle clip-path)
      styleClass = "key-triangle";
      break;
    case 'absent':
      sizeClass = LETTER_KEY;
      styleClass = "rounded-md bg-[#1A1A1A] border border-white/10 text-white/40 shadow-none";
      break;
    default: // letter
      sizeClass = LETTER_KEY;
      styleClass = "rounded-md bg-gradient-to-b from-[#5A5A5A] to-[#4A4A4A] border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.4)]";
      break;
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClass} ${styleClass}`}
    >
      <span className="relative z-10">{label}</span>
    </button>
  );
};

/* =========================
   Icons
   ========================= */

const BackspaceIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-9.172a2 2 0 00-1.414.586L3 12z" />
  </svg>
);

const EnterIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8" />
  </svg>
);
