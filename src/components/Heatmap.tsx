"use client";

import React, { useEffect, useState } from "react";
import { ActivityCalendar, ThemeInput } from 'react-activity-calendar';
import { getHeatmapActivity } from "@/app/actions";
import { Activity } from "lucide-react";

const explicitTheme: ThemeInput = {
  light: ['#171717', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
  dark: ['#171717', '#064e3b', '#047857', '#10b981', '#34d399'],
};

export function Heatmap() {
  const [data, setData] = useState<{date: string; count: number; level: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const logs = await getHeatmapActivity();
        
        // Aggregate XP per day
        const grouped: Record<string, number> = {};
        logs.forEach((log: { date: Date; xpEarned: number }) => {
          const day = log.date.toISOString().split('T')[0];
          grouped[day] = (grouped[day] || 0) + log.xpEarned;
        });

        // Convert to react-activity-calendar format and calculate levels (0-4)
        const formatData = Object.entries(grouped).map(([date, xp]) => {
          let level = 0;
          if (xp > 0) level = 1;
          if (xp > 100) level = 2;
          if (xp > 300) level = 3;
          if (xp > 500) level = 4;

          return { date, count: xp, level };
        });

        setData(formatData);
      } catch (e) {
        console.error("Failed to load heatmap", e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 w-full flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Activity Heatmap</h2>
          <p className="text-sm text-neutral-400">Your daily XP consistency over time.</p>
        </div>
      </div>
      
      <div className="flex justify-center flex-1 w-full overflow-x-auto no-scrollbar">
        <div className="min-w-max p-2">
          {!loading && (
             <ActivityCalendar 
               data={data.length > 0 ? data : [{ date: new Date().toISOString().split('T')[0], count: 0, level: 0 }]} 
               theme={explicitTheme}
               colorScheme="dark"
               blockSize={14}
               blockRadius={4}
               blockMargin={4}
               fontSize={12}
             />
          )}
        </div>
      </div>
    </div>
  );
}
