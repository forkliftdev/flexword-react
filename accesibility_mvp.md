# FlexWord MVP Accessibility Safety Checklist

**Purpose**

This document defines the *minimum accessibility-safe foundation* required for FlexWord MVP. It is **not** a full accessibility spec. Its goal is to ensure that accessibility can be added *after launch* without major refactors.

If all items in this checklist are followed, FlexWord can safely ship MVP and later gain robust screen reader and keyboard accessibility.

---

## Core Principle (Non‑Negotiable)

> **All game state must live in application state, not in the DOM or animation timing.**

Accessibility depends on explicit state, not visual effects.

Good:

* Tile state stored as `{ letter, evaluation }`
* Rows stored as arrays of tiles
* Evaluation happens independently of animation

Bad:

* Reading DOM classes to infer state
* Using animation completion to trigger logic

---

## 1. Semantic Elements (Critical)

### Tiles

Tiles must not be anonymous clickable divs.

**MVP requirement:**

* Tiles use a semantic role

```tsx
<div role="img" />
```

Tiles may later gain richer ARIA labels, but the role must exist now.

---

### Keyboard Keys (Most Important)

All on‑screen keyboard keys **must be real buttons**.

**Required:**

```tsx
<button type="button" onClick={() => pressKey(letter)}>
```

Not allowed:

* `div` with click handlers
* Pointer‑only interactions

Buttons may be fully custom‑styled.

---

## 2. Keyboard‑Only Play Must Be Possible

MVP accessibility bar:

* Tab can reach the keyboard
* Enter / Space activates keys
* Enter submits a row
* Backspace deletes

Not required for MVP:

* Perfect focus flow
* Tile‑by‑tile navigation
* Spoken output

---

## 3. One Global Announcer (Add Now, Use Later)

Add a single `aria-live` container **even if unused**.

```tsx
<div
  aria-live="polite"
  aria-atomic="true"
  style={{ position: 'absolute', left: '-9999px' }}
>
  {announcement}
</div>
```

And state:

```ts
const [announcement, setAnnouncement] = useState('');
```

This is the *foundation* for future screen reader support.

---

## 4. Row Grouping

Rows must be explicitly grouped.

```tsx
<div role="group" aria-label={`Row ${rowIndex + 1}`}>
  {tiles}
</div>
```

This prevents future refactors when adding spoken summaries.

---

## 5. Modal Focus Safety

Minimum requirements:

* Focus moves into the modal when it opens
* Escape closes the modal
* Focus returns to the keyboard when closed

Full ARIA dialog compliance may be added later.

---

## 6. No Meaning Encoded by Color Alone

Visual colors are allowed, but logic must rely on explicit state:

```ts
tile.evaluation === 'correct'
```

Never infer meaning from CSS or color.

---

## 7. Animations Must Reflect State, Never Create It

Bad:

```ts
setTimeout(() => evaluateRow(), 600);
```

Good:

```ts
evaluateRow();
animateTiles();
```

State changes must not depend on animation timing.

---

## 8. Minimum Manual Test

Before shipping MVP, verify:

> **The game can be completed start‑to‑finish without touching a mouse.**

If this fails, accessibility debt has already begun.

---

## MVP Ship Checklist

You are safe to ship if **all** are true:

* ⬜ Keyboard keys are `<button>` elements
* ⬜ Game state exists independently of DOM
* ⬜ Keyboard‑only play works
* ⬜ One `aria-live` announcer exists
* ⬜ Rows and tiles are logically grouped

If any item is false, fix before launch.

---

## Why This Matters

Other games require a browser extension to become accessible because these foundations were missing. FlexWord can avoid that entirely by following this checklist.

This document is intended for:

* Future agents
* Contributors
* Accessibility upgrades post‑MVP

**Do not remove these foundations without understanding the impact.**

Accessibility MVP Implementation Plan
The goal is to bring the FlexWord codebase into compliance with 
accesibility_mvp.md
.

Scope Note: This implementation intentionally avoids full screen reader narration rules and detailed ARIA semantics beyond roles, labels, and focus management. Those will be addressed in a post-MVP accessibility phase.

User Review Required
No major breaking changes or difficult design decisions. The changes purely add accessibility attributes and focus management logic.

Proposed Changes
Core Accessibility Infrastructure
[NEW] 
Announcer.tsx
Create a generic Announcer component that renders an aria-live="polite" region off-screen.
This will be used to announce game state changes (e.g., "Game started", "Guess accepted", "You won").
export const Announcer = ({ message }: { message: string }) => (
  <div role="status" aria-live="polite" className="sr-only">
    {message}
  </div>
);
Component Updates
[MODIFY] 
TileFrame.tsx
Add role="img" to the tile container.
Add aria-label describing the letter and its status (e.g., "A, correct", "Empty tile").
[MODIFY] 
GameScreen.tsx
Announcer: Integrate Announcer component and hook it up to game events (likely via useEffect tracking phase or errorMessage).
Row Grouping:
Update 
StaticRow
 to use role="group" and aria-label={Row ${i + 1}}.
Wrap the current guess input in a keyed container with role="group" and label "Current guess".
Modal Focus:
Implement focus management for the inline Help Modal or extract it to a component with focus trap.
[MODIFY] 
Keyboard.tsx
Verify tabIndex behavior.
Ensure keys have appropriate labels (already mostly good, but will double check functional keys).
[MODIFY] [components/*.tsx] (Modals)
CelebrationPopup
WarningPopup
Leaderboard
Add useEffect to trap focus within the modal when open.
Ensure focus is restored to the triggering element on close.
Ensure Escape key closes the modal (and doesn't trigger game events).
Shared Utilities
[NEW] 
useFocusTrap.ts
A reusable hook to handle:
Initial focus on mount.
Trapping Tab key within container.
Restoring focus on unmount.
Handling Escape key.
Verification Plan
Automated Tests
No existing accessibility test suite to run.
Manual Verification
Test 1: Keyboard-Only Playthrough

Load the app.
Without using the mouse:
Tab to "Shield" contract (or any tier).
Press Enter to select.
Tab to keyboard keys.
Type "HELLO" using Enter/Space on virtual keys (or physical keyboard if allowed, but virtual keys are the requirement).
Tab to "Enter" key and press it.
Verify "Row 1" is announced (if screen reader active) or just verifying focus stays valid.
Complete a game.
Navigate the Win/Loss popup using Tab/Enter.
Select "Next Contract".
Test 2: Screen Reader Simulation

Inspect the DOM.
Verify aria-live region updates with messages like "Not in word list" or "Game Over".
Verify Tiles have role="img" and labels like "H, correct".
Verify Rows have role="group".
Test 3: Focus Management

Open Help Modal.
Press Tab repeatedly; focus should cycle only inside the modal.
Press Escape; modal should close and focus return to the "Help" button (or logical place).

