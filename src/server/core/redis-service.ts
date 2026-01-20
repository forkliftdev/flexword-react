import { redis } from '@devvit/web/server';
import { LeaderboardEntry } from '../../shared/types/api';

/**
 * Redis Service Layer
 * Handles all Redis operations for user data, leaderboards, and game state
 */

// Redis Key Patterns
const KEYS = {
  userBank: (username: string) => `user:${username}:bank`,
  userSolved: (username: string) => `user:${username}:solved`,
  leaderboard: 'leaderboard:global',
};

/**
 * Get user's bank balance
 * @param username - Reddit username
 * @returns Bank balance (defaults to 0 for new users)
 */
export async function getUserBank(username: string): Promise<number> {
  const key = KEYS.userBank(username);
  const value = await redis.get(key);
  return value ? parseInt(value, 10) : 0;
}

/**
 * Update user's bank balance (add or subtract)
 * @param username - Reddit username
 * @param amount - Amount to add (positive) or subtract (negative)
 * @returns New bank balance
 */
export async function updateUserBank(username: string, amount: number): Promise<number> {
  const key = KEYS.userBank(username);
  const newBalance = await redis.incrBy(key, amount);
  return newBalance;
}

/**
 * Set user's bank balance to a specific value
 * @param username - Reddit username
 * @param balance - New balance value
 */
export async function setUserBank(username: string, balance: number): Promise<void> {
  const key = KEYS.userBank(username);
  await redis.set(key, balance.toString());
}

/**
 * Add a solved word to user's history
 * @param username - Reddit username
 * @param word - Word that was solved (uppercase)
 */
export async function addSolvedWord(username: string, word: string): Promise<void> {
  const key = KEYS.userSolved(username);
  await redis.sAdd(key, [word.toUpperCase()]);
}

/**
 * Get all words the user has solved
 * @param username - Reddit username
 * @returns Array of solved words
 */
export async function getSolvedWords(username: string): Promise<string[]> {
  const key = KEYS.userSolved(username);
  const words = await redis.sMembers(key);
  return words;
}

/**
 * Check if user has already solved a specific word
 * @param username - Reddit username
 * @param word - Word to check
 * @returns True if word was already solved
 */
export async function hasSolvedWord(username: string, word: string): Promise<boolean> {
  const key = KEYS.userSolved(username);
  return await redis.sIsMember(key, word.toUpperCase());
}

/**
 * Update user's position on the global leaderboard
 * @param username - Reddit username
 * @param newBank - New bank balance (used as score)
 */
export async function updateLeaderboard(username: string, newBank: number): Promise<void> {
  const key = KEYS.leaderboard;
  await redis.zAdd(key, { member: username, score: newBank });
}

/**
 * Get top players from the global leaderboard
 * @param limit - Number of top players to retrieve (default 10)
 * @returns Array of leaderboard entries with rank, username, and bank
 */
export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  const key = KEYS.leaderboard;

  // Get top N players (sorted by score descending)
  const results = await redis.zRange(key, 0, limit - 1, { by: 'rank', reverse: true });

  // Transform to LeaderboardEntry format
  const entries: LeaderboardEntry[] = results.map((result, index) => ({
    username: result.member,
    bank: result.score,
    rank: index + 1,
  }));

  return entries;
}

/**
 * Get a user's rank on the leaderboard
 * @param username - Reddit username
 * @returns Rank (1-indexed) or null if not on leaderboard
 */
export async function getUserRank(username: string): Promise<number | null> {
  const key = KEYS.leaderboard;
  const rank = await redis.zRank(key, username, { reverse: true });

  // zRank returns 0-indexed, we want 1-indexed
  return rank !== undefined ? rank + 1 : null;
}
