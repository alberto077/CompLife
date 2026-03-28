# CompLife

CompLife is a personal progress tracker that gamifies your daily habits, tasks, and skills. Users can earn XP and level up by completing daily quests and improving core skills. It helps motivate users by applying RPG mechanics to real-life productivity.

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion
- **Backend/Database:** Prisma ORM, Supabase (PostgreSQL)
- **Authentication:** NextAuth.js (Email/Password & GitHub)
- **Deployment:** Vercel

## Running Locally
1. Add a `.env` file with your Supabase database keys (`DATABASE_URL`, `DIRECT_URL`) and NextAuth secrets.
2. Run `npm install`
3. Run `npm run dev` to start the app at `localhost:3000`.
