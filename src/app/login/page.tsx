"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Github, AlertTriangle } from "lucide-react";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl
    });

    if (res?.error) {
      setError("Invalid email or password");
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  const handleDemoSignIn = async () => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: "demo@complife.com",
      password: "demo",
      callbackUrl
    });
    
    if (!res?.error) {
      router.push(callbackUrl);
    } else {
      setError("Demo login failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-900/50 border border-white/5 backdrop-blur-xl">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
          <span className="font-bold text-white text-xl">A</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="text-neutral-400 text-sm mt-2">Log in to track your progress.</p>
      </div>

      {error && (
        <div className="p-3 mb-6 flex items-center gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-neutral-300">Password</label>
            <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Forgot password?</Link>
          </div>
          <input 
            type="password" 
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="••••••••"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Log In"} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm text-neutral-500 px-2 before:h-px before:flex-1 before:bg-white/5 after:h-px after:flex-1 after:bg-white/5 gap-4">
        OR
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button 
          onClick={handleDemoSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
        >
          Quick Demo Login
        </button>
        <button 
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <Github className="w-5 h-5" /> Continue with GitHub
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-neutral-400">
        Don't have an account?{' '}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">Create one</Link>
      </p>
    </div>
  );
}

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
         <LoginContent />
      </Suspense>
    </div>
  );
}
