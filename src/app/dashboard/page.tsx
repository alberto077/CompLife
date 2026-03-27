import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Heatmap } from "@/components/Heatmap";
import SyncWidget from "./SyncWidget";
import { Task, Skill } from "@prisma/client";
import { getStreakData } from "@/app/actions";
import DashboardClient from "./DashboardClient";

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  // Fetch user stats, skills, and tasks
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      skills: {
        orderBy: { level: 'desc' },
        take: 3
      },
      tasks: {
        where: { completed: false },
        orderBy: { createdAt: 'desc' },
        take: 3
      }
    }
  });

  if (!user) return null;

  const completedTasksCount = await prisma.task.count({
    where: { userId: session.user.id, completed: true }
  });

  const streakData = await getStreakData();
  
  // Determine high-priority task
  const highPriorityTask = user.tasks.find(t => t.priority === "HIGH") || user.tasks[0] || null;

  // Determine if this is a new user (for onboarding)
  const allSkills = await prisma.skill.findMany({ where: { userId: session.user.id } });
  const allTasks = await prisma.task.findMany({ where: { userId: session.user.id } });
  const isNewUser = user.level === 1 && allSkills.length === 0 && allTasks.length === 0;

  return (
    <DashboardClient
      user={{
        name: user.name,
        level: user.level,
        totalXP: user.totalXP,
        currentLevelXp: user.currentLevelXp,
        xpToNextLevel: user.xpToNextLevel,
        githubUsername: user.githubUsername,
        leetcodeUsername: user.leetcodeUsername,
      }}
      skills={user.skills}
      tasks={user.tasks}
      completedTasksCount={completedTasksCount}
      streakDays={streakData.streakDays}
      isNewUser={isNewUser}
      hasIntegrations={!!user.githubUsername || !!user.leetcodeUsername}
      highPriorityTask={highPriorityTask ? { title: highPriorityTask.title, xpReward: highPriorityTask.xpReward } : null}
    />
  );
}
