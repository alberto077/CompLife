# UX Feature Loop Audit & Bug Fix Plan

## UX Bug Report: Broken Feature Loops

During our audit of the application's user flows, we identified the following critical loops that break seamless interaction:

1. **Dead End Navigation (Settings Page)**
   - **Issue:** The left navigation sidebar includes a link to "Settings" (`/dashboard/settings`).
   - **Impact:** The `src/app/dashboard/settings` directory doesn't exist, so clicking this link results in a `404 Not Found` error, breaking the user's navigational flow.

2. **Trapped Demo / Permanent Data State (Account Management)**
   - **Issue:** The application provides a "Try Demo Account" button, which logs the user in as a standard mock user (`demo@aura.com`). However, once data (tasks, skills, XP) is mutated, there is no way for the user to reset their progress back to baseline or delete the account.
   - **Impact:** New users testing out the platform using the demo account cannot clear previous interactions, and real authenticated users have no UX loop to control or delete their data from the platform. The only available action is disconnecting/logging out without cleaning up the database.

---

## Bug Fix Implementation Plan

To establish these missing feature loops, we will implement the following changes:

### 1. Account Management Server Actions
**[MODIFY] `src/app/actions.ts`**
- Add `resetAccount()`: A server action that clears all `Task`, `Skill`, and `ActivityLog` records belonging to the current `session.user.id`. It will also reset the user's `totalXP` to `0`, `currentLevelXp` to `0`, and `level` to `1`.
- Add `deleteAccount()`: A server action that deletes the `User` record entirely. Due to Prisma's `onDelete: Cascade` rules explicitly defined in `schema.prisma`, this will cleanly wipe all associated relational data from the database.

### 2. Settings Page UI Implementation
**[NEW] `src/app/dashboard/settings/page.tsx`**
- Create the server component to pull session data and mount the Settings layout.

**[NEW] `src/app/dashboard/settings/SettingsClient.tsx`**
- Create a client-side component to consume the newly created server actions.
- Build a structured **Account Management / Danger Zone** UI section featuring two distinct, confirmation-gated buttons (to prevent accidental clicks):
  1. **Reset Progress**: Invokes `resetAccount()`, resetting XP and wiping tasks/logs, then forcing a page revalidation.
  2. **Delete Account**: Invokes `deleteAccount()`, hooks into NextAuth `signOut()`, and smoothly redirects the user back to the landing page `/`.

### Validation Plan
1. **Nav Verification:** Click the "Settings" tab in the dashboard and visually confirm we no longer hit a 404 dead end.
2. **Reset Flow:** Log into the Demo Account and utilize the layout functions to spawn quests and earn XP. Then, navigate to Settings and strike "Reset Progress" to verify the database cleanly zeroes out the stats without disconnecting.
3. **Deletion Flow:** Test Account Deletion by running the delete loop, verifying smooth redirect to the landing page, and ensuring NextAuth cookies are destroyed. Logging back in via Demo should freshly re-create the user from scratch.
