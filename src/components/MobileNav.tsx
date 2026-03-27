"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, CheckSquare, Award, Settings } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Skills", href: "/dashboard/skills", icon: Target },
  { name: "Quests", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Badges", href: "/dashboard/badges", icon: Award },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Frosted glass background */}
      <div className="bg-neutral-950/80 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 relative z-10 transition-colors ${
                    isActive ? "text-indigo-400" : "text-neutral-500"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium relative z-10 transition-colors ${
                    isActive ? "text-indigo-400" : "text-neutral-500"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
        {/* Safe area spacer for notched phones */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </nav>
  );
}
