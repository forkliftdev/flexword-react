import React from 'react';
import { TileStatus } from '../types';

interface TileFrameProps {
  char: string;
  status: TileStatus;
  size?: number;
}

export const TileFrame: React.FC<TileFrameProps> = ({ char, status, size = 40 }) => {
  // Determine background color and shape based on status
  const getStyles = () => {
    switch (status) {
      case 'correct':
        return {
          bg: '#007ACC', // techBlue
          shape: 'circle',
          textColor: 'white',
        };
      case 'present':
        return {
          bg: '#FFC72C', // cautionAmber
          shape: 'triangle',
          textColor: 'black', // Black text for better contrast on yellow
        };
      case 'absent':
        return {
          bg: '#3A3A3A', // wrongDark
          shape: 'square',
          textColor: 'white',
        };
      case 'initial':
      default:
        return {
          bg: 'transparent',
          shape: 'square',
          textColor: 'white',
        };
    }
  };

  const { bg, shape, textColor } = getStyles();
  const fontSize = size * 0.5;

  // Render based on shape
  if (shape === 'circle') {
    return (
      <div
        className="flex items-center justify-center font-bold"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: bg,
          borderRadius: '50%',
          fontSize: `${fontSize}px`,
          color: textColor,
        }}
      >
        {char.toUpperCase()}
      </div>
    );
  }

  if (shape === 'triangle') {
    return (
      <div
        className="relative flex items-center justify-center font-black"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {/* Triangle background using CSS clip-path */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: bg,
            clipPath: 'polygon(50% 10%, 90% 90%, 10% 90%)',
          }}
        />
        {/* Text on top */}
        <span
          className="relative z-10"
          style={{
            fontSize: `${fontSize}px`,
            color: textColor,
            fontWeight: 900,
          }}
        >
          {char.toUpperCase()}
        </span>
      </div>
    );
  }

  // Square (for absent and initial)
  return (
    <div
      className="flex items-center justify-center font-bold border"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: bg,
        borderRadius: '4px',
        fontSize: `${fontSize}px`,
        color: textColor,
        borderColor: status === 'initial' ? '#555' : bg,
        borderWidth: '1px',
      }}
    >
      {char.toUpperCase()}
    </div>
  );
};
