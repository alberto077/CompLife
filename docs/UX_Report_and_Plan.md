# UX Feature Loop Audit & Bug Fix Plan

## UX Bug Report: Broken Feature Loops

During our audit of the application's user flows, we identified the following critical loops that break seamless interaction:

1. **Dead End Navigation (Settings Page)**
   - **Issue:** The left navigation sidebar includes a link to "Settings" (`/dashboard/settings`).
   - **Impact:** The `src/app/dashboard/settings` directory doesn't exist, so clicking this link results in a `404 Not Found` error, breaking the user's navigational flow.

2. **Trapped Demo / Permanent Data State (Account Management)**
   - **Issue:** The application provides a "Try Demo Account" button, which logs the user in as a standard mock user (`demo@aura.com`). However, once data (tasks, skills, XP) is mutated, there is no way for the user to reset their progress back to baseline or delete the account.
   - **Impact:** New users testing out the platform using the demo account cannot clear previous interactions, and real authenticated users have no UX loop to control or delete their data from the platform. The only available action is disconnecting/logging out without cleaning up the database.

3. **Incomplete Account Deletion Flow**
   - **Issue:** During the analysis of the `deleteAccount()` server action, we discovered that while the function deletes the User record from the database, it fails to clear the user's local authentication state.
   - **Impact:** The NextAuth session cookie remains active in the browser. Attempting to navigate the app with a deleted database user, but valid session token, will result in severe server-side crashes when components attempt to fetch non-existent `user` data.

---

## Bug Fix Implementation Plan

To establish these missing feature loops and fix the deletion flow bug, we will implement the following changes:

### 1. Account Management Server Actions
**[MODIFY] `src/app/actions.ts`**
- The `resetAccount()` functionality has been added by the user, clearing all `Task`, `Skill`, and `ActivityLog` records and resetting XP. No further changes needed.
- `deleteAccount()`: Currently deletes the user via Prisma. The relational `onDelete: Cascade` rules (configured in `schema.prisma` for Tasks, Skills, Sessions, Accounts, and ActivityLogs) efficiently wipe all associated data. No changes needed on the server-side deletion logic itself.

### 2. Settings Page UI Implementation & Deletion Flow Fix
**[NEW] `src/app/dashboard/settings/page.tsx`**
- Create the server component to pull session data and mount the Settings layout.

**[NEW] `src/app/dashboard/settings/SettingsClient.tsx`**
- Create a client-side component to consume the server actions.
- Build a structured **Account Management / Danger Zone** UI section featuring two distinct, confirmation-gated buttons (to prevent accidental clicks):
  1. **Reset Progress**: Invokes `resetAccount()`, resetting XP and wiping tasks/logs, then forcing a page revalidation.
  2. **Delete Account (Bug Fix)**: Invokes `deleteAccount()`, but crucially **must immediately await NextAuth `signOut({ callbackUrl: '/' })`**. This guarantees the local session cookie is destroyed simultaneously with the database record, solving the incomplete deletion flow bug.

### Validation Plan
1. **Nav Verification:** Click the "Settings" tab in the dashboard and visually confirm we no longer hit a 404 dead end.
2. **Reset Flow:** Utilize layout functions to spawn quests and earn XP. Navigate to Settings and strike "Reset Progress" to verify the database cleanly zeroes out the stats without disconnecting.
3. **Deletion Flow Fix Verification:** Test Account Deletion by running the delete loop. Verify that Prisma cascades the deletion correctly, **and** that NextAuth explicitly clears the session cookie and kicks the user back to the landing page `/`. Logging back in via Demo should freshly re-create the user from scratch.
