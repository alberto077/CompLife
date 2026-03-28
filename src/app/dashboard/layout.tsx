import Link from "next/link";
import { LayoutDashboard, Target, CheckSquare, Settings, Flame, Trophy, Award } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserData } from "@/app/actions";
import { redirect } from "next/navigation";
import { MobileNav } from "@/components/MobileNav";
import { LogoutButton } from "@/components/LogoutButton";

async function Sidebar() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await getUserData();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Skills Tracker", href: "/dashboard/skills", icon: Target },
    { name: "Daily Quests", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
    { name: "Badges", href: "/dashboard/badges", icon: Award },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const userLevel = user?.level || 1;
  const currentXp = user?.currentLevelXp || 0;
  const xpToNext = user?.xpToNextLevel || 200;
  const xpPercent = Math.min((currentXp / xpToNext) * 100, 100);

  return (
    <div className="w-64 h-full border-r border-white/5 bg-neutral-950 flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-white text-lg">A</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Aura</span>
        </Link>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          {/* Animated progress ring around avatar */}
          <div className="relative">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <circle
                cx="28" cy="28" r="24" fill="none"
                stroke="url(#xp-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - xpPercent / 100)}`}
                style={{ transition: "stroke-dashoffset 1s ease-out" }}
              />
              <defs>
                <linearGradient id="xp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden">
                <span className="text-lg">👾</span>
              </div>
            </div>
          </div>
          <div>
            <div className="font-bold text-white">{user?.name || "Player 1"}</div>
            <div className="text-xs text-indigo-400 font-medium flex items-center gap-1">
               <Flame className="w-3 h-3"/> Level {userLevel}
            </div>
          </div>
        </div>
        
        <div className="w-full bg-white/5 rounded-full h-1.5 mb-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full relative"
              style={{ width: `${xpPercent}%`, transition: "width 1s ease-out" }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
        </div>
        <div className="text-xs text-neutral-500 text-right mb-8">{currentXp} / {xpToNext} XP to next level</div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-medium text-neutral-400 hover:bg-white/5 hover:text-white group"
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-8 border-t border-white/5 pt-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-neutral-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Decorative background elements scoped to dashboard content */}
          <div className="fixed top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
          <div className="fixed bottom-[-10%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-900/5 blur-[100px] pointer-events-none" />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 pb-24 md:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
