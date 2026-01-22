import React, { useEffect, useState } from 'react';
import { useFlexword } from '../hooks/useFlexword';
import { TileFrame } from './TileFrame';
import { ContractTier, TileStatus } from '../types';
import { Keyboard } from './Keyboard';
import { BankDisplay } from './BankDisplay';
import { Leaderboard } from './Leaderboard';
import { CelebrationPopup } from './CelebrationPopup';
import { WarningPopup } from './WarningPopup';
import { Announcer } from './Announcer';

interface GameScreenProps {
  contract: ContractTier;
  onExit: (score?: number) => void;
  initialBank?: number;
}

export const GameScreen: React.FC<GameScreenProps> = ({ contract, onExit, initialBank }) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const {
    phase,
    guesses,
    currentGuess,
    potValue,
    errorMessage,
    handleInput,
    startGame,
    targetWord,
    keyStatuses,
    bankScore,
    isTransferring,
    lastWinnings,
    showWarning,
    showCelebration,
    closeWarning,
    closeCelebration,
  } = useFlexword(initialBank);

  useEffect(() => {
    startGame(contract);
  }, []);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleInput(e.key);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [handleInput]);

  // Announce game state changes for screen readers
  useEffect(() => {
    if (phase === 'WON') {
      setAnnouncement(`You won! Earned ${lastWinnings} points.`);
    } else if (phase === 'LOST') {
      setAnnouncement(`Game over. The word was ${targetWord}.`);
    } else if (errorMessage) {
      setAnnouncement(errorMessage);
    }
  }, [phase, errorMessage, lastWinnings, targetWord]);

  // Get risk color based on contract
  const getRiskColor = () => {
    const colorMap: Record<string, string> = {
      'bg-[#4CAF50]': '#4CAF50',
      'bg-[#2196F3]': '#2196F3',
      'bg-[#FFC107]': '#FFC107',
      'bg-[#FF9800]': '#FF9800',
      'bg-[#F44336]': '#F44336',
    };
    return colorMap[contract.color] || '#2196F3';
  };

  const riskColor = getRiskColor();


  return (
    <div className="flex flex-col h-screen w-full bg-[#121212] text-white">

      {/* APP BAR */}
      <div className="flex justify-between items-center px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={() => onExit(bankScore)} className="text-white/70 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* DEBUG: Show target word */}
          <div className="text-xs text-red-400 font-mono bg-red-900/20 px-2 py-1 rounded border border-red-500/30">
            🎯 {targetWord}
          </div>
        </div>
        <h1 className="text-xl font-black tracking-wide text-[#007ACC]">FlexWord</h1>
        <button
          onClick={() => setShowLeaderboard(true)}
          className="text-white/70 hover:text-white transition"
          title="Leaderboard"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>

      {/* BANK DISPLAY - Centered below logo */}
      <div className="border-b border-white/5">
        <BankDisplay
          balance={bankScore}
          isAnimating={isTransferring}
          transferAmount={lastWinnings}
        />
      </div>

      {/* HUD: Contract Ticket + POT */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex justify-between items-center mb-2">
          {/* Contract Ticket */}
          <div
            className="px-2 py-1.5 rounded border flex items-center gap-1.5 text-xs"
            style={{
              backgroundColor: `${riskColor}1A`,
              borderColor: `${riskColor}80`
            }}
          >
            <ContractIcon icon={contract.icon} color={riskColor} size={14} />
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] font-black tracking-wide" style={{ color: riskColor }}>
                {contract.label}
              </span>
              <span className="text-[9px] text-gray-300 font-bold">
                {contract.guesses} GUESSES
              </span>
            </div>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <span className="text-base font-bold text-white">{contract.multiplier}x</span>
          </div>

          {/* POT Value */}
          <div className="text-right">
            <div className="text-[9px] text-gray-500 font-bold">POT</div>
            <div className={`text-2xl font-bold ${phase === 'WON' ? 'text-[#4CAF50]' : 'text-white'}`}>
              {potValue.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Guess Number */}
        <div className="text-center">
          <span className="text-xs text-gray-500 tracking-widest font-semibold">
            GUESS #{guesses.length + 1}
          </span>
        </div>
      </div>

      {/* GUESSED WORDS - Chat-style: newest at bottom, scroll up for history */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col justify-end">
        {guesses.map((word, i) => (
          <div key={i} className="mb-2" role="group" aria-label={`Row ${i + 1}`}>
            <StaticRow word={word} target={targetWord} />
          </div>
        ))}
      </div>

      {/* CURRENT GUESS INPUT with Trash and Help buttons */}
      {phase === 'PLAYING' && (
        <div className="px-4 pb-3">
          {errorMessage && (
            <div className="text-center mb-2">
              <span className="text-[#F44336] font-bold text-xs tracking-wide">
                {errorMessage.toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex items-center justify-center gap-2">
            {/* Guess Field - Smaller tiles (35px) with gaps */}
            <div className="flex gap-1.5" role="group" aria-label="Current guess">
              {Array.from({ length: 5 }).map((_, i) => (
                <TileFrame
                  key={i}
                  char={currentGuess[i] || ''}
                  status="initial"
                  size={35}
                />
              ))}
            </div>

          </div>
        </div>
      )}

      {/* GAME OVER MESSAGES - Only show LOST */}
      {phase === 'LOST' && (
        <div className="mx-4 mb-4 p-3 bg-[#1E1E1E] rounded border border-[#F44336]/30 text-center">
          <h2 className="text-lg font-bold text-[#F44336] mb-1.5 tracking-wider">CONTRACT BREACHED</h2>
          <p className="mb-3 text-gray-400 text-sm">Target: <span className="text-white font-bold">{targetWord}</span></p>
          <button
            onClick={() => onExit(bankScore)}
            className="bg-gray-700 text-white px-6 py-2.5 rounded font-bold w-full hover:brightness-110 transition text-sm"
          >
            PICK NEW CONTRACT
          </button>
        </div>
      )}

      {/* KEYBOARD */}
      {phase === 'PLAYING' && (
        <div className="w-full">
          <Keyboard
            onKeyPress={(key) => handleInput(key)}
            keyStatuses={keyStatuses}
            contractColor={riskColor}
          />
        </div>
      )}

      {/* Leaderboard Modal */}
      <Leaderboard
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />

      {/* Warning Popup - Last Contract Guess */}
      <WarningPopup
        isOpen={showWarning}
        guessesRemaining={contract ? contract.guesses - guesses.length : 0}
        currentPot={potValue}
        onContinue={closeWarning}
      />

      {/* Celebration Popup - Win */}
      <CelebrationPopup
        isOpen={showCelebration}
        winnings={lastWinnings}
        guessCount={guesses.length}
        contractGuesses={contract?.guesses || 0}
        currentBank={bankScore - lastWinnings}
        newBank={bankScore}
        onClose={closeCelebration}
        onExit={() => onExit(bankScore)} // Pass bank score on win exit
      />

      {/* Accessibility Announcer */}
      <Announcer message={announcement} />
    </div>
  );
};

// Helper Component for history rows
const StaticRow = ({ word, target }: { word: string, target: string }) => {
  const getStatuses = () => {
    const stats: TileStatus[] = Array(5).fill('absent');
    const tArr = target.split('');
    const wArr = word.split('');

    wArr.forEach((c, i) => {
      if (c === tArr[i]) { stats[i] = 'correct'; tArr[i] = '#'; wArr[i] = '*'; }
    });
    wArr.forEach((c, i) => {
      if (c === '*') return;
      const idx = tArr.indexOf(c);
      if (idx !== -1) { stats[i] = 'present'; tArr[idx] = '#'; }
    });
    return stats;
  };

  const statuses = getStatuses();

  return (
    <div className="flex justify-center gap-1.5">
      {word.split('').map((char, i) => (
        <TileFrame key={i} char={char} status={statuses[i] || 'initial'} size={35} />
      ))}
    </div>
  );
};

// Contract Icon Component
const ContractIcon: React.FC<{ icon: ContractTier['icon'], color: string, size?: number }> = ({ icon, color, size = 16 }) => {
  const style = { width: `${size}px`, height: `${size}px` };

  switch (icon) {
    case 'shield':
      return (
        <svg style={style} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg style={style} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'warning':
      return (
        <svg style={style} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'fire':
      return (
        <svg style={style} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      );
    case 'octagon':
      return (
        <svg style={style} fill={color} viewBox="0 0 24 24">
          <path d="M16.5 2h-9L2 7.5v9L7.5 22h9l5.5-5.5v-9L16.5 2zm-4.5 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4h-2V7h2v5z" />
        </svg>
      );
    default:
      return null;
  }
};
