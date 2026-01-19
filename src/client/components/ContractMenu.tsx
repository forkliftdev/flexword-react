import React from 'react';
import { CONTRACTS, ContractTier } from '../types';
import { TileFrame } from './TileFrame';

interface ContractMenuProps {
  onSelect: (contract: ContractTier) => void;
}

export const ContractMenu: React.FC<ContractMenuProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-5 bg-[#121212] text-white min-h-screen font-sans">
      
      {/* Header with Logo and Bank */}
      <div className="w-full flex justify-between items-start mb-5">
        <h1 className="text-3xl font-black tracking-wider text-[#E0E0E0]">FlexWord</h1>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 font-bold">BANK</div>
          <div className="text-[#FFC72C] font-bold text-base font-mono">0</div>
        </div>
      </div>

      {/* Example Grid: SABLE / SABER */}
      <div className="mb-8 p-3 bg-[#1E1E1E] rounded-xl border border-white/10">
        <div className="flex gap-1 mb-1.5 justify-center">
          <TileFrame char="S" status="correct" size={40} />
          <TileFrame char="A" status="correct" size={40} />
          <TileFrame char="B" status="correct" size={40} />
          <TileFrame char="L" status="absent" size={40} />
          <TileFrame char="E" status="present" size={40} />
        </div>
        <div className="flex gap-1 justify-center">
          <TileFrame char="S" status="correct" size={40} />
          <TileFrame char="A" status="correct" size={40} />
          <TileFrame char="B" status="correct" size={40} />
          <TileFrame char="E" status="correct" size={40} />
          <TileFrame char="R" status="correct" size={40} />
        </div>
      </div>

      {/* Title Section */}
      <div className="text-center mb-5">
        <h2 className="text-xl font-bold uppercase tracking-wide">How Many Guesses?</h2>
        <p className="text-sm text-gray-500 tracking-wider">BID TO OPEN CONTRACT</p>
      </div>

      {/* Contract Buttons */}
      <div className="w-full space-y-3 mb-6">
        {CONTRACTS.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onSelect(tier)}
            className={`
              w-full h-[60px] flex items-center px-4 rounded-xl shadow-lg
              transform transition-all active:scale-95 hover:brightness-110
              text-black font-bold ${tier.color}
            `}
          >
            {/* Left: Icon + Guesses */}
            <div className="flex items-center gap-3 flex-1">
              <ContractIcon icon={tier.icon} />
              <span className="text-lg font-bold">{tier.guesses} Guesses</span>
            </div>

            {/* Center: Label with dividers */}
            <div className="flex items-center gap-3">
              <div className="w-px h-8 bg-black/20" />
              <span className="uppercase text-base tracking-widest font-semibold w-20 text-center">
                {tier.label}
              </span>
              <div className="w-px h-8 bg-black/20" />
            </div>

            {/* Right: Multiplier */}
            <div className="flex-1 text-right">
              <span className="text-xl font-black">{tier.multiplier}x</span>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Instructions */}
      <div className="mt-auto text-center text-gray-500 text-xs max-w-xs leading-relaxed">
        <p className="font-bold text-gray-400 mb-1">Unlimited guesses...</p>
        <p>miss your turn lose half your bid.</p>
        <p>Score halved every turn after bid.</p>
      </div>
    </div>
  );
};

// Helper Component for the icons
const ContractIcon: React.FC<{ icon: ContractTier['icon'] }> = ({ icon }) => {
  const size = "w-7 h-7";
  const color = "text-black/80";
  
  switch (icon) {
    case 'shield':
      return (
        <svg className={`${size} ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg className={`${size} ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'warning':
      return (
        <svg className={`${size} ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'fire':
      return (
        <svg className={`${size} ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      );
    case 'skull':
      return (
        <svg className={`${size} ${color}`} fill="currentColor" viewBox="0 0 24 24" strokeWidth={0}>
          <path d="M12 2C6.48 2 2 6.48 2 12c0 3.69 2.47 6.86 6 8.25V22h8v-1.75c3.53-1.39 6-4.56 6-8.25 0-5.52-4.48-10-10-10zm-2 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-7c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zM8 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
      );
    default:
      return null;
  }
};
