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
    <div className="w-full bg-[#1A1A1A] p-3 select-none border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {/* ROW 1 - Larger keys */}
      <div className="flex justify-center gap-1 mb-2">
        {row1.map(char => (
          <Key 
            key={char} 
            label={char} 
            status={keyStatuses[char]} 
            onClick={() => onKeyPress(char)} 
          />
        ))}
      </div>

      {/* ROW 2 - Larger keys */}
      <div className="flex justify-center gap-1 mb-2">
        {row2.map(char => (
          <Key 
            key={char} 
            label={char} 
            status={keyStatuses[char]} 
            onClick={() => onKeyPress(char)} 
          />
        ))}
      </div>

      {/* ROW 3 - Just letters */}
      <div className="flex justify-center gap-1 mb-2">
        {row3.map(char => (
          <Key 
            key={char} 
            label={char} 
            status={keyStatuses[char]} 
            onClick={() => onKeyPress(char)} 
          />
        ))}
      </div>

      {/* ROW 4 - Backspace, Visualizer, Enter */}
      <div className="flex justify-center gap-2">
        {/* BACKSPACE - Red tinted, larger */}
        <button
          onClick={() => onKeyPress('BACKSPACE')}
          className="flex-1 h-12 bg-[#3A1A1A] rounded flex items-center justify-center transition-all duration-250 border border-[#F44336]/30 hover:bg-[#4A2A2A] hover:shadow-[0_0_20px_rgba(244,67,54,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_6px_rgba(244,67,54,0.3),inset_0_2px_4px_rgba(0,0,0,0.2)] shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-9.172a2 2 0 00-1.414.586L3 12z" />
          </svg>
        </button>

        {/* VISUALIZER - Smaller */}
        <button
          onClick={() => onKeyPress('_')}
          className="flex-1 h-12 bg-[#1E1E1E] rounded text-white font-bold transition-all duration-250 border border-white/10 text-xs flex flex-col items-center justify-center hover:brightness-110 hover:shadow-[0_0_16px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.2)] shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        >
          <span className="text-[10px] text-gray-400">VIZ</span>
          <span className="text-lg">_</span>
        </button>

        {/* ENTER - Green tinted, larger */}
        <button
          onClick={() => onKeyPress('ENTER')}
          className="flex-1 h-12 bg-[#1A3A1A] rounded flex items-center justify-center transition-all duration-250 font-bold text-white text-sm border border-[#4CAF50]/30 hover:bg-[#2A4A2A] hover:shadow-[0_0_20px_rgba(76,175,80,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_6px_rgba(76,175,80,0.3),inset_0_2px_4px_rgba(0,0,0,0.2)] shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Sub-component for individual Letter Keys with CSS CLASSES
const Key = ({ label, status, onClick }: { label: string, status?: TileStatus | undefined, onClick: () => void }) => {
  // Determine CSS class based on status
  const getKeyClass = () => {
    if (status === 'correct') {
      return 'key-circle';
    } else if (status === 'present') {
      return 'key-triangle';
    } else if (status === 'absent') {
      return 'bg-gradient-to-b from-[#252525] to-[#1A1A1A] text-white rounded border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.2)]';
    } else {
      return 'bg-gradient-to-b from-[#5A5A5A] to-[#4A4A4A] text-white rounded border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.1)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.2)]';
    }
  };

  const keyClass = getKeyClass();

  return (
    <button
      onClick={onClick}
      className={`flex-1 h-16 flex items-center justify-center transition-all active:scale-95 active:brightness-110 font-bold text-lg ${keyClass}`}
    >
      <span>{label}</span>
    </button>
  );
};
