"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import { CheckSquare, Flame, TrendingUp, Trophy } from "lucide-react";

export default function DashboardOverview() {
  const { skills, tasks, totalXP, userLevel } = useAppContext();

  const completedTasks = tasks.filter(t => t.completed).length;
  const recentTasks = tasks.filter(t => !t.completed).slice(0, 3);
  const topSkills = [...skills].sort((a,b) => b.level - a.level).slice(0, 3);

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
            <div className="text-2xl font-bold text-white">{totalXP}</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-neutral-400">Quests Completed</div>
            <div className="text-2xl font-bold text-white">{completedTasks}</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-neutral-400">Current Level</div>
            <div className="text-2xl font-bold text-white">{userLevel}</div>
          </div>
        </div>
      </div>

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
            {recentTasks.length === 0 ? (
              <div className="text-neutral-500 text-sm py-4">No active quests. Time to rest block.</div>
            ) : (
              recentTasks.map(task => (
                <div key={task.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md border border-white/20" />
                    <span className="text-sm text-neutral-200">{task.title}</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">
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
            {topSkills.map(skill => (
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
