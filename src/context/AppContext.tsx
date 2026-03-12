"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SkillCategory = "Coding" | "School" | "Health" | "Other";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface Task {
  id: string;
  title: string;
  skillId?: string; // Optional: Link to a skill
  xpReward: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

interface AppState {
  skills: Skill[];
  tasks: Task[];
  totalXP: number;
  userLevel: number;
}

interface AppContextType extends AppState {
  addSkill: (name: string, category: SkillCategory) => void;
  addTask: (title: string, xpReward: number, skillId?: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}

const initialState: AppState = {
  skills: [
    { id: "1", name: "React", category: "Coding", level: 3, xp: 450, xpToNextLevel: 500 },
    { id: "2", name: "Data Structures", category: "School", level: 2, xp: 120, xpToNextLevel: 300 },
  ],
  tasks: [
    { id: "101", title: "Complete LeetCode Daily", skillId: "2", xpReward: 50, completed: false, createdAt: new Date() },
    { id: "102", title: "Read Next.js Docs", skillId: "1", xpReward: 30, completed: false, createdAt: new Date() },
  ],
  totalXP: 570,
  userLevel: 4,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const XP_BASE = 100;
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("aura_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Correct dates
        parsed.tasks = parsed.tasks.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
        }));
        setState(parsed);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("aura_state", JSON.stringify(state));
  }, [state]);

  const addSkill = (name: string, category: SkillCategory) => {
    const newSkill: Skill = {
      id: Math.random().toString(36).substring(7),
      name,
      category,
      level: 1,
      xp: 0,
      xpToNextLevel: XP_BASE,
    };
    setState((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
  };

  const addTask = (title: string, xpReward: number, skillId?: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title,
      xpReward,
      skillId,
      completed: false,
      createdAt: new Date(),
    };
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setState((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const task = prev.tasks[taskIndex];
      const isCompleting = !task.completed;
      
      const newTasks = [...prev.tasks];
      newTasks[taskIndex] = {
        ...task,
        completed: isCompleting,
        completedAt: isCompleting ? new Date() : undefined,
      };

      let newTotalXP = prev.totalXP;
      let newUserLevel = prev.userLevel;
      let newSkills = [...prev.skills];

      // If completing, add XP. If un-completing, subtract XP (simplified here, in game you might not subtract logic, but we will for todo lists)
      const xpDelta = isCompleting ? task.xpReward : -task.xpReward;

      // Update Global User XP (Simplified level logic for global)
      newTotalXP = Math.max(0, newTotalXP + xpDelta);
      newUserLevel = Math.floor(newTotalXP / 200) + 1;

      // Update Specific Skill XP
      if (task.skillId) {
        const skillIndex = newSkills.findIndex(s => s.id === task.skillId);
        if (skillIndex !== -1) {
          const skill = newSkills[skillIndex];
          if (isCompleting) {
            const { newXp, newLevel, newXpToNext } = calculateLevelAndXP(skill.xp, task.xpReward, skill.level, skill.xpToNextLevel);
            newSkills[skillIndex] = { ...skill, xp: newXp, level: newLevel, xpToNextLevel: newXpToNext };
          } else {
            // Simplified un-complete logic
            let revertedXp = skill.xp - task.xpReward;
            newSkills[skillIndex] = { ...skill, xp: Math.max(0, revertedXp) };
          }
        }
      }

      return {
        ...prev,
        tasks: newTasks,
        totalXP: newTotalXP,
        userLevel: newUserLevel,
        skills: newSkills
      };
    });
  };

  const deleteTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  return (
    <AppContext.Provider value={{ ...state, addSkill, addTask, toggleTaskCompletion, deleteTask }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
