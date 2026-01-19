import React from 'react';
import { TileStatus } from '../types';
interface TileFrameProps {
  char: string;
  status: TileStatus; 
  onClick?: () => void;
}

export const TileFrame: React.FC<TileFrameProps> = ({ char, status, onClick }) => {
  
  // Color Logic
  const getFillColor = () => {
    switch (status) {
      case 'correct': return '#007ACC'; // Tech Blue
      case 'present': return '#FFC72C'; // Caution Amber
      case 'absent': return '#3A3A3C';  // Dark Gray
      case 'initial': 
      default: return 'transparent';
    }
  };

  // Shape Logic
  const getShape = () => {
    if (status === 'correct') return 'circle';
    if (status === 'present') return 'triangle';
    return 'square';
  };

  const shape = getShape();
  const fill = getFillColor();
  const isFilled = char !== '';

  return (
    <div 
      onClick={onClick}
      className="relative w-14 h-14 flex items-center justify-center cursor-pointer select-none"
    >
      {/* Background SVG */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
        {shape === 'circle' && <circle cx="50" cy="50" r="45" fill={fill} />}
        {shape === 'triangle' && <polygon points="50,15 90,85 10,85" fill={fill} />}
        {shape === 'square' && (
          <rect 
            x="5" y="5" width="90" height="90" rx="15" 
            fill={status === 'initial' ? 'none' : fill} 
            stroke={status === 'initial' ? '#3A3A3C' : 'none'} 
            strokeWidth="2"
          />
        )}
      </svg>

      {/* Letter Layer */}
      <span className={`relative z-10 text-3xl font-bold ${status === 'present' ? 'text-black' : 'text-white'}`}>
        {char}
      </span>
    </div>
  );
};