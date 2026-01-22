import React from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface CelebrationPopupProps {
  isOpen: boolean;
  winnings: number;
  guessCount: number;
  contractGuesses: number;
  currentBank: number;
  newBank: number;
  onClose: () => void;
  onExit: () => void;
}

export const CelebrationPopup: React.FC<CelebrationPopupProps> = ({
  isOpen,
  winnings,
  guessCount,
  contractGuesses,
  currentBank,
  newBank,
  onClose,
  onExit
}) => {
  const [displayBank, setDisplayBank] = React.useState(currentBank);

  // Animate bank balance counting up
  React.useEffect(() => {
    if (isOpen && newBank > currentBank) {
      const startBalance = currentBank;
      const difference = newBank - currentBank;
      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const increment = difference / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayBank(newBank);
          clearInterval(timer);
        } else {
          setDisplayBank(Math.floor(startBalance + (increment * currentStep)));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      setDisplayBank(newBank);
    }
  }, [isOpen, currentBank, newBank]);

  // Focus trap for accessibility
  const modalRef = useFocusTrap({
    isActive: isOpen,
    onEscape: onClose,
  });

  if (!isOpen) return null;

  const isWithinContract = guessCount <= contractGuesses;

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-gradient-to-b from-[#1E1E1E] to-[#0a0a0a] rounded-lg p-8 max-w-sm w-full border-2 border-[#4CAF50] shadow-[0_0_40px_rgba(76,175,80,0.5)] animate-scaleIn"
      >
        {/* Celebration Icon */}
        <div className="text-center mb-4">
          <div className="text-6xl mb-2 animate-bounce">
            {isWithinContract ? '🎉' : '✅'}
          </div>
          <h2 className="text-2xl font-black text-[#4CAF50] tracking-wider mb-1">
            {isWithinContract ? 'CONTRACT COMPLETE!' : 'WORD SOLVED!'}
          </h2>
          {!isWithinContract && (
            <p className="text-sm text-yellow-400 font-bold">Overtime Win</p>
          )}
        </div>

        {/* Stats */}
        <div className="bg-[#2A2A2A] rounded p-4 mb-4 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">Guesses Used:</span>
            <span className="text-white font-bold">{guessCount} / {contractGuesses}</span>
          </div>
          <div className="h-px bg-white/10 my-3"></div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">Winnings:</span>
            <span className="text-[#4CAF50] font-bold text-xl">+{winnings.toLocaleString()}</span>
          </div>
          <div className="h-px bg-white/10 my-3"></div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Bank Balance:</span>
            <span className="text-[#FFC72C] font-black text-2xl animate-pulse">
              {displayBank.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Choose Next Contract Button */}
        <button
          onClick={onExit}
          className="w-full py-3 bg-[#007ACC] rounded font-bold text-white hover:brightness-110 transition text-lg shadow-lg mb-2"
        >
          Choose Next Contract
        </button>

        {/* Continue Playing Button (for viewing game) */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-[#2A2A2A] rounded font-bold text-gray-300 hover:brightness-110 transition text-sm border border-white/10"
        >
          View Game
        </button>
      </div>
    </div>
  );
};
