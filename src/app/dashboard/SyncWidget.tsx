"use client";

import React, { useTransition } from "react";
import { RefreshCw, Github, CodeSquare } from "lucide-react";
import { syncIntegrations } from "@/app/actions";

interface SyncWidgetProps {
  hasGithub: boolean;
  hasLeetcode: boolean;
}

export default function SyncWidget({ hasGithub, hasLeetcode }: SyncWidgetProps) {
  const [isPending, startTransition] = useTransition();

  const handleSync = () => {
    startTransition(async () => {
      try {
        const result = await syncIntegrations();
        if (result.messages && result.messages.length > 0) {
          alert("Sync Complete:\n" + result.messages.join("\n"));
        } else {
          alert("Integration Sync complete.");
        }
      } catch (error) {
        console.error(error);
        alert("Failed to sync integrations.");
      }
    });
  };

  const hasIntegrations = hasGithub || hasLeetcode;

  return (
    <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center relative overflow-hidden">
          <RefreshCw className={`w-5 h-5 text-indigo-400 ${isPending ? 'animate-spin' : ''}`} />
        </div>
        <div>
          <h2 className="text-white font-bold mb-1">External Integrations</h2>
          <div className="flex items-center gap-3">
             {hasGithub ? (
               <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium bg-white/5 px-2 py-1 rounded-md">
                 <Github className="w-3.5 h-3.5 text-white" /> Connected
               </div>
             ) : (
               <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                 <Github className="w-3.5 h-3.5" /> Empty
               </div>
             )}
             {hasLeetcode ? (
               <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium bg-white/5 px-2 py-1 rounded-md">
                 <CodeSquare className="w-3.5 h-3.5 text-orange-400" /> Connected
               </div>
             ) : (
               <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                 <CodeSquare className="w-3.5 h-3.5" /> Empty
               </div>
             )}
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleSync}
        disabled={isPending || !hasIntegrations}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-all focus:ring-2 focus:ring-white/50 disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} /> 
        {isPending ? "Syncing..." : "Sync Activities"}
      </button>
    </div>
  );
}
