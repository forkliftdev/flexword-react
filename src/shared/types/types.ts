// --- ENUMS & BASIC TYPES ---

// The state of a single letter tile
// Maps to: Blue Circle (Correct), Yellow Triangle (Present), Gray Square (Absent)
export type TileStatus = 'initial' | 'correct' | 'present' | 'absent';

// The overall state of the game session
export type GamePhase = 'SETUP' | 'PLAYING' | 'WON' | 'LOST';

// The ID for the specific contract tiers
export type ContractId = 'safe' | 'standard' | 'risky' | 'hard' | 'extreme';

// --- DATA STRUCTURES ---

// Defines the rules for a specific difficulty level
export interface ContractTier {
  id: ContractId;
  label: string;       // e.g., "Safe", "Extreme"
  guesses: number;     // Max guesses before Overtime
  multiplier: number;  // Score multiplier (e.g., 1.5x)
  color: string;       // Tailwind class for background color (e.g., "bg-blue-500")
  icon: 'shield' | 'briefcase' | 'warning' | 'fire' | 'skull';
}

// Represents a single row of the game board
export type RowData = {
  letters: string[];    // e.g., ["S", "T", "O", "R", "M"]
  statuses: TileStatus[]; // e.g., ["correct", "absent", ...]
};

// --- CONSTANTS ---

export const WORD_LENGTH = 5;

// The official list of contracts (Matching your Screenshots & Dart logic)
export const CONTRACTS: ContractTier[] = [
  { 
    id: 'safe', 
    label: 'Safe', 
    guesses: 6, 
    multiplier: 1.1, 
    color: 'bg-green-500', 
    icon: 'shield' 
  },
  { 
    id: 'standard', 
    label: 'Standard', 
    guesses: 5, 
    multiplier: 1.5, 
    color: 'bg-tech-blue', // Custom color defined in Tailwind
    icon: 'briefcase' 
  },
  { 
    id: 'risky', 
    label: 'Risky', 
    guesses: 4, 
    multiplier: 3.0, 
    color: 'bg-caution-amber', // Custom color defined in Tailwind
    icon: 'warning' 
  },
  { 
    id: 'hard', 
    label: 'Hard', 
    guesses: 3, 
    multiplier: 5.0, 
    color: 'bg-orange-500', 
    icon: 'fire' 
  },
  { 
    id: 'extreme', 
    label: 'EXTREME', 
    guesses: 2, 
    multiplier: 10.0, 
    color: 'bg-red-600', 
    icon: 'skull' 
  },
];