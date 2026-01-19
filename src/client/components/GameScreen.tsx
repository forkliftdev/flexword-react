import React, { useEffect } from 'react';
import { useFlexword } from '../hooks/useFlexword'; // Go up one level to hooks
import { TileFrame } from './TileFrame';            // Look in THIS folder for TileFrame
import { ContractTier, TileStatus } from '../types'; // Go up one level to types
import { Keyboard } from './Keyboard'; // Check neighbor rule!

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
    targetWord
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

  return (
    <div className="flex flex-col h-screen bg-[#1A1A1B] text-white p-4 max-w-md mx-auto font-mono">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-4">
        <div className={`px-3 py-1 rounded border ${contract.color.replace('bg-', 'border-')} bg-opacity-10 flex items-center gap-2`}>
           <span className={`text-xs font-bold uppercase ${contract.color.replace('bg-', 'text-')}`}>
             {contract.label}
           </span>
           <span className="text-xl font-bold">{contract.multiplier}x</span>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 font-bold tracking-wider">POT VALUE</div>
          <div className={`text-3xl font-bold ${phase === 'WON' ? 'text-green-400' : 'text-white'}`}>
            {potValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pb-4">
        {guesses.map((word, i) => (
           <StaticRow key={i} word={word} target={targetWord} />
        ))}

        {phase === 'PLAYING' && (
          <div className="flex justify-center gap-2 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <TileFrame 
                key={i} 
                char={currentGuess[i] || ''} 
                status="initial" 
              />
            ))}
          </div>
        )}
        
        {/* GAME OVER MESSAGES */}
        {phase === 'WON' && (
            <div className="mt-4 p-4 bg-green-600 rounded text-center shadow-lg">
                <h2 className="text-2xl font-bold text-black mb-2">CONTRACT FULFILLED!</h2>
                <button onClick={onExit} className="bg-black text-white px-6 py-2 rounded-full font-bold w-full">
                    NEXT CONTRACT
                </button>
            </div>
        )}
        
        {phase === 'LOST' && (
            <div className="mt-4 p-4 bg-red-600 rounded text-center">
                 <h2 className="text-2xl font-bold">CONTRACT FAILED</h2>
                 <p className="mb-4">Word was: {targetWord}</p>
                 <button onClick={onExit} className="bg-black text-white px-6 py-2 rounded-full w-full">
                    RETURN TO BASE
                </button>
            </div>
        )}
      </div>

     {/* KEYBOARD AREA */}
      <div className="mt-auto w-full max-w-md">
        <Keyboard 
          onKeyPress={(key) => handleInput(key)} 
          keyStatuses={useFlexword().keyStatuses} // Wait, we need to extract this from the hook first!
        />
      </div>
      

      <div className="mt-auto pt-4 text-center">
         <p className="text-xs text-gray-600">TYPE TO GUESS • SPACE FOR _</p>
      </div>
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
        <div className="flex justify-center gap-2">
            {word.split('').map((char, i) => (
                <TileFrame key={i} char={char} status={statuses[i]} />
            ))}
        </div>
    );
};