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
    <div className="w-full bg-black p-1 pb-4 select-none">
      {/* ROW 1 */}
      <div className="flex justify-center mb-1">
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
      <div className="flex justify-center mb-1 px-4">
        {row2.map(char => (
          <Key 
            key={char} 
            label={char} 
            status={keyStatuses[char]} 
            onClick={() => onKeyPress(char)} 
          />
        ))}
      </div>

      {/* ROW 3 - THE WINGS */}
      <div className="flex justify-center gap-1 px-1 h-14">
        
        {/* LEFT WING: SPACE (_) */}
        <button
          onClick={() => onKeyPress('_')}
          className="flex-grow-[1.5] bg-gray-800 rounded text-white font-bold active:bg-gray-700 flex flex-col items-center justify-center border border-gray-700"
        >
          <span className="text-xs text-gray-400">SPACE</span>
          <span className="text-xl">_</span>
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

        {/* RIGHT WING: BACKSPACE / ENTER */}
        {/* Note: In your mockups, you sometimes show Enter here. 
            We'll make this a split or contextual button. 
            For now, let's put ENTER as the primary action. */}
        <div className="flex-grow-[1.5] flex flex-col gap-1">
           <button
            onClick={() => onKeyPress('BACKSPACE')}
            className="flex-1 bg-gray-800 rounded flex items-center justify-center active:bg-gray-700"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-9.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>
          
           <button
            onClick={() => onKeyPress('ENTER')}
            className="flex-1 bg-tech-blue rounded flex items-center justify-center active:brightness-110"
          >
             <span className="text-xs font-bold">ENTER</span>
          </button>
        </div>

      </div>
    </div>
  );
};

// Sub-component for individual Letter Keys
const Key = ({ label, status, onClick }: { label: string, status?: TileStatus, onClick: () => void }) => {
  // Determine Color based on status (Matches TileFrame logic)
  let bgColor = 'bg-[#4e4e50]'; // Default Gray
  let textColor = 'text-white';
  
  if (status === 'correct') { bgColor = 'bg-tech-blue'; } // Blue
  else if (status === 'present') { bgColor = 'bg-caution-amber'; textColor = 'text-black'; } // Yellow
  else if (status === 'absent') { bgColor = 'bg-[#121213] opacity-50'; } // Dark/Disabled

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 mx-[2px] h-14 rounded font-bold text-lg 
        transition-colors active:scale-95
        ${bgColor} ${textColor}
      `}
    >
      {label}
    </button>
  );
};