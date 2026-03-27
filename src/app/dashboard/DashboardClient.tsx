"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckSquare, Flame, TrendingUp, Trophy, AlertCircle, RotateCw } from "lucide-react";
import { Heatmap } from "@/components/Heatmap";
import SyncWidget from "./SyncWidget";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { StreakCounter } from "@/components/StreakCounter";
import { SmartSuggestions } from "@/components/SmartSuggestions";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import Link from "next/link";

interface DashboardClientProps {
  user: {
    name: string | null;
    level: number;
    totalXP: number;
    currentLevelXp: number;
    xpToNextLevel: number;
    githubUsername: string | null;
    leetcodeUsername: string | null;
  };
  skills: any[];
  tasks: any[];
  completedTasksCount: number;
  streakDays: number;
  isNewUser: boolean;
  hasIntegrations: boolean;
  highPriorityTask: { title: string; xpReward: number } | null;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function DashboardClient({
  user,
  skills,
  tasks,
  completedTasksCount,
  streakDays,
  isNewUser,
  hasIntegrations,
  highPriorityTask,
}: DashboardClientProps) {
  // Show onboarding for new users
  if (isNewUser) {
    return (
      <div className="max-w-5xl mx-auto py-12">
        <OnboardingWizard />
      </div>
    );
  }

  const xpPercent = Math.min((user.currentLevelXp / user.xpToNextLevel) * 100, 100);

  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-8 pb-12"
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      {/* Header */}
      <motion.header variants={fadeInUp}>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}.</h1>
        <p className="text-neutral-400">Here is your progress overview for today.</p>
      </motion.header>

      {/* Smart Suggestions */}
      <SmartSuggestions
        hasSkills={skills.length > 0}
        hasActiveTasks={tasks.length > 0}
        hasIntegrations={hasIntegrations}
        highestPriorityTask={highPriorityTask}
      />

      {/* Top Stats */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger}>
        {/* Total XP */}
        <motion.div
          variants={fadeInUp}
          className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 flex items-center gap-4 hover:border-indigo-500/20 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-neutral-400">Total XP</div>
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={user.totalXP} />
            </div>
          </div>
        </motion.div>

        {/* Quests Completed */}
        <motion.div
          variants={fadeInUp}
          className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 flex items-center gap-4 hover:border-emerald-500/20 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-neutral-400">Quests Completed</div>
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={completedTasksCount} />
            </div>
          </div>
        </motion.div>

        {/* Current Level */}
        <motion.div
          variants={fadeInUp}
          className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 flex flex-col gap-4 hover:border-amber-500/20 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-400">Current Level</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter value={user.level} />
                </div>
                <div className="text-xs text-amber-400 font-bold">
                  {user.currentLevelXp} / {user.xpToNextLevel} XP
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full relative"
              initial={{ width: "0%" }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </motion.div>
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div variants={fadeInUp}>
          <StreakCounter streakDays={streakDays} />
        </motion.div>
      </motion.div>

      {/* Sync Widget */}
      <motion.div variants={fadeInUp}>
        <SyncWidget
          hasGithub={!!user.githubUsername}
          hasLeetcode={!!user.leetcodeUsername}
        />
      </motion.div>

      {/* Heatmap Section */}
      <motion.div variants={fadeInUp}>
        <Heatmap />
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={stagger}>
        {/* Active Quests */}
        <motion.div variants={fadeInUp} className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-indigo-500/10 transition-colors">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold flex items-center gap-2">
               <CheckSquare className="w-5 h-5 text-indigo-400" /> Active Quests
             </h2>
             <Link href="/dashboard/tasks" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
               View All →
             </Link>
          </div>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm mb-3">No active quests</p>
                <Link
                  href="/dashboard/tasks"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-colors"
                >
                  Create Quest →
                </Link>
              </div>
            ) : (
              tasks.map((task: any, i: number) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group hover:border-indigo-500/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md border border-white/20 group-hover:border-indigo-400 transition-colors" />
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
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Skills */}
        <motion.div variants={fadeInUp} className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-emerald-500/10 transition-colors">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-emerald-400" /> Top Skills
             </h2>
             <Link href="/dashboard/skills" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
               View All →
             </Link>
          </div>

          <div className="space-y-4">
            {skills.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm mb-3">No skills tracked yet</p>
                <Link
                  href="/dashboard/skills"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
                >
                  Add Skill →
                </Link>
              </div>
            ) : skills.map((skill: any, i: number) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                   <span className="font-semibold text-white">{skill.name}</span>
                   <span className="text-xs font-bold text-emerald-400">LVL {skill.level}</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full relative"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(skill.xp / skill.xpToNextLevel) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.8 + i * 0.1 }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-lg shadow-emerald-500/50" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

    </motion.div>
  );
}
