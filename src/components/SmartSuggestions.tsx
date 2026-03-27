"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, CheckSquare, Link2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SmartSuggestionsProps {
  hasSkills: boolean;
  hasActiveTasks: boolean;
  hasIntegrations: boolean;
  highestPriorityTask?: { title: string; xpReward: number } | null;
}

const suggestions = {
  noSkills: {
    icon: Target,
    title: "Create your first skill",
    description: "Skills are categories you want to level up. Start with one like \"Coding\" or \"Fitness\".",
    action: "/dashboard/skills",
    actionLabel: "Add Skill",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  noTasks: {
    icon: CheckSquare,
    title: "Add your first quest",
    description: "Quests earn you XP when completed. Try one like \"Read 1 chapter\" or use AI to auto-generate!",
    action: "/dashboard/tasks",
    actionLabel: "Create Quest",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  noIntegrations: {
    icon: Link2,
    title: "Connect your accounts",
    description: "Link GitHub or LeetCode to auto-sync your activity and earn XP passively.",
    action: "/dashboard/settings",
    actionLabel: "Connect",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
};

export function SmartSuggestions({ hasSkills, hasActiveTasks, hasIntegrations, highestPriorityTask }: SmartSuggestionsProps) {
  const activeSuggestions: Array<typeof suggestions[keyof typeof suggestions]> = [];

  if (!hasSkills) activeSuggestions.push(suggestions.noSkills);
  if (!hasIntegrations) activeSuggestions.push(suggestions.noIntegrations);
  if (!hasActiveTasks && hasSkills) activeSuggestions.push(suggestions.noTasks);

  // If everything is set up and there's a high-priority task, show it
  if (activeSuggestions.length === 0 && highestPriorityTask) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-300">Suggested next quest:</p>
          <p className="text-white font-semibold truncate">{highestPriorityTask.title}</p>
        </div>
        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg whitespace-nowrap">
          +{highestPriorityTask.xpReward} XP
        </span>
      </motion.div>
    );
  }

  if (activeSuggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-3"
    >
      <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        What to do next
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeSuggestions.slice(0, 2).map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <Link
                href={s.action}
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${s.bg}`}
              >
                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{s.title}</p>
                  <p className="text-neutral-400 text-xs mt-0.5 line-clamp-1">{s.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors flex-shrink-0" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
