import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CheckSquare, Flame, TrendingUp, Trophy, AlertCircle, RotateCw } from "lucide-react";
import { Heatmap } from "@/components/Heatmap";
import { Task, Skill } from "@prisma/client";

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

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back.</h1>
        <p className="text-neutral-400">Here is your progress overview for today.</p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-neutral-400">Total XP</div>
            <div className="text-2xl font-bold text-white">{user.totalXP}</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-neutral-400">Quests Completed</div>
            <div className="text-2xl font-bold text-white">{completedTasksCount}</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-400">Current Level</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-white">{user.level}</div>
                <div className="text-xs text-amber-400 font-bold">{user.currentLevelXp} / {user.xpToNextLevel} XP</div>
              </div>
            </div>
          </div>
          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(user.currentLevelXp / user.xpToNextLevel) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <Heatmap />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Quests */}
        <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold flex items-center gap-2">
               <CheckSquare className="w-5 h-5 text-indigo-400" /> Active Quests
             </h2>
             <span className="text-sm text-neutral-500">View All</span>
          </div>

          <div className="space-y-3">
            {user.tasks.length === 0 ? (
              <div className="text-neutral-500 text-sm py-4">No active quests. Time to rest block.</div>
            ) : (
              user.tasks.map((task: Task) => (
                <div key={task.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md border border-white/20" />
                    <div className="flex flex-col">
                      <span className="text-sm text-neutral-200 flex items-center gap-1.5">
                        {task.title}
                        {!task.completed && task.priority === "HIGH" && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                        {!task.completed && task.priority === "LOW" && <AlertCircle className="w-3.5 h-3.5 text-blue-400" />}
                        {task.isRecurring && (
                          <span className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-400/10 px-1 py-0.5 rounded-sm">
                            <RotateCw className="w-2.5 h-2.5" /> {task.recurringType}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md whitespace-nowrap">
                    +{task.xpReward} XP
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Skills */}
        <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-emerald-400" /> Top Skills
             </h2>
          </div>

          <div className="space-y-4">
            {user.skills.length === 0 ? (
               <div className="text-neutral-500 text-sm py-4">Start tracking skills to see them here!</div>
            ) : user.skills.map((skill: Skill) => (
              <div key={skill.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                   <span className="font-semibold text-white">{skill.name}</span>
                   <span className="text-xs font-bold text-emerald-400">LVL {skill.level}</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(skill.xp / skill.xpToNextLevel) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
