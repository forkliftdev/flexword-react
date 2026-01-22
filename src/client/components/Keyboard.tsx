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
   Keyboard Component
========================= */

export const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  keyStatuses,
  contractColor = '#4CAF50',
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
        <div className="flex gap-1.5">
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
        <div className="flex gap-1.5 px-4">
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
        <div className="flex gap-1.5 px-8">
          {row3.map((char) => (
            <Key
              key={char}
              label={char}
              variant={getVariant(char)}
              onClick={() => onKeyPress(char)}
            />
          ))}
        </div>

        {/* ROW 4 — SPECIAL KEYS */}
        <div className="flex gap-1.5 h-12 mt-1 px-1">

          {/* BACKSPACE */}
          <button
            onClick={() => onKeyPress('BACKSPACE')}
            className="flex-[1.5] bg-[#2f2f31] text-white rounded-xl
                       flex items-center justify-center
                       active:scale-95 transition shadow-md"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2
                   M3 12l6.414 6.414a2 2 0 001.414.586
                   H19a2 2 0 002-2V7a2 2 0 00-2-2h-9.172
                   a2 2 0 00-1.414.586L3 12z"
              />
            </svg>
          </button>

          {/* VIZ KEY */}
          <button
            onClick={() => onKeyPress('_')}
            className="flex-[2] rounded-xl flex flex-col items-center justify-center
                       active:scale-95 transition shadow-md border border-white/10"
            style={{ backgroundColor: `${contractColor}55` }}
          >
            <span className="text-[10px] font-bold text-white tracking-widest mb-0.5">
              VIZ
            </span>
            <div className="w-8 h-1 bg-white/90 rounded-full" />
          </button>

          {/* ENTER */}
          <button
            onClick={() => onKeyPress('ENTER')}
            className="flex-[1.5] bg-[#2f2f31] text-white rounded-xl
                       flex items-center justify-center
                       active:scale-95 transition shadow-md"
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

  const base =
    "relative flex-1 h-12 flex items-center justify-center " +
    "text-lg font-bold rounded-xl select-none " +
    "transition-all duration-100 active:scale-95 shadow-md";

  let bg = "";
  let text = "text-black";

  switch (variant) {
    case 'circle':
      bg = "bg-gradient-to-b from-green-400 to-green-600";
      text = "text-white";
      break;

    case 'triangle':
      bg = "bg-gradient-to-b from-yellow-300 to-yellow-500";
      text = "text-black";
      break;

    case 'absent':
      bg = "bg-[#2f2f31]";
      text = "text-white/50";
      break;

    default:
      bg = "bg-gradient-to-b from-[#f2f3f5] to-[#cfd2d6]";
      text = "text-black";
      break;
  }

  return (
    <button onClick={onClick} className={`${base} ${bg} ${text}`}>
      {label}

      {/* soft top highlight */}
      <div className="absolute top-1 left-1 right-1 h-2 rounded-full bg-white/20 pointer-events-none" />

      {/* SHAPE OVERLAYS */}
      {variant === 'circle' && (
        <div className="absolute inset-2 border-2 border-white rounded-full pointer-events-none" />
      )}

      {variant === 'triangle' && (
        <div
          className="absolute w-0 h-0
                     border-l-[10px] border-r-[10px] border-b-[16px]
                     border-l-transparent border-r-transparent
                     border-b-white/90 pointer-events-none"
          style={{ top: 6 }}
        />
      )}
    </button>
  );
};
