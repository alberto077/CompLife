"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Target, CheckSquare, ChevronRight, Rocket, Code, Heart, BookOpen, Hash } from "lucide-react";
import { addSkill, addTask } from "@/app/actions";
import { useToast } from "@/components/ToastProvider";

const STEPS = [
  { title: "Welcome to Aura", subtitle: "Let's build your adventure in 3 steps" },
  { title: "Create Your First Skill", subtitle: "Skills are categories you want to improve" },
  { title: "Add Your First Quest", subtitle: "Quests are tasks that earn you XP" },
];

const SKILL_PRESETS = [
  { name: "Web Development", category: "Coding", icon: Code, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { name: "Data Structures", category: "Coding", icon: Code, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { name: "Fitness", category: "Health", icon: Heart, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  { name: "Study Habits", category: "School", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
];

const QUEST_PRESETS = [
  "Complete 1 coding tutorial",
  "Read for 30 minutes",
  "Exercise for 20 minutes",
  "Solve 2 practice problems",
];

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customSkillName, setCustomSkillName] = useState("");
  const [customCategory, setCustomCategory] = useState("Other");
  const [questTitle, setQuestTitle] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const { toast } = useToast();

  if (dismissed) return null;

  const handleCreateSkill = () => {
    const name = selectedPreset !== null ? SKILL_PRESETS[selectedPreset].name : customSkillName;
    const category = selectedPreset !== null ? SKILL_PRESETS[selectedPreset].category : customCategory;
    
    if (!name.trim()) {
      toast("Please select a preset or enter a skill name", "error");
      return;
    }

    startTransition(async () => {
      await addSkill(name, category);
      toast(`Skill "${name}" created!`, "success");
      setStep(2);
    });
  };

  const handleCreateQuest = () => {
    if (!questTitle.trim()) {
      toast("Please enter a quest title", "error");
      return;
    }

    startTransition(async () => {
      await addTask(questTitle, 50);
      toast("First quest created! Complete it to earn XP!", "xp", 50);
      setDismissed(true);
    });
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="p-1 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/10 border border-white/5">
        <div className="p-8 bg-neutral-950/90 rounded-[22px] backdrop-blur-xl">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-neutral-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: i <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={1}>
            {/* Step 0: Welcome */}
            {step === 0 && (
              <motion.div
                key="step-0"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, damping: 15 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/20"
                >
                  <Rocket className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-3">{STEPS[0].title}</h2>
                  <p className="text-neutral-400 max-w-md mx-auto">
                    Aura turns your goals into an RPG adventure. Track skills, complete quests, and level up — all while building real habits.
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-black font-bold hover:bg-neutral-200 transition-all active:scale-95"
                >
                  Let&apos;s Go <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Step 1: Create Skill */}
            {step === 1 && (
              <motion.div
                key="step-1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{STEPS[1].title}</h2>
                    <p className="text-sm text-neutral-400">{STEPS[1].subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {SKILL_PRESETS.map((preset, i) => {
                    const Icon = preset.icon;
                    return (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => { setSelectedPreset(i); setCustomSkillName(""); }}
                        className={`p-4 rounded-2xl border text-left transition-all active:scale-95 ${
                          selectedPreset === i
                            ? "bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/20"
                            : `${preset.bg} hover:border-white/20`
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${preset.color} mb-2`} />
                        <p className="text-white font-semibold text-sm">{preset.name}</p>
                        <p className="text-neutral-500 text-xs">{preset.category}</p>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="relative">
                  <div className="absolute inset-x-0 top-0 flex items-center justify-center -mt-3">
                    <span className="px-3 bg-neutral-950 text-xs text-neutral-500 font-medium">or create custom</span>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <input
                      type="text"
                      value={customSkillName}
                      onChange={(e) => { setCustomSkillName(e.target.value); setSelectedPreset(null); }}
                      placeholder="Custom skill name..."
                      className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-3 text-sm text-neutral-300 focus:outline-none"
                    >
                      <option value="Coding">💻 Coding</option>
                      <option value="School">📚 School</option>
                      <option value="Health">💪 Health</option>
                      <option value="Other">🗂️ Other</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleCreateSkill}
                  disabled={isPending || (!customSkillName.trim() && selectedPreset === null)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-bold hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Creating..." : "Create Skill"} <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Create Quest */}
            {step === 2 && (
              <motion.div
                key="step-2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{STEPS[2].title}</h2>
                    <p className="text-sm text-neutral-400">{STEPS[2].subtitle}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {QUEST_PRESETS.map((preset, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setQuestTitle(preset)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                        questTitle === preset
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          : "bg-neutral-800 text-neutral-300 border border-white/5 hover:border-white/20"
                      }`}
                    >
                      {preset}
                    </motion.button>
                  ))}
                </div>

                <input
                  type="text"
                  value={questTitle}
                  onChange={(e) => setQuestTitle(e.target.value)}
                  placeholder="Or type your own quest..."
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setDismissed(true)}
                    className="flex-1 px-6 py-3 rounded-2xl bg-neutral-800 text-neutral-300 font-medium hover:bg-neutral-700 transition-all"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={handleCreateQuest}
                    disabled={isPending || !questTitle.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-bold hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-5 h-5" />
                    {isPending ? "Creating..." : "Start Adventure!"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
