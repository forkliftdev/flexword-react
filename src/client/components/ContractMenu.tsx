import React from 'react';
import { CONTRACTS, ContractTier } from '../types';
interface ContractMenuProps {
  onSelect: (contract: ContractTier) => void;
}

export const ContractMenu: React.FC<ContractMenuProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 bg-reddit-dark text-white min-h-screen font-sans">
      
      {/* Title Section */}
      <h1 className="text-4xl font-bold mb-2 tracking-wider">FlexWord</h1>
      
      {/* Visual Header (The example grid from screenshot) */}
      <div className="mb-8 opacity-80">
        {/* Placeholder for the 'SABER' visual if needed later */}
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wide">How Many Guesses?</h2>
        <p className="text-xs text-gray-400">Bid to open contract</p>
      </div>

      {/* The List of Buttons */}
      <div className="w-full space-y-3">
        {CONTRACTS.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onSelect(tier)}
            className={`
              w-full flex items-center justify-between px-4 py-3 rounded-lg shadow-lg
              transform transition-transform active:scale-95 hover:brightness-110
              text-black font-bold ${tier.color}
            `}
          >
            {/* Left: Icon + Guesses */}
            <div className="flex items-center space-x-3 w-1/3">
              <ContractIcon icon={tier.icon} />
              <span className="text-lg">{tier.guesses} Guesses</span>
            </div>

            {/* Center: Label */}
            <div className="w-1/3 text-center border-l border-r border-black/20">
              <span className="uppercase text-sm tracking-widest">{tier.label}</span>
            </div>

            {/* Right: Multiplier */}
            <div className="w-1/3 text-right">
              <span className="text-xl">{tier.multiplier}x</span>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Instructions */}
      <div className="mt-8 text-center text-gray-400 text-sm max-w-xs">
        <p className="font-bold text-gray-300 mb-1">Unlimited guesses...</p>
        <p>miss your turn lose half your bid.</p>
        <p>Score halved every turn after bid.</p>
      </div>
    </div>
  );
};

// Helper Component for the icons
const ContractIcon: React.FC<{ icon: ContractTier['icon'] }> = ({ icon }) => {
  const size = "w-6 h-6";
  switch (icon) {
    case 'shield': // Shield Icon
      return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case 'briefcase': // Briefcase Icon
      return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case 'warning': // Triangle Alert
      return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
    case 'fire': // Flame
      return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>;
    case 'skull': // Skull & Crossbones
      return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 4.5L16.5 4.5M4 8l16 0M4.5 16.5l15 0M9 20h6M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364" /></svg>; // Simplified crossed placeholder
    default:
      return null;
  }
};