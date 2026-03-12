# Phase 2 Readiness: Bug Report & Fix Plan

After auditing the recent updates you made to the XP progression system and Task logic (Priorities and Recurring tasks), I've identified two critical integration bugs that must be resolved before proceeding.

## Found Bugs

1. **Broken `Lazy Reset` for Recurring Quests**
   - **Bug:** In `src/app/actions.ts`, you added excellent logic to lazily reset recurring Daily and Weekly quests based on their `completedAt` timestamps. However, you placed this logic inside the `getUserData()` function, **which is currently never called anywhere in the codebase**. 
   - **Impact:** Because the function doesn't execute, recurring tasks will remain checked off forever and will never reset the next day/week.

2. **Desynced Sidebar UI (Ghost XP)**
   - **Bug:** `src/app/dashboard/layout.tsx` relies on the old hardcoded Level/XP calculation for its sidebar progress bar: `(totalXP % 200) / 200`. 
   - **Impact:** Now that you've implemented dynamic `currentLevelXp` and `xpToNextLevel` in the database, the sidebar UI will show completely incorrect values compared to the Overview page, breaking the user's perception of their progress.

---

## Proposed Fixes

Here is the implementation plan to patch these issues:

### 1. Fix the Sidebar UI XP Bar
**[MODIFY] `src/app/dashboard/layout.tsx`**
- Update the sidebar UI to respect the new database fields.

### 2. Trigger the Recurring Quests Reset
**[MODIFY] `src/app/dashboard/layout.tsx`**
- Instead of calling `await prisma.user.findUnique()`, we will modify the Layout to import and call `await getUserData()`.
- Because NextJS Layouts wrap every single dashboard page, this guarantees that the lazy reset check runs seamlessly in the background any time the user navigating within the app, ensuring their Daily/Weekly quests reset without manual intervention.
