import React from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface WarningPopupProps {
  isOpen: boolean;
  guessesRemaining: number;
  currentPot: number;
  onContinue: () => void;
}

const STORAGE_KEY = 'flexword_hide_warning';

export const WarningPopup: React.FC<WarningPopupProps> = ({
  isOpen,
  guessesRemaining,
  currentPot,
  onContinue
}) => {
  const [dontShowAgain, setDontShowAgain] = React.useState(false);

  const handleContinue = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    onContinue();
  };

  // Check if user has opted out
  React.useEffect(() => {
    const hideWarning = localStorage.getItem(STORAGE_KEY) === 'true';
    if (hideWarning && isOpen) {
      onContinue(); // Auto-continue if user opted out
    }
  }, [isOpen, onContinue]);

  // Focus trap for accessibility
  const modalRef = useFocusTrap({
    isActive: isOpen,
    onEscape: handleContinue,
  });

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-[#1E1E1E] rounded-lg p-6 max-w-md w-full border-2 border-[#FFC107] shadow-[0_0_30px_rgba(255,193,7,0.4)] animate-pulse-slow"
      >
        {/* Warning Icon */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">⚠️</div>
          <h2 className="text-xl font-black text-[#FFC107] tracking-wider">
            LAST CHANCE!
          </h2>
        </div>

        {/* Warning Message */}
        <div className="bg-[#2A2A2A] rounded p-4 mb-4 border border-[#FFC107]/30">
          <p className="text-white text-center font-bold mb-3">
            This is your final guess to fulfill the contract!
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Guesses Left:</span>
              <span className="text-[#FFC107] font-bold">{guessesRemaining}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Current Pot:</span>
              <span className="text-[#FFC72C] font-bold">{currentPot.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#3A2A1A] rounded p-3 mb-4 border border-[#FF9800]/30">
          <p className="text-xs text-gray-300 leading-relaxed">
            <span className="text-[#FF9800] font-bold">⚡ Overtime Rules:</span><br />
            If you miss, your pot will be <span className="text-[#F44336] font-bold">cut in half</span> every turn.
            You can keep playing as long as you want, but your winnings will decrease!
          </p>
        </div>

        {/* Don't Show Again Checkbox */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="dontShowAgain"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-[#2A2A2A] text-[#FFC107] focus:ring-[#FFC107] focus:ring-offset-0"
          />
          <label htmlFor="dontShowAgain" className="text-sm text-gray-300 cursor-pointer select-none">
            Don't show this warning again
          </label>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3 bg-[#FFC107] rounded font-bold text-black hover:brightness-110 transition shadow-lg"
        >
          I Understand - Continue
        </button>
      </div>
    </div>
  );
};
