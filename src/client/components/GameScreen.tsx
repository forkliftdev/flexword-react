import React, { useEffect, useState } from 'react';
import { useFlexword } from '../hooks/useFlexword';
import { TileFrame } from './TileFrame';
import { ContractTier, TileStatus } from '../types';
import { Keyboard } from './Keyboard';

interface GameScreenProps {
  contract: ContractTier;
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ contract, onExit }) => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  const { 
    phase, 
    guesses, 
    currentGuess, 
    potValue, 
    errorMessage, 
    handleInput, 
    startGame,
    targetWord,
    keyStatuses
  } = useFlexword();

  useEffect(() => {
    startGame(contract);
  }, []);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleInput(e.key);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [handleInput]);

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

  const handleTrash = () => {
    // Clear current guess
    while (currentGuess.length > 0) {
      handleInput('BACKSPACE');
    }
  };

  const handleGiveUp = () => {
    setShowHelpModal(true);
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-white max-w-md mx-auto">
      
      {/* APP BAR */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
        <button onClick={onExit} className="text-white/70 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-black tracking-wide text-[#007ACC]">FlexWord</h1>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 font-bold">BANK</div>
          <div className="text-[#FFC72C] font-bold text-sm">0</div>
        </div>
      </div>

      {/* HUD: Contract Ticket + POT */}
      <div className="px-4 py-3 border-b border-white/5">
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

      {/* GUESSED WORDS - Directly above guess field, stacked like chat */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col justify-end">
        {guesses.map((word, i) => (
          <div key={i} className="mb-1.5">
            <StaticRow word={word} target={targetWord} />
          </div>
        ))}
      </div>

      {/* CURRENT GUESS INPUT with Trash and Help buttons */}
      {phase === 'PLAYING' && (
        <div className="px-4 pb-2">
          {errorMessage && (
            <div className="text-center mb-1">
              <span className="text-[#F44336] font-bold text-xs tracking-wide">
                {errorMessage.toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex items-center justify-center gap-2">
            {/* Trash Button */}
            <button
              onClick={handleTrash}
              className="p-2 bg-[#1E1E1E] rounded border border-white/10 hover:brightness-110 transition"
              title="Clear guess"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* Guess Field - Smaller tiles with gaps */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <TileFrame 
                  key={i} 
                  char={currentGuess[i] || ''} 
                  status="initial"
                  size={40}
                />
              ))}
            </div>

            {/* Help Button */}
            <button
              onClick={handleGiveUp}
              className="p-2 bg-[#1E1E1E] rounded border border-white/10 hover:brightness-110 transition"
              title="Help options"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* GAME OVER MESSAGES */}
      {phase === 'WON' && (
        <div className="mx-4 mb-3 p-3 bg-[#1E1E1E] rounded border border-[#4CAF50]/30 text-center">
          <h2 className="text-lg font-bold text-[#007ACC] mb-2 tracking-wider">CONTRACT COMPLETE</h2>
          <button 
            onClick={onExit} 
            className="bg-[#007ACC] text-white px-6 py-2.5 rounded font-bold w-full hover:brightness-110 transition text-sm"
          >
            PICK NEW CONTRACT
          </button>
        </div>
      )}
      
      {phase === 'LOST' && (
        <div className="mx-4 mb-3 p-3 bg-[#1E1E1E] rounded border border-[#F44336]/30 text-center">
          <h2 className="text-lg font-bold text-[#F44336] mb-1.5 tracking-wider">CONTRACT BREACHED</h2>
          <p className="mb-3 text-gray-400 text-sm">Target: <span className="text-white font-bold">{targetWord}</span></p>
          <button 
            onClick={onExit} 
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
          />
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1E1E1E] rounded-lg p-5 max-w-sm w-full border border-white/10">
            <h3 className="text-lg font-bold mb-3 text-[#007ACC]">Need Help?</h3>
            <div className="space-y-2 mb-4">
              <button className="w-full p-3 bg-[#2A2A2A] rounded text-left hover:brightness-110 transition border border-white/10">
                <div className="font-bold text-sm">Buy a Letter Hint</div>
                <div className="text-xs text-gray-400">Reveal one correct letter (5,000 pts)</div>
              </button>
              <button className="w-full p-3 bg-[#2A2A2A] rounded text-left hover:brightness-110 transition border border-white/10">
                <div className="font-bold text-sm">Send to Friend</div>
                <div className="text-xs text-gray-400">Get help and split the pot</div>
              </button>
              <button className="w-full p-3 bg-[#3A1A1A] rounded text-left hover:brightness-110 transition border border-[#F44336]/30">
                <div className="font-bold text-sm text-[#F44336]">Give Up</div>
                <div className="text-xs text-gray-400">Reveal answer and lose all points</div>
              </button>
            </div>
            <button 
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 bg-[#007ACC] rounded font-bold hover:brightness-110 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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
      if(c === tArr[i]) { stats[i] = 'correct'; tArr[i] = '#'; wArr[i] = '*'; }
    });
    wArr.forEach((c, i) => {
      if(c === '*') return;
      const idx = tArr.indexOf(c);
      if(idx !== -1) { stats[i] = 'present'; tArr[idx] = '#'; }
    });
    return stats;
  };

  const statuses = getStatuses();

  return (
    <div className="flex justify-center gap-1">
      {word.split('').map((char, i) => (
        <TileFrame key={i} char={char} status={statuses[i]} size={40} />
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
          <path d="M16.5 2h-9L2 7.5v9L7.5 22h9l5.5-5.5v-9L16.5 2zm-4.5 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4h-2V7h2v5z"/>
        </svg>
      );
    default:
      return null;
  }
};
