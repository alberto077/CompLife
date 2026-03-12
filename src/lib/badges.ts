import { prisma } from "./prisma";

// Define the static list of all available badges in the system
export const BADGES_CATALOG = [
  {
    name: "First Blood",
    description: "Completed your first custom quest.",
    icon: "Award",
  },
  {
    name: "Overachiever",
    description: "Reached Level 5 overall.",
    icon: "Target",
  },
  {
    name: "Open Source Contributor",
    description: "Successfully synced at least 1 GitHub commit.",
    icon: "Github",
  },
  {
    name: "10x Developer",
    description: "Synced 100+ GitHub commits.",
    icon: "Zap",
  },
  {
    name: "Algorithm Initiate",
    description: "Synced 10+ LeetCode problems.",
    icon: "CodeSquare",
  },
  {
    name: "Consistent Grinder",
    description: "Reached Level 10 overall.",
    icon: "Flame",
  }
];

export async function evaluateBadges(userId: string) {
  // Fetch user profile with everything needed to evaluate
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tasks: { where: { completed: true } },
      activityLogs: true,
      badges: true,
    } as any // Bypass strict TS errors before server restarts
  });

  if (!user) return;

  const earnedBadgeNames = new Set((user as any).badges.map((b: any) => b.name));
  const newBadgesToAward = [];

  // Evaluate "First Blood"
  if (!earnedBadgeNames.has("First Blood") && user.tasks.length >= 1) {
    newBadgesToAward.push(BADGES_CATALOG.find(b => b.name === "First Blood"));
  }

  // Evaluate "Overachiever"
  if (!earnedBadgeNames.has("Overachiever") && user.level >= 5) {
    newBadgesToAward.push(BADGES_CATALOG.find(b => b.name === "Overachiever"));
  }

  // Evaluate "Consistent Grinder"
  if (!earnedBadgeNames.has("Consistent Grinder") && user.level >= 10) {
    newBadgesToAward.push(BADGES_CATALOG.find(b => b.name === "Consistent Grinder"));
  }

  // Evaluate "Open Source Contributor" & "10x Developer"
  // Calculate total integrated commits
  let totalCommits = 0;
  for (const log of (user as any).activityLogs.filter((l: any) => l.actionType === "GITHUB_SYNC")) {
     if (log.description) {
       const match = log.description.match(/(\d+)\s+commit/);
       if (match) totalCommits += parseInt(match[1], 10);
     }
  }

  if (!earnedBadgeNames.has("Open Source Contributor") && totalCommits >= 1) {
    newBadgesToAward.push(BADGES_CATALOG.find(b => b.name === "Open Source Contributor"));
  }
  
  if (!earnedBadgeNames.has("10x Developer") && totalCommits >= 100) {
    newBadgesToAward.push(BADGES_CATALOG.find(b => b.name === "10x Developer"));
  }

  // Evaluate "Algorithm Initiate"
  let lcProblems = 0;
  // Based on actions.ts logic the description holds "LeetCode Sync: 15"
  const lcLogs = (user as any).activityLogs
    .filter((l: any) => l.actionType === "LEETCODE_SYNC")
    .sort((a: any, b: any) => b.date.getTime() - a.date.getTime()); // newest first

  if (lcLogs.length > 0 && lcLogs[0].description) {
      const match = lcLogs[0].description.match(/\d+$/);
      if (match) lcProblems = parseInt(match[0], 10);
  }

  if (!earnedBadgeNames.has("Algorithm Initiate") && lcProblems >= 10) {
    newBadgesToAward.push(BADGES_CATALOG.find(b => b.name === "Algorithm Initiate"));
  }

  // Award the new badges
  const validBadges = newBadgesToAward.filter(Boolean) as typeof BADGES_CATALOG;
  
  if (validBadges.length > 0) {
    await (prisma as any).badge.createMany({
      data: validBadges.map(b => ({
        name: b.name,
        description: b.description,
        icon: b.icon,
        userId: user.id
      }))
    });
  }

  return validBadges;
}
