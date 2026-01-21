import React, { useEffect, useState } from 'react';
import { CONTRACTS, ContractTier } from '../types';
import { TileFrame } from './TileFrame';
import { UserDataResponse } from '../../shared/types/api';

interface ContractMenuProps {
  onSelect: (contract: ContractTier) => void;
}

export const ContractMenu: React.FC<ContractMenuProps> = ({ onSelect }) => {
  const [bankScore, setBankScore] = useState(0);

  // Fetch real user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user-data');
        if (response.ok) {
          const data: UserDataResponse = await response.json();
          setBankScore(data.bank);
        }
      } catch (error) {
        console.error('Failed to load bank score', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-start w-full h-full px-4 py-4 bg-[#121212] text-white font-sans"
    >

      {/* 1. Header: Centered, Blue FlexWord */}
      {/* 1. Header: Centered, Blue FlexWord */}
      <div className="w-full flex justify-center items-center mb-1 relative">
        <h1 className="text-3xl font-black tracking-wider text-[#007ACC] uppercase">FlexWord</h1>
        <span className="absolute right-4 top-0 text-xs text-red-500 font-mono border border-red-500 px-1 rounded">v31</span>
      </div>

      {/* 2. HUD Row: Bank + Example Grid (Centered & Aligned) */}
      <div className="w-full flex justify-center items-center gap-6 mb-2">

        {/* Bank Display */}
        <div className="flex flex-col items-center justify-center p-2 bg-[#1E1E1E] rounded-lg border border-white/10 h-[50px] min-w-[100px]">
          <span className="text-xs text-gray-400 font-bold tracking-wider mb-1">BANK</span>
          <span className="text-2xl text-[#FFC72C] font-black leading-none">{bankScore.toLocaleString()}</span>
        </div>

        {/* Example Grid (Scaled down slightly to match height) */}
        <div className="flex flex-col justify-center gap-1 p-2 bg-[#1E1E1E] rounded-lg border border-white/10 h-[50px]">
          <div className="flex gap-1 justify-center">
            <TileFrame char="S" status="correct" size={18} />
            <TileFrame char="A" status="correct" size={18} />
            <TileFrame char="B" status="correct" size={18} />
            <TileFrame char="L" status="absent" size={18} />
            <TileFrame char="E" status="present" size={18} />
          </div>
          <div className="flex gap-1 justify-center">
            <TileFrame char="S" status="correct" size={18} />
            <TileFrame char="A" status="correct" size={18} />
            <TileFrame char="B" status="correct" size={18} />
            <TileFrame char="E" status="correct" size={18} />
            <TileFrame char="R" status="correct" size={18} />
          </div>
        </div>

      </div>

      {/* 3. Helper Text - Condensed & Bold */}
      <div className="text-center mb-1">
        <h2 className="text-xl font-black text-white uppercase tracking-wide leading-none mb-1">
          CHOOSE YOUR CONTRACT
        </h2>
        <p className="text-sm text-gray-300 font-bold tracking-wide">
          HIGHER RISK • HIGHER REWARD
        </p>
      </div>

      {/* 4. Contract Buttons */}
      <div className="w-full space-y-1 mb-2 flex-1 overflow-y-auto">
        {CONTRACTS.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onSelect(tier)}
            className={`
              w-full h-[50px] flex items-center justify-between px-6 rounded-lg shadow-lg
              transform transition-all active:scale-95 hover:brightness-110
              text-black font-black ${tier.color} border-2 border-transparent hover:border-white/20
            `}
          >
            {/* Left: Icon + Guesses */}
            <div className="flex items-center gap-1">
              <ContractIcon icon={tier.icon} size={24} />
              <span className="text-sm font-black">{tier.guesses}</span>
            </div>

            {/* Center: Label */}
            <div className="flex items-center gap-2">
              <div className="w-px h-6 bg-black/20" />
              <span
                className="uppercase tracking-widest font-black text-center px-1"
                style={{ fontSize: '30px', lineHeight: '1' }}
              >
                {tier.label}
              </span>
              <div className="w-px h-6 bg-black/20" />
            </div>

            {/* Right: Multiplier */}
            <div className="flex items-center">
              <span className="text-xl font-black">{tier.multiplier}x</span>
            </div>
          </button>
        ))}
      </div>

      {/* 5. Footer - Simple & Bold */}
      <div className="mt-auto text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
          UNLIMITED GUESSES • PRESERVE THE POT
        </p>
      </div>

    </div>
  );
};

// Helper Component for the icons
const ContractIcon: React.FC<{ icon: ContractTier['icon'], size?: number }> = ({ icon, size = 20 }) => {
  const className = `text-black/80`;
  const style = { width: `${size}px`, height: `${size}px` };

  switch (icon) {
    case 'shield':
      return (
        <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'warning':
      return (
        <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'fire':
      return (
        <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      );
    case 'octagon':
      return (
        <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.5 2h-9L2 7.5v9L7.5 22h9l5.5-5.5v-9L16.5 2zm-4.5 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4h-2V7h2v5z" />
        </svg>
      );
    default:
      return null;
  }
};
