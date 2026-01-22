import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../../shared/types/api';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose, currentUsername }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  // Focus trap for accessibility
  const modalRef = useFocusTrap({
    isActive: isOpen,
    onEscape: onClose,
  });

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leaderboard?limit=10');
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-[#1E1E1E] rounded-lg p-5 max-w-md w-full border border-white/10 max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#007ACC]">🏆 Leaderboard</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          className="w-full mb-4 py-2 bg-[#2A2A2A] rounded text-sm font-bold hover:brightness-110 transition border border-white/10 disabled:opacity-50"
        >
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>

        {/* Leaderboard Entries */}
        <div className="space-y-2">
          {entries.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-8">
              No players yet. Be the first!
            </div>
          )}

          {entries.map((entry) => {
            const isCurrentUser = entry.username === currentUsername;
            const rankEmoji = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : '';

            return (
              <div
                key={entry.username}
                className={`
                  p-3 rounded flex items-center justify-between
                  ${isCurrentUser
                    ? 'bg-[#007ACC]/20 border border-[#007ACC]/50'
                    : 'bg-[#2A2A2A] border border-white/10'
                  }
                  transition-all hover:brightness-110
                `}
              >
                {/* Rank & Username */}
                <div className="flex items-center gap-3">
                  <div className={`
                    text-lg font-bold w-8 text-center
                    ${entry.rank <= 3 ? 'text-[#FFC72C]' : 'text-gray-500'}
                  `}>
                    {rankEmoji || `#${entry.rank}`}
                  </div>
                  <div>
                    <div className={`font-bold ${isCurrentUser ? 'text-[#007ACC]' : 'text-white'}`}>
                      {entry.username}
                      {isCurrentUser && <span className="ml-2 text-xs text-gray-400">(You)</span>}
                    </div>
                  </div>
                </div>

                {/* Bank Balance */}
                <div className="text-right">
                  <div className="text-[#FFC72C] font-bold text-lg">
                    {entry.bank.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-gray-500 font-bold">POINTS</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-[#007ACC] rounded font-bold hover:brightness-110 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
