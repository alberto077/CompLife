"use client";

import React, { useState, useTransition } from "react";
import { Plus, Target, Code, Heart, BookOpen, Hash } from "lucide-react";
import { addSkill } from "@/app/actions";
import { Skill } from "@prisma/client";
import { useToast } from "@/components/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Coding": return <Code className="w-5 h-5 text-indigo-400" />;
    case "Health": return <Heart className="w-5 h-5 text-red-400" />;
    case "School": return <BookOpen className="w-5 h-5 text-amber-400" />;
    default: return <Hash className="w-5 h-5 text-neutral-400" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Coding": return "bg-indigo-500/10 border-indigo-500/20";
    case "Health": return "bg-red-500/10 border-red-500/20";
    case "School": return "bg-amber-500/10 border-amber-500/20";
    default: return "bg-neutral-500/10 border-neutral-500/20";
  }
};

export default function SkillsClient({ initialSkills }: { initialSkills: Skill[] }) {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Other");
  const [activeTab, setActiveTab] = useState("All");
  const { toast } = useToast();

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    
    startTransition(async () => {
      await addSkill(newSkillName, newSkillCategory);
      toast(`Skill "${newSkillName}" created!`, "success");
      setNewSkillName("");
      setIsAdding(false);
    });
  };

  const filteredSkills = initialSkills.filter(s => activeTab === "All" || s.category === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-8 pb-12"
    >
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Skills Tracker</h1>
          <p className="text-neutral-400">Manage your skills and level up your attributes.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add Skill
        </button>
      </motion.header>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar"
      >
        {["All", "Coding", "School", "Health", "Other"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? "bg-white text-black" 
                : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Add Skill Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            onSubmit={handleAddSkill}
            className="p-6 rounded-3xl bg-neutral-900 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 space-y-4 overflow-hidden"
          >
            <h3 className="text-xl font-bold text-white mb-4">Create New Skill</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Skill Name</label>
                <input 
                  type="text" 
                  autoFocus
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  placeholder="e.g. Data Structures, Cardio, App Dev..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Category</label>
                <select 
                  value={newSkillCategory}
                  onChange={e => setNewSkillCategory(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                >
                  <option value="Coding">💻 Coding & Tech</option>
                  <option value="School">📚 School & Academics</option>
                  <option value="Health">💪 Health & Fitness</option>
                  <option value="Other">🗂️ Other</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-white/5">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all active:scale-95 text-sm disabled:opacity-50"
              >
                {isPending ? "Creating..." : "Create Skill"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full py-12 text-center text-neutral-500">
             <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
             No skills found in this category. Start tracking to level up!
          </div>
        ) : (
          filteredSkills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 hover:bg-neutral-900/80 hover:border-indigo-500/20 transition-all group flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${getCategoryColor(skill.category)} group-hover:scale-110 transition-transform`}>
                    {getCategoryIcon(skill.category)}
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-xs font-bold text-neutral-300">
                    LVL {skill.level}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{skill.name}</h3>
                <p className="text-sm text-neutral-500">{skill.category}</p>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between text-xs font-medium text-neutral-400 mb-2">
                  <span>{skill.xp} XP</span>
                  <span>{skill.xpToNextLevel} XP</span>
                </div>
                <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    className="bg-indigo-500 h-full rounded-full relative shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(skill.xp / skill.xpToNextLevel) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 + i * 0.05 }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-lg shadow-indigo-500/50" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
