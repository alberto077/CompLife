"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { fetchGitHubCommits, fetchLeetCodeGenerals } from "@/lib/integrations"
import { generateAITaskBreakdown } from "@/lib/ai"

const XP_MULTIPLIER = 1.5;

function calculateLevelAndXP(currentXp: number, addedXp: number, currentLevel: number, currentXpToNext: number) {
  let newXp = currentXp + addedXp;
  let newLevel = currentLevel;
  let newXpToNext = currentXpToNext;

  while (newXp >= newXpToNext) {
    newXp -= newXpToNext;
    newLevel += 1;
    newXpToNext = Math.floor(newXpToNext * XP_MULTIPLIER);
  }

  return { newXp, newLevel, newXpToNext };
}

export async function getUserData() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  // Lazy Reset Recurring Quests
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Daily Quests completed before today
  await prisma.task.updateMany({
    where: {
      userId: session.user.id,
      isRecurring: true,
      recurringType: "DAILY",
      completed: true,
      completedAt: { lt: today }
    },
    data: { completed: false, completedAt: null }
  });

  // Weekly Quests completed before 7 days ago
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);
  await prisma.task.updateMany({
    where: {
      userId: session.user.id,
      isRecurring: true,
      recurringType: "WEEKLY",
      completed: true,
      completedAt: { lt: weekAgo }
    },
    data: { completed: false, completedAt: null }
  });

  return await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      skills: true,
      tasks: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
}

export async function addSkill(name: string, category: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  if (!name || name.trim() === "") throw new Error("Skill name is required")
  if (!category || category.trim() === "") throw new Error("Skill category is required")

  await prisma.skill.create({
    data: {
      name,
      category,
      userId: session.user.id
    }
  })
  
  revalidatePath('/dashboard/skills')
}

export async function addTask(
  title: string, 
  xpReward: number, 
  skillId?: string,
  priority: string = "MEDIUM",
  isRecurring: boolean = false,
  recurringType?: string
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  if (!title || title.trim() === "") throw new Error("Task title is required")
  if (xpReward < 10 || xpReward > 1000) throw new Error("Invalid XP reward. Must be between 10 and 1000")

  await prisma.task.create({
    data: {
      title,
      xpReward,
      skillId: skillId || null,
      userId: session.user.id,
      priority,
      isRecurring,
      recurringType: recurringType || null
    }
  })

  revalidatePath('/dashboard/tasks')
  revalidatePath('/dashboard')
}

export async function toggleTaskCompletion(taskId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const task = await prisma.task.findUnique({ where: { id: taskId, userId: session.user.id } })
  if (!task) throw new Error("Task not found")

  if (task.completed) throw new Error("Task already completed")

  const isCompleting = !task.completed
  
  // Update the task status
  await prisma.task.update({
    where: { id: taskId },
    data: { 
      completed: isCompleting,
      completedAt: isCompleting ? new Date() : null
    }
  })

  // Award XP and log activity if completing
  if (isCompleting) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return

    // 1. Update Global user XP and Level
    const newTotalXP = user.totalXP + task.xpReward;
    
    // Use the dynamic XP scale for the global character level
    const { newXp, newLevel, newXpToNext } = calculateLevelAndXP(
      user.currentLevelXp, 
      task.xpReward, 
      user.level, 
      user.xpToNextLevel
    );

    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        totalXP: newTotalXP, 
        currentLevelXp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext
      }
    });

    // 2. Update Specific Skill XP (if linked)
    if (task.skillId) {
      const skill = await prisma.skill.findUnique({ where: { id: task.skillId } })
      if (skill) {
        const { newXp, newLevel, newXpToNext } = calculateLevelAndXP(skill.xp, task.xpReward, skill.level, skill.xpToNextLevel)
        await prisma.skill.update({
          where: { id: skill.id },
          data: { xp: newXp, level: newLevel, xpToNextLevel: newXpToNext }
        })
      }
    }

    // 3. Log to Activity for Heatmap
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        actionType: "TASK_COMPLETED",
        description: `Completed quest: ${task.title}`,
        xpEarned: task.xpReward
      }
    })
  }

  revalidatePath('/dashboard/tasks')
  revalidatePath('/dashboard')
}

export async function deleteTask(taskId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.task.delete({
    where: { id: taskId, userId: session.user.id }
  })
  
  revalidatePath('/dashboard/tasks')
}

export async function getHeatmapActivity() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return []

  // Fetch past 100 days of activity
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - 100);

  const logs = await prisma.activityLog.findMany({
    where: {
      userId: session.user.id,
      date: { gte: dateLimit }
    },
    select: { date: true, xpEarned: true }
  })

  return logs
}

export async function resetAccount() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.$transaction([
    prisma.task.deleteMany({ where: { userId: session.user.id } }),
    prisma.skill.deleteMany({ where: { userId: session.user.id } }),
    prisma.activityLog.deleteMany({ where: { userId: session.user.id } }),
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalXP: 0,
        currentLevelXp: 0,
        level: 1,
        xpToNextLevel: 200
      }
    })
  ])
  
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/skills')
  revalidatePath('/dashboard/tasks')
  revalidatePath('/dashboard/settings')
}

export async function deleteAccount() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.user.delete({
    where: { id: session.user.id }
  })
}

export async function updateIntegrations(githubUsername: string, leetcodeUsername: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      githubUsername: githubUsername || null,
      leetcodeUsername: leetcodeUsername || null
    }
  })

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
}

export async function syncIntegrations() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) throw new Error("User not found");

  let xpAdded = 0;
  let syncMessages = [];

  // GH SYNC
  if (user.githubUsername) {
    const commitsToday = await fetchGitHubCommits(user.githubUsername);
    if (commitsToday > 0) {
      // Check if we already logged GH Commits today to prevent infinite XP farming
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const loggedToday = await prisma.activityLog.findFirst({
        where: {
          userId: user.id,
          actionType: "GITHUB_SYNC",
          date: { gte: today }
        }
      });

      if (!loggedToday) {
        const ghXp = commitsToday * 10; // 10 XP per commit
        xpAdded += ghXp;
        syncMessages.push(`Synced ${commitsToday} GitHub commits`);

        await prisma.activityLog.create({
          data: {
            userId: user.id,
            actionType: "GITHUB_SYNC",
            description: `GitHub Sync: ${commitsToday} commits`,
            xpEarned: ghXp
          }
        });
      } else {
        syncMessages.push(`GitHub already synced for today`);
      }
    }
  }

  // LC SYNC
  if (user.leetcodeUsername) {
    const totalSolved = await fetchLeetCodeGenerals(user.leetcodeUsername);
    
    if (totalSolved > 0) {
       // Check last recorded Leetcode total count
       const lastLog = await prisma.activityLog.findFirst({
         where: { userId: user.id, actionType: "LEETCODE_SYNC" },
         orderBy: { date: 'desc' }
       });

       // Basic logic: if total solved > previously parsed count, grant difference
       // For MVP, we'll store the total solved in the description string like a crude state: "LeetCode Sync: 15"
       let previousTotal = 0;
       if (lastLog?.description) {
         const match = lastLog.description.match(/\d+$/);
         if (match) previousTotal = parseInt(match[0], 10);
       }

       if (totalSolved > previousTotal) {
         const diff = totalSolved - previousTotal;
         const lcXp = diff * 50; // 50 XP per LC problem
         xpAdded += lcXp;
         syncMessages.push(`Synced ${diff} new LeetCode problem(s)`);

         await prisma.activityLog.create({
           data: {
             userId: user.id,
             actionType: "LEETCODE_SYNC",
             description: `LeetCode Sync: ${totalSolved}`,
             xpEarned: lcXp
           }
         });
       } else {
         syncMessages.push(`No new LeetCode problems found`);
       }
    }
  }

  // Award the XP
  if (xpAdded > 0) {
    const newTotalXP = user.totalXP + xpAdded;
    const { newXp, newLevel, newXpToNext } = calculateLevelAndXP(
      user.currentLevelXp, 
      xpAdded, 
      user.level, 
      user.xpToNextLevel
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        totalXP: newTotalXP, 
        currentLevelXp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext
      }
    });
  }

  revalidatePath('/dashboard');
  
  return {
    success: true,
    xpAdded,
    messages: syncMessages.length > 0 ? syncMessages : ["No external integrations linked."]
  };
}

export async function generateTasksFromAI(goal: string, skillId?: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const subTasks = await generateAITaskBreakdown(goal);
  
  if (!subTasks || subTasks.length === 0) {
    throw new Error("AI failed to generate tasks. Please try again or check your API key.");
  }

  // Map generated string array into Prisma Task objects
  const taskData = subTasks.map(title => ({
    title,
    userId: session.user.id,
    skillId: skillId || null,
    priority: "MEDIUM",
    xpReward: 30
  }));

  // Bulk Insert
  await prisma.task.createMany({
    data: taskData
  });

  revalidatePath('/dashboard/tasks');
  revalidatePath('/dashboard');
}

