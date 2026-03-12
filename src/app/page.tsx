import { Target, Zap, Trophy, Activity, GitCommit, SearchCode } from "lucide-react";
import { LoginButtons } from "@/components/LoginButtons";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-32 pb-24 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
          <Zap className="w-4 h-4" />
          <span>V2.0 Gamified Progress is here</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl text-balance">
          Level up your life like an <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">RPG</span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-12">
          Sync your Github commits, Leetcode problems, and daily tasks into one unified XP system. 
          Build skills, earn badges, and dominate your goals.
        </p>

        <LoginButtons />
      </section>

      {/* Bento Grid Features */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24" id="features">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Heatmap Sync */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-white/5 p-8 flex flex-col justify-between hover:bg-neutral-900/80 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
            
            <div className="space-y-4 relative z-10 w-full">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Unified Heatmap</h3>
              <p className="text-neutral-400 max-w-sm">
                Watch your consistency grow. We pull your activity from external sources automatically.
              </p>

              {/* Mock Heatmap */}
              <div className="mt-8 flex gap-2 flex-wrap max-w-md">
                {[...Array(35)].map((_, i) => {
                  const intensity = (i * 7) % 100 / 100; // Deterministic pseudo-randomness replacing Math.random()
                  return (
                    <div 
                      key={i} 
                      className={`w-4 h-4 rounded-sm ${
                        intensity > 0.8 ? 'bg-emerald-400' :
                        intensity > 0.5 ? 'bg-emerald-500/70' :
                        intensity > 0.3 ? 'bg-emerald-500/40' :
                        'bg-white/5'
                      }`}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Skill Trees */}
          <div className="group relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-white/5 p-8 flex flex-col justify-between hover:bg-neutral-900/80 transition-colors">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -mr-16 -mb-16 transition-opacity group-hover:opacity-100 opacity-50" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Skill Trees</h3>
              <p className="text-neutral-400">
                Unlock nodes in your customized skill tree as you complete more tasks.
              </p>
              
              <div className="mt-8 p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                  <span className="text-orange-400 text-xs font-bold">LVL 4</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Algorithms</div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                    <div className="h-full bg-orange-400 rounded-full w-[65%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Auto-Generated Todos */}
          <div className="group relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-white/5 p-8 flex flex-col justify-between hover:bg-neutral-900/80 transition-colors">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Auto Tasks</h3>
              <p className="text-neutral-400">
                Set a goal and we&apos;ll chunk it down into bite-sized daily quests for you automatically.
              </p>
            </div>
          </div>

          {/* Card 4: Integrations */}
          <div id="integrations" className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-white/5 p-8 flex flex-col justify-between hover:bg-neutral-900/80 transition-colors">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />
            <div className="space-y-4 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 h-full">
              <div className="max-w-md space-y-4">
                <h3 className="text-3xl font-bold">Plug into your life</h3>
                <p className="text-neutral-400 text-lg">
                  Connect Github, Leetcode, Canvas, Strava and more. 
                  Every pull request and every mile run earns you XP.
                </p>
                <Link href="/dashboard/settings" className="inline-block px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors mt-4">
                  View Connectors
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <GitCommit className="w-6 h-6 text-neutral-400" />
                  <span className="font-semibold text-sm">GitHub</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <SearchCode className="w-6 h-6 text-yellow-500" />
                  <span className="font-semibold text-sm">LeetCode</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <Target className="w-6 h-6 text-blue-400" />
                  <span className="font-semibold text-sm">Strava</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <Activity className="w-6 h-6 text-red-500" />
                  <span className="font-semibold text-sm">Canvas LMS</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
