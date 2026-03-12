"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function NavbarAuth() {
  const router = useRouter();
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
