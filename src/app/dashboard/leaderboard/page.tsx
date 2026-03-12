import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Trophy, Medal, Star, Shield, ArrowUp } from "lucide-react";

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);
  
  // Fetch top 50 users globally, sorted by totalXP desc
  const leaderBoard = await prisma.user.findMany({
    orderBy: { totalXP: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      level: true,
      totalXP: true,
      githubUsername: true,
    },
    take: 50
  });

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      {/* Header */}
      <header className="flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center shadow-lg shadow-yellow-500/10">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
          Global Leaderboard
        </h1>
        <p className="text-neutral-400 max-w-lg">
          Compete across the globe to earn the highest levels. Your XP is permanently tracked against all registered users.
        </p>
      </header>

      {/* Podium for Top 3 */}
      {leaderBoard.length >= 3 && (
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-16 pt-12">
          {/* Rank 2 */}
          <div className="flex flex-col items-center w-full md:w-48 order-2 md:order-1">
            <div className="relative z-10 p-1 rounded-full bg-gradient-to-b from-neutral-300 to-neutral-500 mb-[-24px]">
              <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-xl font-bold border-2 border-neutral-800 text-neutral-300">
                #2
              </div>
            </div>
            <div className="w-full bg-gradient-to-t from-neutral-900 to-neutral-800 border-t-2 border-neutral-600 rounded-t-2xl pt-10 pb-6 px-4 text-center h-40 flex flex-col justify-end shadow-[0_0_30px_rgba(200,200,200,0.05)]">
              <h3 className="text-white font-bold truncate w-full">{leaderBoard[1].name}</h3>
              <p className="text-neutral-400 text-xs mt-1">Lvl {leaderBoard[1].level}</p>
              <div className="mt-2 text-sm font-bold text-neutral-300 flex items-center justify-center gap-1">
                 <Star className="w-3 h-3 fill-neutral-400 text-neutral-400" /> {leaderBoard[1].totalXP.toLocaleString()} XP
              </div>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center w-full md:w-56 order-1 md:order-2">
            <div className="absolute top-0 w-32 h-32 bg-yellow-500/20 blur-[60px]" />
            <div className="relative z-10 p-1.5 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600 mb-[-32px] shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              <div className="w-20 h-20 rounded-full bg-neutral-950 flex items-center justify-center text-3xl font-black border-4 border-yellow-500/20 text-yellow-400">
                #1
              </div>
            </div>
            <div className="w-full bg-gradient-to-t from-neutral-900 to-yellow-900/40 border-t-2 border-yellow-500/50 rounded-t-3xl pt-12 pb-8 px-4 text-center h-52 flex flex-col justify-end relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(234,179,8,0.1))] pointer-events-none" />
               <h3 className="text-white font-black text-lg truncate w-full relative z-10">{leaderBoard[0].name}</h3>
               <p className="text-yellow-200/60 text-sm mt-1 font-medium relative z-10">Lvl {leaderBoard[0].level}</p>
               <div className="mt-3 text-base font-black text-yellow-400 flex items-center justify-center gap-1.5 relative z-10">
                 <Star className="w-4 h-4 fill-yellow-400" /> {leaderBoard[0].totalXP.toLocaleString()} XP
               </div>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center w-full md:w-48 order-3 md:order-3">
            <div className="relative z-10 p-1 rounded-full bg-gradient-to-b from-orange-400 to-orange-700 mb-[-20px]">
              <div className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center text-lg font-bold border-2 border-orange-900/50 text-orange-400">
                #3
              </div>
            </div>
            <div className="w-full bg-gradient-to-t from-neutral-900 to-neutral-800/80 border-t-2 border-orange-700/50 rounded-t-2xl pt-8 pb-4 px-4 text-center h-32 flex flex-col justify-end shadow-[0_0_30px_rgba(194,65,12,0.05)]">
              <h3 className="text-white font-bold truncate w-full">{leaderBoard[2].name}</h3>
              <p className="text-neutral-400 text-xs mt-1">Lvl {leaderBoard[2].level}</p>
              <div className="mt-2 text-sm font-bold text-orange-400 flex items-center justify-center gap-1">
                 <Star className="w-3 h-3 fill-orange-400 text-orange-400" /> {leaderBoard[2].totalXP.toLocaleString()} XP
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The Rest of the List */}
      <div className="bg-neutral-900/50 border border-white/5 rounded-3xl overflow-hidden p-1 backdrop-blur-xl">
        <div className="bg-neutral-950/80 rounded-[22px] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
             <div className="col-span-2 md:col-span-1 text-center">Rank</div>
             <div className="col-span-6 md:col-span-5">Player</div>
             <div className="col-span-4 md:col-span-3 text-right">Level</div>
             <div className="hidden md:block col-span-3 text-right">Total XP</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {leaderBoard.slice(3).map((user: any, idx: number) => {
              const rank = idx + 4;
              const isMe = session?.user?.id === user.id;

              return (
                <div 
                  key={user.id} 
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-white/[0.02] ${isMe ? 'bg-indigo-500/10' : ''}`}
                >
                  <div className="col-span-2 md:col-span-1 text-center font-bold text-neutral-500">
                    {rank}
                  </div>
                  
                  <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white ${isMe ? 'bg-indigo-500' : 'bg-neutral-800'}`}>
                       {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                     </div>
                     <div className="flex flex-col">
                       <span className="font-semibold text-white whitespace-nowrap hidden md:block">
                         {user.name || "Anonymous Player"} {isMe && <span className="text-xs text-indigo-400 ml-2">(You)</span>}
                       </span>
                       <span className="font-semibold text-white whitespace-nowrap block md:hidden truncate max-w-[100px]">
                         {user.name || "Anon"}
                       </span>
                     </div>
                  </div>
                  
                  <div className="col-span-4 md:col-span-3 flex items-center justify-end">
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-sm font-medium">
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                      Lvl {user.level}
                    </div>
                  </div>
                  
                  <div className="hidden md:flex col-span-3 items-center justify-end font-bold text-emerald-400 text-sm">
                    {user.totalXP.toLocaleString()} XP
                  </div>
                </div>
              );
            })}
            
            {leaderBoard.length <= 3 && (
              <div className="py-12 text-center text-neutral-500">
                Not enough players to form a full leaderboard yet!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
