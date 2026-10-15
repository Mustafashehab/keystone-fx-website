"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function ResetPasswordPage() {
  const [supabase] = useState(() => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { isSingleton: false, auth: { detectSessionInUrl: false } }));
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        const url = new URL(window.location.href);
        const fragment = new URLSearchParams(url.hash.slice(1));
        if (url.searchParams.has("error") || fragment.has("error")) {
          throw new Error("This recovery link is invalid or expired. Request a new link.");
        }
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          window.history.replaceState(null, "", url.pathname);
          if (error) throw new Error("Unable to verify this link. Open a fresh recovery email in the same browser where you requested it.");
        } else if (fragment.get("type") === "recovery") {
          const access_token = fragment.get("access_token");
          const refresh_token = fragment.get("refresh_token");
          if (!access_token || !refresh_token) throw new Error("Incomplete recovery link. Request a new link.");
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          window.history.replaceState(null, "", url.pathname);
          if (error) throw new Error("This recovery link has expired. Request a new link.");
        }
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) throw new Error("Open the latest password recovery link from your email to continue.");
        if (active) setReady(true);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Unable to verify recovery link.");
      } finally {
        if (active) setChecking(false);
      }
    }
    void initialize();
    return () => { active = false; };
  }, [supabase]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 12) { setError("Use at least 12 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { setError(error.message); return; }
      setPassword(""); setConfirm(""); setReady(false); setDone(true);
      await supabase.auth.signOut();
    } catch {
      setError("Unable to save your password. Please try again.");
    } finally { setSaving(false); }
  }

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-[#f8f6f0] p-5">
      <section className="w-full max-w-md rounded-2xl border border-[#c9a84c] bg-white p-8 shadow-lg">
        <p className="mb-4 text-sm font-semibold tracking-widest text-[#92762c]">KEYSTONE FX</p>
        <h1 className="mb-3 text-2xl font-bold text-slate-900">{done ? "Password updated" : "Choose a new password"}</h1>
        {checking && <p role="status" className="text-slate-600">Verifying your recovery link…</p>}
        {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
        {done ? <><p className="mb-5 text-slate-600">Your password has been changed. Sign in with your new password.</p><Link className="font-semibold text-[#92762c]" href="/admin/login">Administrator sign in</Link><br /><Link className="text-sm text-slate-600" href="/portal/login">Client sign in</Link></> : ready ? (
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm text-slate-700">New password<input className="mt-1 w-full rounded border border-slate-300 p-3 text-slate-900" type="password" autoComplete="new-password" minLength={12} required value={password} onChange={e => setPassword(e.target.value)} /></label>
            <label className="block text-sm text-slate-700">Confirm new password<input className="mt-1 w-full rounded border border-slate-300 p-3 text-slate-900" type="password" autoComplete="new-password" minLength={12} required value={confirm} onChange={e => setConfirm(e.target.value)} /></label>
            <p className="text-xs text-slate-500">Use at least 12 characters.</p>
            <button disabled={saving} type="submit" className="w-full rounded bg-[#c9a84c] p-3 font-semibold text-slate-950 disabled:opacity-50">{saving ? "Saving…" : "Save new password"}</button>
          </form>
        ) : !checking && <Link className="font-semibold text-[#92762c]" href="/portal/forgot-password">Request a new recovery link</Link>}
      </section>
    </main>
  );
}
