"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function NavbarAuth({ hasSession }: { hasSession?: boolean }) {
  const router = useRouter();

  if (hasSession) {
    return (
      <div className="flex items-center gap-4">
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm font-medium px-4 py-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => signIn()}
        className="text-sm font-medium text-neutral-300 hover:text-white transition-colors text-left"
      >
        Log in
      </button>
      <button 
        onClick={() => router.push("/register")}
        className="text-sm font-medium px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors text-left"
      >
        Get Started
      </button>
    </div>
  );
}
