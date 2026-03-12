"use client";

import React, { useTransition } from "react";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";
import { resetAccount, deleteAccount } from "@/app/actions";
import { signOut } from "next-auth/react";

export default function SettingsClient({ user }: { user: { email: string } }) {
  const [isPending, startTransition] = useTransition();

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all your progress? This will delete all your tasks, skills, and XP. This action cannot be undone.")) {
      startTransition(async () => {
        await resetAccount();
        alert("Progress safely reset to level 1.");
      });
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to permanently delete your account and all associated data? This cannot be undone.")) {
      startTransition(async () => {
        await deleteAccount();
        await signOut({ callbackUrl: '/' });
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-neutral-400">Manage your account preferences and data.</p>
        </div>
      </header>

      <div className="p-1 rounded-3xl bg-gradient-to-br from-red-500/20 via-neutral-900/50 to-neutral-900/50 border border-white/5">
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
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
              <div className="mb-4 md:mb-0">
                <h3 className="text-white font-medium mb-1">Reset Progress</h3>
                <p className="text-sm text-neutral-400">Wipe all tasks, skills, and set XP back to 0. You will remain logged in.</p>
              </div>
              <button 
                onClick={handleReset}
                disabled={isPending}
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-neutral-800 text-white font-semibold hover:bg-neutral-700 transition-all focus:ring-2 focus:ring-red-500/50 disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" /> {isPending ? "Processing..." : "Reset Data"}
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
              <div className="mb-4 md:mb-0">
                <h3 className="text-red-400 font-medium mb-1">Delete Account</h3>
                <p className="text-sm text-red-400/70">Permanently destroy your account and all data. You will be logged out.</p>
              </div>
              <button 
                onClick={handleDelete}
                disabled={isPending}
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-red-500/10 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition-all focus:ring-2 focus:ring-red-500/50 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> {isPending ? "Processing..." : "Delete Account"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
