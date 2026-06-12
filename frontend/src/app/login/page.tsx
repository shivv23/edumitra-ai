"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmail, signUp } from "./actions";

function Alert({ type, message }: { type: "error" | "success"; message: string }) {
  const colors = {
    error: "bg-red-500/10 border-red-500/20 text-red-400",
    success: "bg-accent-500/10 border-accent-500/20 text-accent-400",
  };
  return <div className={`mb-4 p-3 rounded-xl border ${colors[type]} text-sm animate-slide-up`}>{message}</div>;
}

function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full mt-2">
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {label}...
        </span>
      ) : label}
    </button>
  );
}

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") || "login");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const result = await signInWithEmail(form);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);
    const form = new FormData(e.currentTarget);
    const result = await signUp(form);
    setPending(false);
    if (result?.error) setError(result.error);
    if (result?.success) setSuccess(result.message || "Account created!");
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,122,18,0.06),transparent_60%)]" />
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-4 shadow-lg shadow-primary-500/20 animate-float glow">
            <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10 text-white">
              <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" fill="currentColor" opacity="0.2" />
              <path d="M16 8c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" fill="currentColor" opacity="0.4" />
              <path d="M16 12c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z" fill="currentColor" opacity="0.6" />
              <circle cx="16" cy="16" r="2" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-display">Welcome to EduMitra</h1>
          <p className="text-surface-400 mt-1">Learn better, stress less — in your own language.</p>
        </div>

        <div className="glass-strong rounded-2xl p-8 animate-slide-up">
          <div className="flex bg-surface-800/50 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setTab("login"); setError(null); setSuccess(null); router.replace("/login"); }}
              className={`flex-1 py-2.5 text-center text-sm font-medium rounded-lg transition-all ${
                tab !== "signup" ? "bg-primary-500/20 text-primary-300 shadow-sm" : "text-surface-400 hover:text-surface-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab("signup"); setError(null); setSuccess(null); router.replace("/login?tab=signup"); }}
              className={`flex-1 py-2.5 text-center text-sm font-medium rounded-lg transition-all ${
                tab === "signup" ? "bg-primary-500/20 text-primary-300 shadow-sm" : "text-surface-400 hover:text-surface-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          {tab === "signup" ? (
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-surface-300">Full Name</label>
                <input id="name" name="name" type="text" placeholder="Your full name" required className="input-premium" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-surface-300">Email Address</label>
                <input id="email" name="email" type="email" placeholder="you@school.edu.in" required className="input-premium" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-surface-300">Password</label>
                <input id="password" name="password" type="password" placeholder="At least 8 characters" required minLength={8} className="input-premium" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="role" className="text-sm font-medium text-surface-300">I am a</label>
                <select id="role" name="role" defaultValue="student" className="input-premium">
                  <option value="student">Student</option>
                  <option value="parent">Parent / Guardian</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              <div className="flex items-start gap-3 mt-2">
                <input id="consent" name="consent" type="checkbox" required className="mt-1 w-4 h-4 rounded border-surface-700 bg-surface-800 accent-primary-500" />
                <label htmlFor="consent" className="text-xs text-surface-400 leading-relaxed">
                  I agree to the processing of my data in accordance with India&apos;s DPDP Act 2023.
                  I am 18+ or have parental consent.
                </label>
              </div>
              <SubmitButton label="Create Free Account" pending={pending} />
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-surface-300">Email Address</label>
                <input id="email" name="email" type="email" placeholder="you@school.edu.in" required className="input-premium" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-surface-300">Password</label>
                <input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} className="input-premium" />
              </div>
              <SubmitButton label="Sign In" pending={pending} />
              <div className="text-center mt-2">
                <button type="button" onClick={() => { setTab("signup"); setError(null); setSuccess(null); router.replace("/login?tab=signup"); }} className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                  Don&apos;t have an account? Sign up
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-surface-500 text-xs mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          Protected by India&apos;s DPDP Act 2023 — your data is encrypted and secure.
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950">
      <div className="w-6 h-6 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginFormInner />
    </Suspense>
  );
}
