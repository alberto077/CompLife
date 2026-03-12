"use client";

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";

export function LoginButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
      <button 
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-900 border border-white/10 text-white font-semibold hover:bg-neutral-800 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <Github className="w-5 h-5" /> Sign in with Github
      </button>
      <button 
        onClick={() => signIn("credentials", { email: "demo@aura.com", password: "demo", callbackUrl: "/dashboard" })}
        className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 border border-indigo-500 text-white font-semibold hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center"
      >
        Try Demo Account
      </button>
    </div>
  );
}
