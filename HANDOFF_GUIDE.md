# FlexWord - Development Handoff

## Project Overview

FlexWord is a Wordle-style word game for Reddit with a unique contract-based risk/reward system. Players choose contracts with varying difficulty (2-6 guesses) and multipliers (1.1x-10x), earning points that persist across games via Redis.

**Current Status:** Core gameplay complete, needs polish and bug fixes before launch.

---

## 🚀 Launch Readiness

### ✅ Complete

- Core game mechanics (5-letter word guessing)
- Contract system (5 tiers: Safe, Standard, Risky, Hard, Extreme)
- Visual feedback (colored shapes: circles, triangles, squares)
- Keyboard with status tracking
- Redis integration for persistence
- Bank balance system
- Leaderboard (top 10 players)
- Solved words tracking (no repeats)
- Warning popup (last contract guess)
- Celebration popup (win screen)
- Balance transfer animation
- "Don't show again" for warnings

### 🔧 Critical Before Launch

1. **Remove Debug Display** ⚠️

   - File: `src/client/components/GameScreen.tsx` (line ~86)
   - Delete the red target word badge: `🎯 {targetWord}`

2. **Fix Bank Persistence** 🐛

   - Issue: Bank balance not persisting after page refresh
   - Check: Browser console for API errors
   - Verify: `/api/user-data` endpoint returns correct data
   - Test: Win game → refresh → verify balance persists

3. **Testing Checklist**
   - [ ] All 5 contract tiers work correctly
   - [ ] Bank balance persists across sessions
   - [ ] Leaderboard updates properly
   - [ ] Solved words don't repeat
   - [ ] Warning popup timing is correct
   - [ ] Mobile/Reddit app compatibility

---

## 📋 Priority Enhancements (Next Sprint)

### High Priority

**1. Remove "NANCE" from Word Lists**

- Files: `src/client/data/words.ts` (or similar)
- Search for "NANCE" and remove from valid/target word lists

**2. Fix Bank Memory Problem**

- Debug `/api/user-data` endpoint
- Verify Redis connection
- Add error handling for failed loads
- Test with multiple users

**3. Yellow Triangle Readability**

- File: `src/client/index.css`
- Add text outline to `.tile-triangle > *` and `.key-triangle > *`
- Suggestion: `text-shadow: 0 0 2px rgba(0,0,0,0.8);` or `-webkit-text-stroke: 0.5px rgba(0,0,0,0.3);`

**4. Reformat Game Screen**

- Move guess history to top (currently at bottom)
- Restyle "GUESS #7" to match victory popup format
- Example: "Solved in 4/5 guesses" instead of "GUESS #5"

**5. Add Logo to Contract Selection Screen**

- Create/import FlexWord logo
- Place at top of bid screen
- Match branding from game screen

### Medium Priority

**6. Display Bank on Contract Selection Screen**

- Show current bank balance prominently
- Helps players make informed contract choices

**7. Contract-Themed Keyboard Colors**

- Tint keyboard background based on selected contract
- Safe = green tint, Extreme = red tint, etc.
- Subtle effect, don't overwhelm

**8. Words Solved Counter**

- Display total words solved in UI
- Could be in header or profile area

**9. User Rank Display**

- Show player's current leaderboard rank
- Update after each game

---

## 🎯 Future Features (Backlog)

### Social Features

- **Sharing** - Share results to Reddit/social media
- **Challenge Mode** - Challenge specific users
- **Ask for Help** - Request hints from fellow Redditors (splits pot)

### Leaderboard Enhancements

- Daily/weekly/all-time filters
- Average score per word
- Average guesses per solve
- Personal best tracking

### Polish

- Sound effects (balance transfer, win, loss)
- Confetti animation on win
- Vibration feedback (mobile)
- Word pool exhaustion detection
- Loading states for API calls
- Offline mode handling

---

## 🏗️ Architecture Overview

### Frontend (`src/client/`)

- **React + TypeScript + Vite**
- **Tailwind CSS** for styling
- **Key Components:**
  - `GameScreen.tsx` - Main game interface
  - `Keyboard.tsx` - Interactive keyboard
  - `BankDisplay.tsx` - Animated balance display
  - `CelebrationPopup.tsx` - Win screen
  - `WarningPopup.tsx` - Last guess warning
  - `Leaderboard.tsx` - Top players
  - `TileFrame.tsx` - Letter tiles with shapes

### Backend (`src/server/`)

- **Express.js** server
- **Redis** for persistence
- **Key Files:**
  - `index.ts` - API routes
  - `core/redis-service.ts` - Data layer
  - `core/post.ts` - Reddit post creation

### API Endpoints

- `GET /api/user-data` - Fetch bank & solved words
- `POST /api/save-game` - Save win, update bank/leaderboard
- `GET /api/leaderboard?limit=10` - Top players

### Redis Keys

- `user:{username}:bank` - Bank balance (integer)
- `user:{username}:solved` - Set of solved words
- `leaderboard:global` - Sorted set (score = bank)

---

## 🐛 Known Issues

1. **Bank persistence not working** - Top priority fix
2. **Warning popup timing** - Recently fixed, needs testing
3. **No word pool exhaustion handling** - Could run out of unsolved words
4. **No error states** - If Redis fails, no user feedback

---

## 🧪 Testing Guide

### Local Testing

```bash
npm run dev:devvit -- flexword_dev
```

### Manual Test Cases

**Contract Flow:**

1. Select each contract tier (Safe → Extreme)
2. Verify multipliers and guess limits
3. Test overtime (exceed contract guesses)

**Bank Persistence:**

1. Win a game, note bank balance
2. Refresh page
3. Verify balance persists
4. Win another game
5. Verify balance accumulates

**Warning Popup:**

- 2-guess contract: Should show after 1st miss
- 5-guess contract: Should show after 4th miss
- Never show on wins

**Celebration Popup:**

- Shows after balance transfer
- Displays correct stats
- "Choose Next Contract" returns to selection
- "View Game" closes popup

**Leaderboard:**

- Win games to increase score
- Check leaderboard updates
- Verify rank ordering
- Test with multiple users

---

## 📦 Deployment

### Build

```bash
npm run build
```

### Deploy to Reddit

```bash
npm run deploy
```

### Launch

```bash
npm run launch
```

---

## 🔑 Key Files Reference

### Must Review Before Launch

- `src/client/components/GameScreen.tsx` - Remove debug display
- `src/client/hooks/useFlexword.ts` - Core game logic
- `src/server/core/redis-service.ts` - Data persistence
- `src/client/data/words.ts` - Remove "NANCE"

### Visual Polish

- `src/client/index.css` - Global styles, animations
- `src/client/components/BankDisplay.tsx` - Balance animation
- `src/client/components/CelebrationPopup.tsx` - Win screen

### Configuration

- `devvit.json` - Reddit app config
- `app.yaml` - App metadata
- `package.json` - Dependencies

---

## 💡 Development Notes

### LocalStorage Keys

- `flexword_hide_warning` - User opted out of warning popup

### Animation Timings

- Balance transfer: 1.5s (60 steps)
- Celebration popup delay: 1.6s (after transfer)
- Popup animations: 0.3s (fadeIn, scaleIn)

### Color Scheme

- Tech Blue: `#007ACC` (brand)
- Caution Amber: `#FFC72C` (bank, present)
- Correct: Blue circles
- Present: Yellow triangles
- Absent: Dark grey squares

---

## 🎨 Design System

### Contract Colors

- Safe: `#4CAF50` (green)
- Standard: `#2196F3` (blue)
- Risky: `#FFC107` (amber)
- Hard: `#FF9800` (orange)
- Extreme: `#F44336` (red)

### Typography

- Font: Roboto (400, 700, 900)
- Bold on yellow: 900 weight for contrast

---

## 📞 Questions for Next Developer

1. **Redis Connection** - Is it connecting properly? Check server logs.
2. **Word Lists** - Where are valid/target words stored? Need to remove "NANCE".
3. **Mobile Testing** - Has this been tested in Reddit mobile app?
4. **Rate Limiting** - Should we limit API calls to prevent abuse?
5. **Word Pool** - What happens when user solves all words?

---

## ✨ What's Working Well

- Visual polish is excellent (animations, colors, feedback)
- Game mechanics are solid and engaging
- Contract system provides good risk/reward balance
- Popups provide clear user guidance
- Code is well-structured and maintainable

---

**Last Updated:** January 19, 2026  
**Status:** Pre-launch (needs bug fixes and testing)  
**Estimated Launch:** 1 week after bank persistence fix
