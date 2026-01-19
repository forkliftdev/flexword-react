import { useState, useCallback, useEffect } from 'react';
import { getRandomWord, isValidWord } from '../data/words';
import { ContractTier, TileStatus } from '../types'; // We'll update types below

// Configuration
const WORD_LENGTH = 5;

type GamePhase = 'SETUP' | 'PLAYING' | 'WON' | 'LOST';

export const useFlexword = () => {
  // --- STATE ---
  const [phase, setPhase] = useState<GamePhase>('SETUP');
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [contract, setContract] = useState<ContractTier | null>(null);
  
  // Scoring
  const [bankScore, setBankScore] = useState(0); // Load this from Reddit/Redis later
  const [potValue, setPotValue] = useState(10000);
  const [errorMessage, setErrorMessage] = useState('');

  // Keyboard State (Map of 'A': 'CORRECT')
  const [keyStatuses, setKeyStatuses] = useState<Record<string, TileStatus>>({});

  // --- ACTIONS ---

  // 1. Start Game
  const startGame = useCallback((selectedContract: ContractTier) => {
    const newWord = getRandomWord();
    console.log("Target Word:", newWord); // For debugging
    
    setContract(selectedContract);
    setTargetWord(newWord);
    setGuesses([]);
    setCurrentGuess('');
    setPotValue(10000); // Base Start
    setKeyStatuses({});
    setPhase('PLAYING');
    setErrorMessage('');
  }, []);

  // 2. Handle Input
  const handleInput = useCallback((key: string) => {
    if (phase !== 'PLAYING') return;

    // Clear error on any typing
    setErrorMessage('');

    const upperKey = key.toUpperCase();

    if (upperKey === 'ENTER') {
      submitGuess();
    } else if (upperKey === 'BACKSPACE' || upperKey === 'DEL') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (upperKey === ' ' || upperKey === '_') {
      // Logic from game_controller.dart: Space adds underscore
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => prev + '_');
      }
    } else if (/^[A-Z]$/.test(upperKey)) {
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => prev + upperKey);
      }
    }
  }, [phase, currentGuess, targetWord]); // Dependencies

  // 3. Submit Logic (The Meat)
  const submitGuess = () => {
    if (!contract) return;

    // Validation Rules
    if (currentGuess.includes('_')) {
      setErrorMessage("INCOMPLETE WORD!");
      return;
    }
    if (currentGuess.length !== WORD_LENGTH) {
      setErrorMessage("TOO SHORT!");
      return;
    }
    if (!isValidWord(currentGuess)) {
      setErrorMessage("NOT ON WORD LIST");
      return;
    }

    // Process the Move
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    
    // Update Keyboard Colors
    const newKeys = { ...keyStatuses };
    const scores = getScoreForGuess(currentGuess, targetWord);
    
    currentGuess.split('').forEach((char, i) => {
      const status = scores[i];
      // Logic: Don't downgrade a Green to Yellow
      if (newKeys[char] === 'correct') return; 
      if (newKeys[char] === 'present' && status === 'absent') return;
      newKeys[char] = status;
    });
    setKeyStatuses(newKeys);

    // Check Win/Loss/Overtime
    if (currentGuess === targetWord) {
      handleWin(newGuesses.length);
    } else {
      handleMiss(newGuesses.length);
    }
    
    setCurrentGuess('');
  };

  const handleWin = (guessCount: number) => {
    if (!contract) return;
    
    let winnings = 0;
    // If within contract limits, apply multiplier
    if (guessCount <= contract.guesses) {
      winnings = Math.floor(potValue * contract.multiplier);
    } else {
      // Overtime win: You get the decayed pot, no multiplier
      winnings = potValue; 
    }

    setBankScore(prev => prev + winnings);
    setPotValue(winnings); // Show final win amount
    setPhase('WON');
  };

  const handleMiss = (guessCount: number) => {
    if (!contract) return;

    // Overtime Logic from game_controller.dart
    if (guessCount >= contract.guesses) {
      // "Score halved every turn after bid"
      setPotValue(prev => Math.floor(prev / 2));
    }
  };

  // Helper: Logic to determine tile colors (handles duplicates)
  const getScoreForGuess = (guess: string, target: string): TileStatus[] => {
    const result: TileStatus[] = Array(5).fill('absent');
    const targetArr = target.split('');
    const guessArr = guess.split('');

    // Pass 1: Greens (Correct)
    guessArr.forEach((char, i) => {
      if (char === targetArr[i]) {
        result[i] = 'correct';
        targetArr[i] = '#'; // Mark as used
        guessArr[i] = '*';  // Mark as processed
      }
    });

    // Pass 2: Yellows (Present)
    guessArr.forEach((char, i) => {
      if (char === '*') return; // Skip greens
      const indexInTarget = targetArr.indexOf(char);
      if (indexInTarget !== -1) {
        result[i] = 'present'; // Yellow/Triangle
        targetArr[indexInTarget] = '#'; // Mark used
      }
    });

    return result;
  };

  return {
    phase,
    targetWord,
    guesses,
    currentGuess,
    potValue,
    bankScore,
    errorMessage,
    keyStatuses,
    startGame,
    handleInput,
    contract
  };
};