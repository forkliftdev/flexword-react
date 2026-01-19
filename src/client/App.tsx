import React, { useState } from 'react';
import { ContractMenu } from './components/ContractMenu';
import { GameScreen } from './components/GameScreen';
import { ContractTier } from './types';
import './index.css'; 

const App = () => {
  const [activeContract, setActiveContract] = useState<ContractTier | null>(null);

  return (
    <div className="min-h-screen bg-[#1A1A1B] text-white font-sans">
      {!activeContract ? (
        // 1. Show the Menu
        <ContractMenu onSelect={(contract) => setActiveContract(contract)} />
      ) : (
        // 2. Show the Game
        <GameScreen 
          contract={activeContract} 
          onExit={() => setActiveContract(null)} 
        />
      )}
    </div>
  );
};

export default App;