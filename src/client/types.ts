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
  icon: 'shield' | 'briefcase' | 'warning' | 'fire' | 'skull';
}

export type RowData = {
  letters: string[];
  statuses: TileStatus[];
};

// 3. Constants
export const WORD_LENGTH = 5;

export const CONTRACTS: ContractTier[] = [
  { id: 'safe', label: 'Safe', guesses: 6, multiplier: 1.1, color: 'bg-green-500', icon: 'shield' },
  { id: 'standard', label: 'Standard', guesses: 5, multiplier: 1.5, color: 'bg-tech-blue', icon: 'briefcase' },
  { id: 'risky', label: 'Risky', guesses: 4, multiplier: 3.0, color: 'bg-caution-amber', icon: 'warning' },
  { id: 'hard', label: 'Hard', guesses: 3, multiplier: 5.0, color: 'bg-orange-500', icon: 'fire' },
  { id: 'extreme', label: 'EXTREME', guesses: 2, multiplier: 10.0, color: 'bg-red-600', icon: 'skull' },
];