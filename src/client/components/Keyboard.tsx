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
      <div className="flex justify-center gap-1 mb-1">
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
      <div className="flex justify-center gap-1 mb-1">
        {row2.map(char => (
          <Key 
            key={char} 
            label={char} 
            status={keyStatuses[char]} 
            onClick={() => onKeyPress(char)} 
          />
        ))}
      </div>

      {/* ROW 3 */}
      <div className="flex justify-center gap-1">
        {/* SPACE (_) */}
        <button
          onClick={() => onKeyPress('_')}
          className="px-3 h-12 bg-[#1E1E1E] rounded text-white font-bold active:brightness-110 transition border border-white/10"
        >
          <span className="text-xs text-gray-400">_</span>
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

        {/* BACKSPACE */}
        <button
          onClick={() => onKeyPress('BACKSPACE')}
          className="px-3 h-12 bg-[#1E1E1E] rounded flex items-center justify-center active:brightness-110 transition border border-white/10"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-9.172a2 2 0 00-1.414.586L3 12z" />
          </svg>
        </button>

        {/* ENTER */}
        <button
          onClick={() => onKeyPress('ENTER')}
          className="px-4 h-12 bg-[#007ACC] rounded flex items-center justify-center active:brightness-110 transition font-bold text-white text-sm"
        >
          ENTER
        </button>
      </div>
    </div>
  );
};

// Sub-component for individual Letter Keys
const Key = ({ label, status, onClick }: { label: string, status?: TileStatus, onClick: () => void }) => {
  // Determine Color based on status
  let bgColor = 'bg-[#1E1E1E]'; // surfaceGrey default
  let textColor = 'text-white';
  let borderColor = 'border-white/10';
  
  if (status === 'correct') { 
    bgColor = 'bg-[#007ACC]'; // techBlue
    borderColor = 'border-[#007ACC]';
  } else if (status === 'present') { 
    bgColor = 'bg-[#FFC72C]'; // cautionAmber
    textColor = 'text-black'; 
    borderColor = 'border-[#FFC72C]';
  } else if (status === 'absent') { 
    bgColor = 'bg-[#3A3A3A]'; // wrongDark
    borderColor = 'border-[#3A3A3A]';
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 h-12 rounded font-bold text-sm 
        transition-all active:scale-95 active:brightness-110
        border ${bgColor} ${textColor} ${borderColor}
      `}
    >
      {label}
    </button>
  );
};
