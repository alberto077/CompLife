# Phase 2 Readiness: Audit & Bug Report

I have performed a source-code review of the new Phase 2 changes including the new Database parameters, NextAuth credential handling, AI integration, and the GitHub/LeetCode integration functionality. Overall, the integration logic is very neat!

I did, however, find two logic flaws that should be resolved before scaling the app any further.

## Bugs Found

### 1. GitHub "Once-Per-Day" Sync Trap
* **Location:** `src/app/actions.ts` -> `syncIntegrations()`
* **Issue:** The GitHub sync utilizes a strict `if (!loggedToday)` blocker. If a user pushes 1 commit in the morning and hits "Sync", they get 10 XP and a `GITHUB_SYNC` log is created for today. If they push 5 more commits in the afternoon and hit "Sync" again, the function sees the morning's log, prints `"GitHub already synced for today"`, and grants **0 XP** for the new 5 commits. Those commits are permanently lost relative to the user's progression system!
* **Proposed Fix:** We need to adapt the differential logic you built for LeetCode. Instead of locking the sync for the rest of the day, we should read the total `commitsToday` and subtract any commits already credited to the user for that day, granting XP only for the difference.

### 2. Registration XP Curve Mismatch
* **Location:** `src/app/api/auth/register/route.ts`
* **Issue:** The API route hardcodes the newly created user to `xpToNextLevel: 100`. But in `schema.prisma`, the global application default is explicitly `xpToNextLevel = 200`. This creates a broken, wildly fast initial XP curve for users who sign up via Email vs those who sign up via Demo/OAuth.
* **Proposed Fix:** Modify the registration endpoint to insert `xpToNextLevel: 200` to synchronize with your database schema.

---

## Action Plan
1. **Modify `src/app/actions.ts`**: Update the `GITHUB_SYNC` query to sum up previous commits processed today, and take the difference from the new `commitsToday` total.
2. **Modify `src/app/api/auth/register/route.ts`**: Standardize the XP initialization.

Let me know if you would like me to proceed with these fixes!
