import React, { useState } from 'react';
import { ContractMenu } from './components/ContractMenu';
import { GameScreen } from './components/GameScreen';
import { ContractTier } from './types';
import './index.css'; 

const App = () => {
  const [activeContract, setActiveContract] = useState<ContractTier | null>(null);

  return (
    <div className="w-full h-screen bg-transparent text-white font-sans p-4 flex items-center justify-center">
      <div className="w-full h-full max-w-[500px] bg-[#1A1A1B] rounded-2xl shadow-2xl overflow-hidden">
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
    </div>
  );
};

export default App;
