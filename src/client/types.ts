// src/client/types.ts

// 1. Enums & Status
export type TileStatus = 'initial' | 'correct' | 'present' | 'absent';
export type GamePhase = 'SETUP' | 'PLAYING' | 'WON' | 'LOST';
export type ContractId = 'safe' | 'standard' | 'risky' | 'hard' | 'extreme';

// 2. Data Structures
export interface ContractTier {
  id: ContractId;
  label: string;
  guesses: number;
  multiplier: number;
  color: string;
  icon: 'shield' | 'briefcase' | 'warning' | 'fire' | 'octagon';
}

export type RowData = {
  letters: string[];
  statuses: TileStatus[];
};

// 3. Constants
export const WORD_LENGTH = 5;

export const CONTRACTS: ContractTier[] = [
  { id: 'safe', label: 'SAFE', guesses: 6, multiplier: 1.1, color: 'bg-[#4CAF50]', icon: 'shield' },
  {
    id: 'standard',
    label: 'STANDARD',
    guesses: 5,
    multiplier: 1.5,
    color: 'bg-[#2196F3]',
    icon: 'briefcase',
  },
  {
    id: 'risky',
    label: 'RISKY',
    guesses: 4,
    multiplier: 3.0,
    color: 'bg-[#FFC107]',
    icon: 'warning',
  },
  { id: 'hard', label: 'HARD', guesses: 3, multiplier: 5.0, color: 'bg-[#FF9800]', icon: 'fire' },
  {
    id: 'extreme',
    label: 'EXTREME',
    guesses: 2,
    multiplier: 10.0,
    color: 'bg-[#F44336]',
    icon: 'octagon',
  },
];
