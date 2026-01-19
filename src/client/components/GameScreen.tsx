import React, { useEffect } from 'react';
import { useFlexword } from '../hooks/useFlexword';
import { TileFrame } from './TileFrame';
import { ContractTier, TileStatus } from '../types';
import { Keyboard } from './Keyboard';

interface GameScreenProps {
  contract: ContractTier;
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ contract, onExit }) => {
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

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-white p-4 max-w-md mx-auto font-mono">
      
      {/* APP BAR */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
        <button onClick={onExit} className="text-white/70 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-black tracking-wide text-[#007ACC]">FlexWord</h1>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 font-bold">BANK</div>
          <div className="text-[#FFC72C] font-bold text-base font-mono">0</div>
        </div>
      </div>

      {/* HUD: Contract Ticket + POT */}
      <div className="mb-4 pb-3 border-b border-white/5">
        <div className="flex justify-between items-center mb-2">
          {/* Contract Ticket */}
          <div 
            className="px-3 py-2 rounded-lg border flex items-center gap-2"
            style={{ 
              backgroundColor: `${riskColor}1A`,
              borderColor: `${riskColor}80`
            }}
          >
            <ContractIcon icon={contract.icon} color={riskColor} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-wide" style={{ color: riskColor }}>
                {contract.label}
              </span>
              <span className="text-[10px] text-gray-300 font-bold">
                {contract.guesses} GUESSES
              </span>
            </div>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <span className="text-lg font-bold text-white">{contract.multiplier}x</span>
          </div>

          {/* POT Value */}
          <div className="text-right">
            <div className="text-[10px] text-gray-500 font-bold">POT</div>
            <div className={`text-3xl font-bold ${phase === 'WON' ? 'text-[#4CAF50]' : 'text-white'}`}>
              {potValue.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Guess Number */}
        <div className="text-center">
          <span className="text-sm text-gray-500 tracking-widest font-semibold">
            GUESS #{guesses.length + 1}
          </span>
        </div>
      </div>

      {/* GRID (Reverse order - newest at bottom) */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse gap-2 pb-4">
        {guesses.map((word, i) => (
          <StaticRow key={i} word={word} target={targetWord} />
        ))}
      </div>

      {/* CURRENT GUESS INPUT */}
      {phase === 'PLAYING' && (
        <div className="mb-4">
          {errorMessage && (
            <div className="text-center mb-2">
              <span className="text-[#F44336] font-bold text-sm tracking-wide">
                {errorMessage.toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <TileFrame 
                key={i} 
                char={currentGuess[i] || ''} 
                status="initial" 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* GAME OVER MESSAGES */}
      {phase === 'WON' && (
        <div className="mb-4 p-4 bg-[#1E1E1E] rounded-lg text-center border border-[#4CAF50]/30">
          <h2 className="text-xl font-bold text-[#007ACC] mb-3 tracking-wider">CONTRACT COMPLETE</h2>
          <button 
            onClick={onExit} 
            className="bg-[#007ACC] text-white px-6 py-3 rounded-lg font-bold w-full hover:brightness-110 transition"
          >
            PICK NEW CONTRACT
          </button>
        </div>
      )}
      
      {phase === 'LOST' && (
        <div className="mb-4 p-4 bg-[#1E1E1E] rounded-lg text-center border border-[#F44336]/30">
          <h2 className="text-xl font-bold text-[#F44336] mb-2 tracking-wider">CONTRACT BREACHED</h2>
          <p className="mb-4 text-gray-400">Target: <span className="text-white font-bold">{targetWord}</span></p>
          <button 
            onClick={onExit} 
            className="bg-gray-700 text-white px-6 py-3 rounded-lg font-bold w-full hover:brightness-110 transition"
          >
            PICK NEW CONTRACT
          </button>
        </div>
      )}

      {/* KEYBOARD */}
      {phase === 'PLAYING' && (
        <div className="mt-auto w-full max-w-md">
          <Keyboard 
            onKeyPress={(key) => handleInput(key)} 
            keyStatuses={keyStatuses}
          />
          <p className="text-xs text-gray-600 text-center mt-2">TYPE TO GUESS • SPACE FOR _</p>
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
    <div className="flex justify-center gap-1.5">
      {word.split('').map((char, i) => (
        <TileFrame key={i} char={char} status={statuses[i]} />
      ))}
    </div>
  );
};

// Contract Icon Component
const ContractIcon: React.FC<{ icon: ContractTier['icon'], color: string }> = ({ icon, color }) => {
  const size = "w-4 h-4";
  
  switch (icon) {
    case 'shield':
      return (
        <svg className={size} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg className={size} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'warning':
      return (
        <svg className={size} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'fire':
      return (
        <svg className={size} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      );
    case 'skull':
      return (
        <svg className={size} fill={color} viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 3.69 2.47 6.86 6 8.25V22h8v-1.75c3.53-1.39 6-4.56 6-8.25 0-5.52-4.48-10-10-10zm-2 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-7c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zM8 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
      );
    default:
      return null;
  }
};
