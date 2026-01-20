export type InitResponse = {
  type: 'init';
  postId: string;
  count: number;
  username: string;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};

// User data response
export type UserDataResponse = {
  type: 'user-data';
  username: string;
  bank: number;
  solvedWords: string[];
};

// Save game request/response
export type SaveGameRequest = {
  word: string;
  winnings: number;
  guessCount: number;
  contractId: string;
};

export type SaveGameResponse = {
  type: 'save-game';
  newBank: number;
  totalSolved: number;
};

// Leaderboard types
export type LeaderboardEntry = {
  username: string;
  bank: number;
  rank: number;
};

export type LeaderboardResponse = {
  type: 'leaderboard';
  entries: LeaderboardEntry[];
};
