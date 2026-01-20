import React from 'react';
import { TileStatus } from '../types';

interface TileFrameProps {
  char: string;
  status: TileStatus;
  size?: number;
}

export const TileFrame: React.FC<TileFrameProps> = ({ char, status, size = 40 }) => {
  // Determine CSS class based on status
  const getClassName = () => {
    switch (status) {
      case 'correct':
        return 'tile-circle';
      case 'present':
        return 'tile-triangle';
      case 'absent':
        return 'tile-square-absent';
      case 'initial':
      default:
        return 'tile-square-initial';
    }
  };

  const className = getClassName();
  const fontSize = size * 0.5;

  return (
    <div
      className={`flex items-center justify-center font-bold ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${fontSize}px`,
      }}
    >
      <span>{char.toUpperCase()}</span>
    </div>
  );
};
