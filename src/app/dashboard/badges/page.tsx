import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BADGES_CATALOG } from "@/lib/badges";
import { Award, Shield, Medal, Star, Target, Github, Zap, CodeSquare, Flame, CheckCircle, Lock } from "lucide-react";
import { redirect } from "next/navigation";

// A helper to map string names back to Lucide components
const IconMap: Record<string, any> = {
  Award, Target, Github, Zap, CodeSquare, Flame, Shield, Medal, Star
};

export default async function BadgesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { badges: true } as any
  });

  if (!user) return redirect("/login");

  const earnedBadgeNames = new Set(user.badges.map((b: any) => b.name));

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <header className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
          <Award className="w-7 h-7 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Badges & Achievements</h1>
          <p className="text-neutral-400">Unlock unique badges by completing milestones.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BADGES_CATALOG.map(badge => {
          const isUnlocked = earnedBadgeNames.has(badge.name);
          const IconComponent = IconMap[badge.icon] || Star;

          return (
            <div 
              key={badge.name} 
              className={`relative overflow-hidden p-6 rounded-[22px] border transition-all ${
                isUnlocked 
                  ? "bg-neutral-900/80 border-indigo-500/30 hover:border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.05)]" 
                  : "bg-neutral-950/50 border-white/5 opacity-70 grayscale hover:grayscale-0"
              }`}
            >
              {isUnlocked && (
                <div className="absolute top-0 right-0 p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
              )}
              
              {!isUnlocked && (
                <div className="absolute top-0 right-0 p-4">
                  <Lock className="w-5 h-5 text-neutral-600" />
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${
                isUnlocked 
                  ? "from-indigo-500 to-purple-600 bg-gradient-to-br shadow-lg shadow-indigo-500/20 border-white/20" 
                  : "bg-neutral-900 border-white/10"
              }`}>
                <IconComponent className={`w-7 h-7 ${isUnlocked ? 'text-white' : 'text-neutral-500'}`} />
              </div>

              <h3 className={`text-xl font-bold mb-2 ${isUnlocked ? "text-white" : "text-neutral-400"}`}>
                {badge.name}
              </h3>
              <p className={`text-sm ${isUnlocked ? "text-neutral-300" : "text-neutral-600"}`}>
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
