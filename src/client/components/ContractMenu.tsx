import React from 'react';
import { CONTRACTS, ContractTier } from '../types';
import { TileFrame } from './TileFrame';

interface ContractMenuProps {
  onSelect: (contract: ContractTier) => void;
}

export const ContractMenu: React.FC<ContractMenuProps> = ({ onSelect }) => {
  // TODO: Get actual bank score from game state
  const bankScore = 0;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-6 bg-[#121212] text-white min-h-screen">
      
      {/* Header with Logo and Bank */}
      <div className="w-full flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <svg className="w-8 h-8 text-[#007ACC]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <h1 className="text-2xl font-black tracking-wider text-[#E0E0E0]">FlexWord</h1>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 font-bold">BANK</div>
          <div className="text-[#FFC72C] font-bold text-lg">{bankScore.toLocaleString()}</div>
        </div>
      </div>

      {/* Example Grid: SABLE / SABER - Smaller */}
      <div className="mb-6 p-2 bg-[#1E1E1E] rounded-lg border border-white/10">
        <div className="flex gap-1 mb-1 justify-center">
          <TileFrame char="S" status="correct" size={30} />
          <TileFrame char="A" status="correct" size={30} />
          <TileFrame char="B" status="correct" size={30} />
          <TileFrame char="L" status="absent" size={30} />
          <TileFrame char="E" status="present" size={30} />
        </div>
        <div className="flex gap-1 justify-center">
          <TileFrame char="S" status="correct" size={30} />
          <TileFrame char="A" status="correct" size={30} />
          <TileFrame char="B" status="correct" size={30} />
          <TileFrame char="E" status="correct" size={30} />
          <TileFrame char="R" status="correct" size={30} />
        </div>
      </div>

      {/* Title Section */}
      <div className="text-center mb-5">
        <h2 className="text-lg font-bold uppercase tracking-wide">How Many Guesses?</h2>
        <p className="text-xs text-gray-500 tracking-wider">BID TO OPEN CONTRACT</p>
        <p className="text-xs text-[#FFC72C] mt-1">10,000 pts to solve the puzzle</p>
      </div>

      {/* Contract Buttons - 50% Thinner */}
      <div className="w-full space-y-2 mb-4 flex-1">
        {CONTRACTS.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onSelect(tier)}
            className={`
              w-full h-[45px] flex items-center px-3 rounded-lg shadow-lg
              transform transition-all active:scale-95 hover:brightness-110
              text-black font-bold ${tier.color}
            `}
          >
            {/* Left: Icon + Guesses - Smaller Icons */}
            <div className="flex items-center gap-2 flex-1">
              <ContractIcon icon={tier.icon} size={20} />
              <span className="text-base font-bold">{tier.guesses} Guesses</span>
            </div>

            {/* Center: Label with dividers */}
            <div className="flex items-center gap-2">
              <div className="w-px h-6 bg-black/20" />
              <span className="uppercase text-sm tracking-wider font-bold w-16 text-center">
                {tier.label}
              </span>
              <div className="w-px h-6 bg-black/20" />
            </div>

            {/* Right: Multiplier */}
            <div className="flex-1 text-right">
              <span className="text-lg font-black">{tier.multiplier}x</span>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Instructions - Tighter Line Spacing */}
      <div className="mt-auto text-center text-gray-500 text-xs max-w-xs">
        <p className="font-bold text-gray-400 mb-0">Unlimited guesses...</p>
        <p className="leading-[1.2]">miss your turn lose half your bid.</p>
        <p className="leading-[1.2]">Score halved every turn after bid.</p>
      </div>
    </div>
  );
};

// Helper Component for the icons - Smaller Size
const ContractIcon: React.FC<{ icon: ContractTier['icon'], size?: number }> = ({ icon, size = 20 }) => {
  const className = `text-black/80`;
  const style = { width: `${size}px`, height: `${size}px` };
  
  switch (icon) {
    case 'shield':
      return (
        <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'warning':
      return (
        <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'fire':
      return (
        <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      );
    case 'octagon':
      // Octagon (stop sign shape) for EXTREME
      return (
        <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.5 2h-9L2 7.5v9L7.5 22h9l5.5-5.5v-9L16.5 2zm-4.5 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4h-2V7h2v5z"/>
        </svg>
      );
    default:
      return null;
  }
};
