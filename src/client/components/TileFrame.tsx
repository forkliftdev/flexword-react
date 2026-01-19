import React from 'react';
import { TileStatus } from '../types';

interface TileFrameProps {
  char: string;
  status: TileStatus;
  size?: number;
}

export const TileFrame: React.FC<TileFrameProps> = ({ char, status, size = 50 }) => {
  // Determine background color and shape based on status
  const getStyles = () => {
    switch (status) {
      case 'correct':
        return {
          bg: 'bg-[#007ACC]', // techBlue
          shape: 'rounded-full', // Circle
        };
      case 'present':
        return {
          bg: 'bg-[#FFC72C]', // cautionAmber
          shape: 'clip-triangle', // Triangle (custom class)
        };
      case 'absent':
        return {
          bg: 'bg-[#3A3A3A]', // wrongDark
          shape: 'rounded-none', // Square
        };
      case 'initial':
      default:
        return {
          bg: 'bg-[#1E1E1E]', // surfaceGrey
          shape: 'rounded-none', // Square
        };
    }
  };

  const { bg, shape } = getStyles();

  return (
    <div
      className={`${bg} ${shape} flex items-center justify-center font-bold text-white border border-white/10`}
      style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.5}px` }}
    >
      {status === 'present' ? (
        // For triangle, we need special rendering
        <div className="relative w-full h-full flex items-center justify-center">
          <div 
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(50% 15%, 85% 85%, 15% 85%)',
              backgroundColor: '#FFC72C',
            }}
          />
          <span className="relative z-10 text-black font-bold" style={{ fontSize: `${size * 0.4}px` }}>
            {char.toUpperCase()}
          </span>
        </div>
      ) : (
        <span className={status === 'present' ? 'text-black' : 'text-white'}>
          {char.toUpperCase()}
        </span>
      )}
    </div>
  );
};
