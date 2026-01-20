import React from 'react';

interface BankDisplayProps {
  balance: number;
  isAnimating?: boolean;
  transferAmount?: number;
}

export const BankDisplay: React.FC<BankDisplayProps> = ({ 
  balance, 
  isAnimating = false,
  transferAmount = 0 
}) => {
  const [displayBalance, setDisplayBalance] = React.useState(balance);

  // Animate balance counting up
  React.useEffect(() => {
    if (isAnimating && transferAmount > 0) {
      const startBalance = balance - transferAmount;
      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const increment = transferAmount / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayBalance(balance);
          clearInterval(timer);
        } else {
          setDisplayBalance(Math.floor(startBalance + (increment * currentStep)));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      setDisplayBalance(balance);
    }
  }, [balance, isAnimating, transferAmount]);

  return (
    <div className="flex flex-col items-center py-3 px-4">
      {/* Label */}
      <div className="text-[10px] font-bold text-gray-400 tracking-widest mb-1">
        BANK
      </div>

      {/* Balance Display */}
      <div className={`
        text-4xl font-black tracking-tight
        ${isAnimating ? 'text-[#4CAF50] animate-pulse' : 'text-[#FFC72C]'}
        transition-all duration-300
        drop-shadow-[0_2px_8px_rgba(255,199,44,0.5)]
      `}>
        {displayBalance.toLocaleString()}
      </div>

      {/* Transfer Animation Indicator */}
      {isAnimating && transferAmount > 0 && (
        <div className="mt-2 text-sm font-bold text-[#4CAF50] animate-bounce">
          +{transferAmount.toLocaleString()}
        </div>
      )}

      {/* Decorative Icon */}
      <div className="mt-1">
        <svg 
          className={`w-6 h-6 ${isAnimating ? 'text-[#4CAF50]' : 'text-[#FFC72C]'} transition-colors duration-300`}
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      </div>
    </div>
  );
};
