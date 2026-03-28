"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, KeyRound } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setStatus("success");
      setMessage("Your password has been successfully reset. You can now log in with your new password.");
      
      // Optionally redirect after a few seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-900/50 border border-red-500/20 backdrop-blur-xl text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Invalid Reset Link</h2>
        <p className="text-neutral-400 text-sm mb-6">
          This password reset link is invalid or is missing the verification token.
        </p>
        <Link 
          href="/forgot-password"
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
        >
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-900/50 border border-white/5 backdrop-blur-xl">
      <Link 
        href="/login" 
        className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to login
      </Link>

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Choose New Password</h1>
        <p className="text-neutral-400 text-sm mt-2">
          Make sure it's at least 8 characters long.
        </p>
      </div>

      {status === "success" ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <p className="text-sm font-medium text-emerald-400 leading-relaxed">
            {message}
          </p>
          <div className="pt-2">
            <Link 
              href="/login"
              className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === "error" && (
            <div className="p-3 mb-4 flex items-start gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>{message}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">New Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
              disabled={status === "loading"}
              minLength={8}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Confirm Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
              disabled={status === "loading"}
              minLength={8}
            />
          </div>

          <button 
            type="submit" 
            disabled={status === "loading" || !password || !confirmPassword}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {status === "loading" ? "Resetting..." : "Reset Password"} 
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
         <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
