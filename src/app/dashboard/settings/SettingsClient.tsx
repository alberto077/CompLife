"use client";

import React, { useState, useTransition } from "react";
import { AlertTriangle, RefreshCw, Trash2, Github, CodeSquare, Save, ShieldAlert } from "lucide-react";
import { resetAccount, deleteAccount, updateIntegrations } from "@/app/actions";
import { signOut } from "next-auth/react";
import { useToast } from "@/components/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsClient({ 
  user, 
  initialGithub, 
  initialLeetcode 
}: { 
  user: { email: string },
  initialGithub: string | null,
  initialLeetcode: string | null
}) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const [github, setGithub] = useState(initialGithub || "");
  const [leetcode, setLeetcode] = useState(initialLeetcode || "");
  
  const { toast } = useToast();

  const handleSaveIntegrations = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateIntegrations(github, leetcode);
      toast("Integrations saved successfully!", "success");
    });
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    startTransition(async () => {
      await resetAccount();
      toast("Progress reset to Level 1", "info");
      setConfirmReset(false);
    });
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccount();
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error("Failed to delete account:", error);
      setIsDeleting(false);
      toast("Account deletion failed. Please try again.", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-neutral-400">Manage your account preferences and data.</p>
        </div>
      </header>

      {/* Integrations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-1 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-neutral-900/50 to-neutral-900/50 border border-white/5"
      >
        <form onSubmit={handleSaveIntegrations} className="p-6 bg-neutral-950/80 rounded-[22px] backdrop-blur-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">External Integrations</h2>
            <p className="text-sm text-neutral-400">Link your public profiles to sync your activity to CompLife.</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <Github className="w-4 h-4 text-white" /> GitHub Username
              </label>
              <input 
                type="text" 
                value={github}
                onChange={e => setGithub(e.target.value)}
                disabled={isPending}
                placeholder="e.g. torvalds"
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <CodeSquare className="w-4 h-4 text-orange-400" /> LeetCode Username
              </label>
              <input 
                type="text" 
                value={leetcode}
                onChange={e => setLeetcode(e.target.value)}
                disabled={isPending}
                placeholder="e.g. neetcode"
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
          
          <button 
             type="submit"
             disabled={isPending}
             className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
           >
             <Save className="w-4 h-4" /> {isPending ? "Saving..." : "Save Integrations"}
           </button>
        </form>
      </motion.div>

        {/* Account Actions */}
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.15 }}
         className="p-1 rounded-3xl bg-gradient-to-br from-neutral-800/50 via-neutral-900/50 to-neutral-900/50 border border-white/5"
       >
         <div className="p-6 bg-neutral-950/80 rounded-[22px] backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <h2 className="text-xl font-bold text-white mb-1">Account Actions</h2>
             <p className="text-sm text-neutral-400">Sign out of your current session.</p>
           </div>
           
           <button 
             onClick={() => signOut({ callbackUrl: "/" })}
             disabled={isPending}
             className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all active:scale-95 border border-white/10 disabled:opacity-50"
           >
             Sign Out
           </button>
         </div>
       </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-1 rounded-3xl bg-gradient-to-br from-red-500/20 via-neutral-900/50 to-neutral-900/50 border border-white/5"
      >
        <div className="p-6 bg-neutral-950/80 rounded-[22px] backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
               <AlertTriangle className="w-5 h-5 text-red-400" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-white">Danger Zone</h2>
               <p className="text-sm text-neutral-400">Irreversible, destructive account actions for {user.email}.</p>
             </div>
          </div>

          <div className="space-y-4">
            {/* Reset Progress */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
              <div className="mb-4 md:mb-0">
                <h3 className="text-white font-medium mb-1">Reset Progress</h3>
                <p className="text-sm text-neutral-400">Wipe all tasks, skills, and set XP back to 0. You will remain logged in.</p>
              </div>
              <AnimatePresence mode="wait">
                {confirmReset ? (
                  <motion.div
                    key="confirm-reset"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2"
                  >
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleReset}
                      disabled={isPending}
                      className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <ShieldAlert className="w-4 h-4" /> {isPending ? "Resetting..." : "Confirm Reset"}
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="reset-btn"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={handleReset}
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-neutral-800 text-white font-semibold hover:bg-neutral-700 transition-all active:scale-95 focus:ring-2 focus:ring-red-500/50 disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" /> Reset Data
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Delete Account */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
              <div className="mb-4 md:mb-0">
                <h3 className="text-red-400 font-medium mb-1">Delete Account</h3>
                <p className="text-sm text-red-400/70">Permanently destroy your account and all data. You will be logged out.</p>
              </div>
              <AnimatePresence mode="wait">
                {confirmDelete ? (
                  <motion.div
                    key="confirm-delete"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2"
                  >
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDelete}
                      disabled={isPending || isDeleting}
                      className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" /> {isDeleting ? "Deleting..." : "Yes, Delete Everything"}
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="delete-btn"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={handleDelete}
                    disabled={isPending || isDeleting}
                    className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-red-500/10 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition-all active:scale-95 focus:ring-2 focus:ring-red-500/50 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
