# Product Roadmap: Gamified Progress Tracker

Based on a review of the current implementation (Landing Page, Dashboard, Quests, and Skills Tracker), here is a strategic roadmap to evolve the product from its current MVP state into a fully realized, engaging platform.

## 🚀 Phase 1: Core Experience & Foundation (Short-term)
**Goal:** Solidify the current manual tracking experience and deliver on the promises made on the landing page.

- **Activity Heatmap:** Implement the GitHub-style contribution heatmap on the Dashboard to visualize daily consistency. (Currently teased on the landing page).
- **Recurring Quests:** Allow users to set daily, weekly, or custom recurring tasks (e.g., "Read 10 pages daily", "Gym 3x a week").
- **Quest Prioritization:** Add drag-and-drop ordering or priority flags (Low, Medium, High) to the task list.
- **Dynamic XP Curve & Level Ups:** Implement a visual and mathematical progression curve where each subsequent skill level requires progressively more XP.
- **Dark Mode Polish & Responsive Tweaks:** Ensure all modals, forms, and charts work flawlessly on mobile devices.

## ⚡ Phase 2: Integrations & Automation (Mid-term)
**Goal:** Reduce manual data entry by connecting to the user's existing tools and automatically pulling activity.

- **OAuth & User Accounts:** Implement proper authentication (GitHub OAuth, Google) to persist user data in a database rather than local state.
- **GitHub Integration:** Automatically award coding XP when a user pushes commits or merges pull requests on tracked repositories.
- **LeetCode Integration:** Sync solved problems to auto-complete "Daily Coding" tasks.
- **Strava & Canvas Connectors:** Pull in workout data for "Health" skills and assignments for "School" skills to populate daily quests automatically.
- **AI Auto-Task Breakdown:** Use an LLM to take a large, vague goal (e.g., "Build a full-stack app") and chunk it into bite-sized daily quests.

## 🌍 Phase 3: Social & Advanced Gamification (Long-term)
**Goal:** Drive long-term retention through social accountability, rewards, and deeper game mechanics.

- **Badges & Achievements:** Grant special badges for milestones (e.g., "7-Day Streak", "Night Owl", "First Level 10 Skill").
- **Skill Trees:** Evolve the current linear skill tracker into branched "Skill Trees" where leveling up unlocks tangible platform perks (custom themes, unique profile avatars).
- **Leaderboards & Friends:** Allow users to add friends, compare levels, and compete on weekly XP leaderboards.
- **Boss Fights (Monthly Challenges):** Introduce collaborative or personal monthly challenges that require a certain amount of XP or tasks completed to defeat a "Boss" and earn exclusive loot.

---
### Recommendations for immediate next steps:
1. **Database & Auth:** Before adding more features, transition from the context-based state to a real database (e.g., Supabase or Prisma/Postgres) and add NextAuth.
2. **Heatmap Component:** Build the Heatmap component since it's highly requested and already featured heavily in your marketing design.
