"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
    >
      <LogOut className="w-5 h-5" />
      Disconnect
    </button>
  );
}
