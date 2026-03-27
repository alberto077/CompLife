"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, Plus, CheckCircle, Loader2 } from "lucide-react";
import { generateTasksFromAI, addTask } from "@/app/actions";
import { useToast } from "@/components/ToastProvider";
import { Skill } from "@prisma/client";

interface GoalWizardProps {
  skills: Skill[];
  onClose: () => void;
}

export function GoalWizard({ skills, onClose }: GoalWizardProps) {
  const [step, setStep] = useState<"input" | "generating" | "results">("input");
  const [goal, setGoal] = useState("");
  const [skillId, setSkillId] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setStep("generating");
    setIsGenerating(true);

    startTransition(async () => {
      try {
        await generateTasksFromAI(goal, skillId || undefined);
        // Since generateTasksFromAI creates tasks directly, we'll show a success state
        toast("Quests generated and added!", "success");
        onClose();
      } catch (err: any) {
        toast(err.message || "Failed to generate quests", "error");
        setStep("input");
      } finally {
        setIsGenerating(false);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg"
      >
        <div className="p-1 rounded-3xl bg-gradient-to-br from-purple-500/30 via-indigo-500/20 to-pink-500/10 border border-white/5">
          <div className="p-8 bg-neutral-950/95 rounded-[22px] backdrop-blur-xl">
            <AnimatePresence mode="wait">
              {/* Input Step */}
              {step === "input" && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">AI Goal Planner</h2>
                      <p className="text-sm text-neutral-400">Describe your goal and AI will create step-by-step quests</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Your Goal</label>
                      <textarea
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder='e.g. "Build a full-stack blog with Next.js" or "Prepare for the GRE exam"'
                        rows={3}
                        className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-purple-500 transition-colors placeholder:text-neutral-600"
                      />
                    </div>

                    {skills.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Link to Skill (optional)</label>
                        <select
                          value={skillId}
                          onChange={(e) => setSkillId(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-neutral-300 focus:outline-none focus:border-purple-500"
                        >
                          <option value="">No skill linked</option>
                          {skills.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={onClose}
                      className="flex-1 px-6 py-3 rounded-2xl bg-neutral-800 text-neutral-300 font-medium hover:bg-neutral-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={!goal.trim() || isPending}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold hover:from-purple-600 hover:to-indigo-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                    >
                      <Sparkles className="w-5 h-5" />
                      Generate Quests
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Generating Step */}
              {step === "generating" && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12 space-y-6"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/20"
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">AI is planning your quests...</h3>
                    <p className="text-sm text-neutral-400">Breaking down &ldquo;{goal}&rdquo; into actionable steps</p>
                  </div>
                  <div className="flex justify-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-purple-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
