import { useState, useCallback, useEffect } from 'react';
import { getRandomWord, isValidWord } from '../data/words';
import { ContractTier, TileStatus } from '../types';
import { UserDataResponse, SaveGameResponse } from '../../shared/types/api';

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
  const [bankScore, setBankScore] = useState(0);
  const [potValue, setPotValue] = useState(10000);
  const [errorMessage, setErrorMessage] = useState('');
  const [solvedWords, setSolvedWords] = useState<string[]>([]);
  const [isTransferring, setIsTransferring] = useState(false);
  const [lastWinnings, setLastWinnings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Keyboard State (Map of 'A': 'CORRECT')
  const [keyStatuses, setKeyStatuses] = useState<Record<string, TileStatus>>({});

  // --- ACTIONS ---

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      console.log('Loading user data...');
      const response = await fetch('/api/user-data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: UserDataResponse = await response.json();
      console.log('User data loaded:', data);
      setBankScore(data.bank);
      setSolvedWords(data.solvedWords);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  // Get a random word that hasn't been solved yet
  const getUnsolvedWord = useCallback((): string => {
    let word = getRandomWord();
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loop

    while (solvedWords.includes(word.toUpperCase()) && attempts < maxAttempts) {
      word = getRandomWord();
      attempts++;
    }

    return word;
  }, [solvedWords]);

  // 1. Start Game
  const startGame = useCallback(
    (selectedContract: ContractTier) => {
      const newWord = getUnsolvedWord();
      console.log('Target Word:', newWord); // For debugging

      setContract(selectedContract);
      setTargetWord(newWord);
      setGuesses([]);
      setCurrentGuess('');
      setPotValue(10000); // Base Start
      setKeyStatuses({});
      setPhase('PLAYING');
      setErrorMessage('');
      setIsTransferring(false);
    },
    [getUnsolvedWord]
  );

  // 2. Handle Input
  const handleInput = useCallback(
    (key: string) => {
      if (phase !== 'PLAYING') return;

      // Clear error on any typing
      setErrorMessage('');

      const upperKey = key.toUpperCase();

      if (upperKey === 'ENTER') {
        // Submit logic inline to avoid dependency issues
        if (!contract) return;

        // Validation Rules
        if (currentGuess.includes('_')) {
          setErrorMessage('INCOMPLETE WORD!');
          return;
        }
        if (currentGuess.length !== WORD_LENGTH) {
          setErrorMessage('TOO SHORT!');
          return;
        }
        if (!isValidWord(currentGuess)) {
          setErrorMessage('NOT ON WORD LIST');
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
          if (status) newKeys[char] = status;
        });
        setKeyStatuses(newKeys);

        // Check Win/Loss/Overtime
        if (currentGuess === targetWord) {
          handleWin(newGuesses.length);
        } else {
          // Show warning BEFORE the last contract guess
          // Example: 2-guess contract → show after 1st miss (warning about 2nd being last)
          // Example: 4-guess contract → show after 3rd miss (warning about 4th being last)
          if (newGuesses.length === contract.guesses - 1 && !showWarning) {
            setShowWarning(true);
          }
          handleMiss(newGuesses.length);
        }

        setCurrentGuess('');
      } else if (upperKey === 'BACKSPACE' || upperKey === 'DEL') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (upperKey === ' ' || upperKey === '_') {
        // Logic from game_controller.dart: Space adds underscore
        if (currentGuess.length < WORD_LENGTH) {
          setCurrentGuess((prev) => prev + '_');
        }
      } else if (/^[A-Z]$/.test(upperKey)) {
        if (currentGuess.length < WORD_LENGTH) {
          setCurrentGuess((prev) => prev + upperKey);
        }
      }
    },
    [phase, currentGuess, targetWord, contract, guesses, keyStatuses]
  ); // All dependencies

  const handleWin = async (guessCount: number) => {
    if (!contract) return;

    let winnings = 0;
    // If within contract limits, apply multiplier
    if (guessCount <= contract.guesses) {
      winnings = Math.floor(potValue * contract.multiplier);
    } else {
      // Overtime win: You get the decayed pot, no multiplier
      winnings = potValue;
    }

    setLastWinnings(winnings);
    setPotValue(winnings); // Show final win amount

    // Trigger balance transfer animation
    setIsTransferring(true);

    // Save game result to backend
    try {
      const response = await fetch('/api/save-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: targetWord,
          winnings,
          guessCount,
          contractId: contract.id,
        }),
      });

      const data: SaveGameResponse = await response.json();

      // Animate bank balance update
      setTimeout(() => {
        setBankScore(data.newBank);
        setSolvedWords((prev) => [...prev, targetWord.toUpperCase()]);
        setIsTransferring(false);
      }, 1500); // Match animation duration
    } catch (error) {
      console.error('Failed to save game:', error);
      // Still update locally even if save fails
      setBankScore((prev) => prev + winnings);
      setIsTransferring(false);
    }

    // Show celebration popup after balance transfer completes
    setTimeout(() => {
      setShowCelebration(true);
    }, 1600); // Show after balance transfer completes
  };

  const handleMiss = (guessCount: number) => {
    if (!contract) return;

    // Overtime Logic from game_controller.dart
    if (guessCount >= contract.guesses) {
      // "Score halved every turn after bid"
      setPotValue((prev) => Math.floor(prev / 2));
    }
  };

  const closeCelebration = () => {
    setShowCelebration(false);
    setPhase('WON'); // Now set phase to show the end screen
  };

  const closeWarning = () => {
    setShowWarning(false);
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
        guessArr[i] = '*'; // Mark as processed
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
    contract,
    isTransferring,
    lastWinnings,
    solvedWords,
    showWarning,
    showCelebration,
    closeWarning,
    closeCelebration,
  };
};
