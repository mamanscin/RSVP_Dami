"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { wedding } from "@/lib/wedding-data";

export function LoginForm({
  initialError,
  nextPath,
}: {
  initialError?: string;
  nextPath?: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Login failed");
        setSubmitting(false);
        return;
      }
      router.push(nextPath && nextPath.startsWith("/admin") ? nextPath : "/admin");
      router.refresh();
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl p-8"
        style={{
          background: "var(--cream-soft)",
          border: "1px solid var(--hairline)",
        }}
      >
        <div className="text-center space-y-1">
          <h1
            className="text-2xl font-serif"
            style={{ color: "var(--ink)" }}
          >
            Admin
          </h1>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: "var(--ink-muted)" }}>
            {wedding.bride.shortName} &amp; {wedding.groom.shortName}
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm"
            style={{ color: "var(--ink-soft)" }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-xl px-4 py-2.5 outline-none focus:ring-2"
            style={{
              background: "var(--cream)",
              border: "1px solid var(--hairline)",
              color: "var(--ink)",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl px-3 py-2 text-sm"
            style={{
              background: "rgba(220, 38, 38, 0.08)",
              border: "1px solid rgba(220, 38, 38, 0.25)",
              color: "#991b1b",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !password}
          className="w-full rounded-xl px-4 py-2.5 font-medium transition disabled:opacity-50"
          style={{
            background: "var(--leaf-700)",
            color: "var(--cream)",
          }}
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-center text-xs" style={{ color: "var(--ink-muted)" }}>
          <Link href="/" style={{ textDecoration: "underline" }}>
            Back to invitation
          </Link>
        </p>
      </form>
    </main>
  );
}
