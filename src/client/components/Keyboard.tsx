import React from 'react';
import { TileStatus } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStatuses: Record<string, TileStatus>;
}

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyStatuses }) => {
  const row1 = "QWERTYUIOP".split('');
  const row2 = "ASDFGHJKL".split('');
  const row3 = "ZXCVBNM".split('');

  return (
    <div className="w-full bg-[#121212] p-2 select-none">
      {/* ROW 1 */}
      <div className="flex justify-center gap-1 mb-1.5">
        {row1.map(char => (
          <Key 
            key={char} 
            label={char} 
            status={keyStatuses[char]} 
            onClick={() => onKeyPress(char)} 
          />
        ))}
      </div>

      {/* ROW 2 */}
      <div className="flex justify-center gap-1 mb-1.5">
        {row2.map(char => (
          <Key 
            key={char} 
            label={char} 
            status={keyStatuses[char]} 
            onClick={() => onKeyPress(char)} 
          />
        ))}
      </div>

      {/* ROW 3 - Redesigned with Backspace, Letters, Placeholder, Enter */}
      <div className="flex justify-center gap-1">
        {/* BACKSPACE - Red tinted, larger */}
        <button
          onClick={() => onKeyPress('BACKSPACE')}
          className="px-4 h-14 bg-[#3A1A1A] rounded flex items-center justify-center active:brightness-110 transition border border-[#F44336]/30 hover:bg-[#4A2A2A]"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-9.172a2 2 0 00-1.414.586L3 12z" />
          </svg>
        </button>

        {/* CENTER LETTERS */}
        {row3.map(char => (
          <Key 
            key={char} 
            label={char} 
            status={keyStatuses[char]} 
            onClick={() => onKeyPress(char)} 
          />
        ))}

        {/* PLACEHOLDER/VISUALIZER - Smaller */}
        <button
          onClick={() => onKeyPress('_')}
          className="px-3 h-14 bg-[#1E1E1E] rounded text-white font-bold active:brightness-110 transition border border-white/10 text-xs flex flex-col items-center justify-center"
        >
          <span className="text-[10px] text-gray-500">VIZ</span>
          <span className="text-lg">_</span>
        </button>

        {/* ENTER - Green tinted, larger */}
        <button
          onClick={() => onKeyPress('ENTER')}
          className="px-4 h-14 bg-[#1A3A1A] rounded flex items-center justify-center active:brightness-110 transition font-bold text-white text-sm border border-[#4CAF50]/30 hover:bg-[#2A4A2A]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Sub-component for individual Letter Keys - Larger and lighter
const Key = ({ label, status, onClick }: { label: string, status?: TileStatus, onClick: () => void }) => {
  // Determine Color based on status - Lighter backgrounds, white text
  let bgColor = 'bg-[#2A2A2A]'; // Lighter default
  let textColor = 'text-white';
  let borderColor = 'border-white/10';
  
  if (status === 'correct') { 
    bgColor = 'bg-[#007ACC]'; // techBlue
    borderColor = 'border-[#007ACC]';
  } else if (status === 'present') { 
    bgColor = 'bg-[#FFC72C]'; // cautionAmber
    textColor = 'text-black font-black'; // Black bold text on yellow
    borderColor = 'border-[#FFC72C]';
  } else if (status === 'absent') { 
    bgColor = 'bg-[#3A3A3A]'; // wrongDark
    borderColor = 'border-[#3A3A3A]';
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 h-14 rounded font-bold text-base
        transition-all active:scale-95 active:brightness-110
        border ${bgColor} ${textColor} ${borderColor}
      `}
    >
      {label}
    </button>
  );
};
