"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, CheckSquare, Settings, LogOut, Flame } from "lucide-react";
import { AppProvider, useAppContext } from "@/context/AppContext";

function Sidebar() {
  const pathname = usePathname();
  const { userLevel, totalXP } = useAppContext();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Skills Tracker", href: "/dashboard/skills", icon: Target },
    { name: "Daily Quests", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-64 h-full border-r border-white/5 bg-neutral-950 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="font-bold text-white text-lg">A</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Aura</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-neutral-800 border-2 border-indigo-500 flex items-center justify-center overflow-hidden">
             <span className="text-xl">👾</span>
          </div>
          <div>
            <div className="font-bold text-white">Player One</div>
            <div className="text-xs text-indigo-400 font-medium flex items-center gap-1">
               <Flame className="w-3 h-3"/> Level {userLevel}
            </div>
          </div>
        </div>
        
        <div className="w-full bg-white/5 rounded-full h-1.5 mb-2">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(totalXP % 200) / 200 * 100}%` }}></div>
        </div>
        <div className="text-xs text-neutral-500 text-right mb-8">{totalXP % 200} / 200 XP to next level</div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors text-sm font-medium ${
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400" 
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
          <LogOut className="w-5 h-5" />
          Disconnect
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="flex h-screen bg-neutral-950 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
           {/* Decorative background elements scoped to dashboard content */}
           <div className="fixed top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
          <main className="flex-1 overflow-y-auto p-8 z-10">
            {children}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
