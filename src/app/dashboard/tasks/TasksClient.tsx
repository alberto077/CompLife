"use client";

import React, { useState, useTransition } from "react";
import { Plus, Check, Trash2, Zap } from "lucide-react";
import { addTask, toggleTaskCompletion, deleteTask } from "@/app/actions";
import { Task, Skill } from "@prisma/client";

export default function TasksClient({ initialSkills, initialTasks }: { initialSkills: Skill[], initialTasks: Task[] }) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [xpReward, setXpReward] = useState<number>(50);
  const [skillId, setSkillId] = useState<string>("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isPending) return;
    
    startTransition(async () => {
      await addTask(title, xpReward, skillId || undefined);
      setTitle("");
      setXpReward(50);
      setSkillId("");
    });
  };

  const handleToggle = (taskId: string) => {
    startTransition(async () => {
      await toggleTaskCompletion(taskId);
    });
  };

  const handleDelete = (taskId: string) => {
    startTransition(async () => {
      await deleteTask(taskId);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Daily Quests</h1>
          <p className="text-neutral-400">Complete quests to earn XP and level up your skills.</p>
        </div>
      </header>

      {/* Quest Creator */}
      <div className="p-1 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-neutral-900/50 to-neutral-900/50 border border-white/5">
        <div className="p-6 bg-neutral-950/80 rounded-[22px] backdrop-blur-xl">
           <form onSubmit={handleAddTask} className="flex flex-col gap-4">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                 <Zap className="w-5 h-5 text-indigo-400" />
               </div>
               <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  disabled={isPending}
                  placeholder="What's your next quest? e.g. 'Solve 3 Leetcode questions'"
                  className="flex-1 bg-transparent border-none text-white text-lg placeholder:text-neutral-600 focus:outline-none focus:ring-0 disabled:opacity-50"
               />
             </div>
             
             <div className="ml-14 flex flex-wrap items-center gap-3">
               <select 
                  value={skillId}
                  onChange={e => setSkillId(e.target.value)}
                  disabled={isPending}
                  className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">Link to specific Skill... (Optional)</option>
                  {initialSkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
               </select>

               <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2">
                 <span className="text-sm text-neutral-500">Reward:</span>
                 <input 
                    type="number" 
                    min={10} max={1000} step={10}
                    value={xpReward}
                    disabled={isPending}
                    onChange={e => setXpReward(Number(e.target.value))}
                    className="w-16 bg-transparent border-none text-sm text-indigo-400 font-bold focus:outline-none text-right"
                 />
                 <span className="text-sm font-bold text-indigo-400">XP</span>
               </div>

               <button 
                  type="submit"
                  disabled={!title.trim() || isPending}
                  className="ml-auto flex items-center gap-2 px-6 py-2 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                 <Plus className="w-4 h-4" /> {isPending ? "Adding..." : "Add Quest"}
               </button>
             </div>
           </form>
        </div>
      </div>

      {/* Quest List */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-white mb-6">Active Quests Log</h2>
        
        {initialTasks.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 border border-dashed border-white/10 rounded-3xl">
            You have no active quests! Add one above to start earning XP.
          </div>
        ) : (
          initialTasks.map(task => {
            const linkedSkill = initialSkills.find(s => s.id === task.skillId);
            
            return (
              <div 
                key={task.id} 
                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  task.completed 
                    ? "bg-neutral-900/40 border-white/5 opacity-60" 
                    : "bg-neutral-900 border-white/10 hover:border-indigo-500/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleToggle(task.id)}
                    disabled={isPending || task.completed}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors disabled:opacity-50 ${
                      task.completed 
                        ? "bg-emerald-500 border-emerald-500 text-white cursor-not-allowed" 
                        : "border-neutral-500 text-transparent hover:border-emerald-500 group-hover:border-indigo-400"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <div>
                    <span className={`text-base font-medium transition-all ${task.completed ? "text-neutral-500 line-through" : "text-white"}`}>
                      {task.title}
                    </span>
                    {linkedSkill && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-neutral-500">Links to:</span>
                        <span className="text-xs font-semibold text-indigo-400 px-2 py-0.5 rounded-md bg-indigo-500/10">
                          {linkedSkill.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-sm font-bold ${task.completed ? "text-neutral-500" : "text-emerald-400"}`}>
                    +{task.xpReward} XP
                  </span>
                  
                  <button 
                    onClick={() => handleDelete(task.id)}
                    disabled={isPending}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
