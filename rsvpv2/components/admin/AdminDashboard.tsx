"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { wedding } from "@/lib/wedding-data";

type Guest = { name: string; phone: string | null };

export type AdminRsvp = {
  id: string;
  attending: boolean;
  guestCount: number;
  guests: Guest[];
  wishes: string | null;
  submittedAt: string;
  locale: string;
  userAgent: string | null;
  ipHash: string | null;
};

export type AdminWish = {
  id: string;
  name: string;
  message: string;
  approved: boolean;
  createdAt: string;
  locale: string;
};

type Stats = {
  totalRsvps: number;
  attending: number;
  declined: number;
  totalGuests: number;
  wishTotal: number;
};

export function AdminDashboard({
  initialRsvps,
  initialWishes,
  initialStats,
}: {
  initialRsvps: AdminRsvp[];
  initialWishes: AdminWish[];
  initialStats: Stats;
}) {
  const router = useRouter();
  const [rsvps, setRsvps] = useState<AdminRsvp[]>(initialRsvps);
  const [wishes, setWishes] = useState<AdminWish[]>(initialWishes);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"rsvps" | "wishes">("rsvps");
  const [, startTransition] = useTransition();

  const refresh = useCallback(async () => {
    const [list, s] = await Promise.all([
      fetch("/api/rsvp").then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ]);
    if (list?.ok) setRsvps(list.rsvps);
    if (s?.ok) setStats(s.stats);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this RSVP? This cannot be undone.")) return;
      const res = await fetch(`/api/rsvp/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error ?? "Delete failed");
        return;
      }
      setRsvps((cur) => cur.filter((r) => r.id !== id));
      // Recompute local stats
      setStats((s) => {
        const gone = rsvps.find((r) => r.id === id);
        if (!gone) return s;
        return {
          totalRsvps: s.totalRsvps - 1,
          attending: s.attending - (gone.attending ? 1 : 0),
          declined: s.declined - (gone.attending ? 0 : 1),
          totalGuests: s.totalGuests - gone.guestCount,
          wishTotal: s.wishTotal,
        };
      });
    },
    [rsvps],
  );

  const handleSave = useCallback(
    async (updated: AdminRsvp) => {
      const res = await fetch(`/api/rsvp/${updated.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attending: updated.attending ? "yes" : "no",
          guestCount: updated.guestCount,
          guests: updated.guests,
          wishes: updated.wishes,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        alert(data?.error ?? "Save failed");
        return false;
      }
      setRsvps((cur) => cur.map((r) => (r.id === updated.id ? updated : r)));
      setEditingId(null);
      // Recompute totals
      await refresh();
      return true;
    },
    [refresh],
  );

  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    startTransition(() => {
      router.push("/admin/login");
      router.refresh();
    });
  }, [router]);

  const handleWishApprove = useCallback(async (id: string, approved: boolean) => {
    const res = await fetch(`/api/wishes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error ?? "Update failed");
      return;
    }
    setWishes((cur) => cur.map((w) => (w.id === id ? { ...w, approved } : w)));
  }, []);

  const handleWishDelete = useCallback(async (id: string) => {
    if (!confirm("Delete this wish?")) return;
    const res = await fetch(`/api/wishes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error ?? "Delete failed");
      return;
    }
    setWishes((cur) => cur.filter((w) => w.id !== id));
    setStats((s) => ({ ...s, wishTotal: Math.max(0, s.wishTotal - 1) }));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rsvps.filter((r) => {
      if (filter === "yes" && !r.attending) return false;
      if (filter === "no" && r.attending) return false;
      if (!q) return true;
      if (r.wishes && r.wishes.toLowerCase().includes(q)) return true;
      return r.guests.some(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          (g.phone ?? "").toLowerCase().includes(q),
      );
    });
  }, [rsvps, filter, search]);

  return (
    <main
      className="min-h-screen px-4 sm:px-6 py-8 sm:py-12"
      style={{ background: "var(--cream)" }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p
              className="text-xs uppercase tracking-[0.25em]"
              style={{ color: "var(--leaf-700)" }}
            >
              Admin · {wedding.bride.shortName} &amp; {wedding.groom.shortName}
            </p>
            <h1
              className="text-3xl sm:text-4xl font-serif mt-1"
              style={{ color: "var(--ink)" }}
            >
              RSVP dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-sm rounded-xl px-3 py-2 transition"
              style={{
                background: "var(--cream-soft)",
                border: "1px solid var(--hairline)",
                color: "var(--ink-soft)",
              }}
            >
              View invitation
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm rounded-xl px-3 py-2 transition"
              style={{
                background: "transparent",
                border: "1px solid var(--hairline)",
                color: "var(--ink-soft)",
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Total RSVPs" value={stats.totalRsvps} accent="leaf" />
          <StatCard label="Attending" value={stats.attending} accent="leaf" />
          <StatCard
            label="Total guests"
            value={stats.totalGuests}
            accent="lemon"
            hint="including +1s"
          />
          <StatCard
            label="Declined"
            value={stats.declined}
            accent="muted"
          />
        </section>

        <nav className="flex gap-1 border-b" style={{ borderColor: "var(--hairline)" }}>
          <Tab
            active={activeTab === "rsvps"}
            onClick={() => setActiveTab("rsvps")}
            label="RSVPs"
            count={rsvps.length}
          />
          <Tab
            active={activeTab === "wishes"}
            onClick={() => setActiveTab("wishes")}
            label="Wishes"
            count={wishes.length}
          />
        </nav>

        {activeTab === "rsvps" && (
          <section className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <FilterChip
                active={filter === "all"}
                onClick={() => setFilter("all")}
                label={`All (${rsvps.length})`}
              />
              <FilterChip
                active={filter === "yes"}
                onClick={() => setFilter("yes")}
                label={`Attending (${stats.attending})`}
              />
              <FilterChip
                active={filter === "no"}
                onClick={() => setFilter("no")}
                label={`Declined (${stats.declined})`}
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, or wishes…"
                className="ml-auto w-full sm:w-72 rounded-xl px-3 py-2 text-sm outline-none"
                style={{
                  background: "var(--cream-soft)",
                  border: "1px solid var(--hairline)",
                  color: "var(--ink)",
                }}
              />
            </div>

            {filtered.length === 0 ? (
              <EmptyState message="No RSVPs match the current filter." />
            ) : (
              <div className="space-y-3">
                {filtered.map((r) =>
                  editingId === r.id ? (
                    <EditRsvpForm
                      key={r.id}
                      rsvp={r}
                      onCancel={() => setEditingId(null)}
                      onSave={handleSave}
                    />
                  ) : (
                    <RsvpRow
                      key={r.id}
                      rsvp={r}
                      onEdit={() => setEditingId(r.id)}
                      onDelete={() => handleDelete(r.id)}
                    />
                  ),
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === "wishes" && (
          <section className="space-y-3">
            {wishes.length === 0 ? (
              <EmptyState message="No wishes yet." />
            ) : (
              wishes.map((w) => (
                <WishRow
                  key={w.id}
                  wish={w}
                  onApprove={(approved) => handleWishApprove(w.id, approved)}
                  onDelete={() => handleWishDelete(w.id)}
                />
              ))
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: number;
  hint?: string;
  accent: "leaf" | "lemon" | "muted";
}) {
  const color =
    accent === "leaf"
      ? "var(--leaf-700)"
      : accent === "lemon"
        ? "var(--lemon-500)"
        : "var(--ink-muted)";
  return (
    <div
      className="rounded-2xl p-4 sm:p-5"
      style={{
        background: "var(--cream-soft)",
        border: "1px solid var(--hairline)",
      }}
    >
      <p
        className="text-[10px] sm:text-xs uppercase tracking-[0.2em]"
        style={{ color: "var(--ink-muted)" }}
      >
        {label}
      </p>
      <p
        className="text-2xl sm:text-3xl font-serif mt-1 tabular-nums"
        style={{ color }}
      >
        {value}
      </p>
      {hint && (
        <p className="text-[10px] mt-1" style={{ color: "var(--ink-faint)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function Tab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium transition -mb-px"
      style={{
        color: active ? "var(--leaf-700)" : "var(--ink-muted)",
        borderBottom: active
          ? "2px solid var(--leaf-700)"
          : "2px solid transparent",
      }}
    >
      {label}
      <span
        className="ml-2 text-xs tabular-nums px-1.5 py-0.5 rounded-full"
        style={{
          background: active ? "var(--leaf-50)" : "var(--cream-soft)",
          color: "var(--ink-muted)",
        }}
      >
        {count}
      </span>
    </button>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm rounded-full px-3 py-1.5 transition"
      style={{
        background: active ? "var(--leaf-700)" : "var(--cream-soft)",
        color: active ? "var(--cream)" : "var(--ink-soft)",
        border: "1px solid " + (active ? "var(--leaf-700)" : "var(--hairline)"),
      }}
    >
      {label}
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{
        background: "var(--cream-soft)",
        border: "1px dashed var(--hairline)",
        color: "var(--ink-muted)",
      }}
    >
      {message}
    </div>
  );
}

function RsvpRow({
  rsvp,
  onEdit,
  onDelete,
}: {
  rsvp: AdminRsvp;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article
      className="rounded-2xl p-4 sm:p-5"
      style={{
        background: "var(--cream-soft)",
        border: "1px solid var(--hairline)",
      }}
    >
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <AttendanceBadge attending={rsvp.attending} />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--ink)" }}
            >
              {primaryName(rsvp)}
            </span>
            {rsvp.guestCount > 1 && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--leaf-50)",
                  color: "var(--leaf-700)",
                }}
              >
                +{rsvp.guestCount - 1} guest{rsvp.guestCount - 1 === 1 ? "" : "s"}
              </span>
            )}
            <span
              className="ml-auto text-xs"
              style={{ color: "var(--ink-muted)" }}
            >
              {formatDate(rsvp.submittedAt)} · {rsvp.locale.toUpperCase()}
            </span>
          </div>

          <ul className="text-sm space-y-0.5" style={{ color: "var(--ink-soft)" }}>
            {rsvp.guests.map((g, i) => (
              <li key={i} className="flex items-center gap-2">
                <span style={{ color: "var(--ink-muted)" }} className="text-xs">
                  {i + 1}.
                </span>
                <span>{g.name}</span>
                {g.phone && (
                  <a
                    href={`tel:${g.phone}`}
                    className="text-xs"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {g.phone}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {rsvp.wishes && (
            <p
              className="text-sm italic rounded-xl px-3 py-2 mt-2"
              style={{
                background: "var(--lemon-50)",
                color: "var(--ink)",
                border: "1px solid var(--lemon-100)",
              }}
            >
              &quot;{rsvp.wishes}&quot;
            </p>
          )}
        </div>

        <div className="flex sm:flex-col gap-2 sm:items-end">
          <button
            type="button"
            onClick={onEdit}
            className="text-sm rounded-xl px-3 py-1.5 transition"
            style={{
              background: "var(--leaf-50)",
              color: "var(--leaf-700)",
              border: "1px solid var(--leaf-100)",
            }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-sm rounded-xl px-3 py-1.5 transition"
            style={{
              background: "transparent",
              color: "var(--danger)",
              border: "1px solid var(--danger-soft)",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function EditRsvpForm({
  rsvp,
  onCancel,
  onSave,
}: {
  rsvp: AdminRsvp;
  onCancel: () => void;
  onSave: (r: AdminRsvp) => Promise<boolean>;
}) {
  const [attending, setAttending] = useState(rsvp.attending);
  const [guestCount, setGuestCount] = useState(rsvp.guestCount);
  const [guests, setGuests] = useState<Guest[]>(
    rsvp.guests.length > 0
      ? rsvp.guests
      : [{ name: "", phone: null }],
  );
  const [wishes, setWishes] = useState(rsvp.wishes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function syncGuestCount(n: number) {
    const safe = Math.min(10, Math.max(1, Math.floor(n) || 1));
    setGuestCount(safe);
    setGuests((cur) => {
      if (safe > cur.length) {
        const extra = Array.from({ length: safe - cur.length }, () => ({
          name: "",
          phone: null,
        }));
        return [...cur, ...extra];
      }
      return cur.slice(0, safe);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Pre-flight: every guest row needs a name, every phone must be valid.
    for (const g of guests) {
      if (!g.name.trim()) {
        setError("Please enter a name for every guest.");
        return;
      }
    }

    setSaving(true);
    const ok = await onSave({
      ...rsvp,
      attending,
      guestCount,
      guests,
      wishes: wishes.trim() ? wishes.trim() : null,
    });
    if (!ok) {
      setSaving(false);
      setError("Could not save. Check the form and try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-4 sm:p-5 space-y-4"
      style={{
        background: "var(--cream)",
        border: "2px solid var(--leaf-200)",
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--leaf-700)" }}
        >
          Editing
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAttending(true)}
            className="text-sm rounded-full px-3 py-1.5"
            style={{
              background: attending ? "var(--leaf-700)" : "var(--cream-soft)",
              color: attending ? "var(--cream)" : "var(--ink-soft)",
              border: "1px solid " + (attending ? "var(--leaf-700)" : "var(--hairline)"),
            }}
          >
            Attending
          </button>
          <button
            type="button"
            onClick={() => setAttending(false)}
            className="text-sm rounded-full px-3 py-1.5"
            style={{
              background: !attending ? "var(--ink-soft)" : "var(--cream-soft)",
              color: !attending ? "var(--cream)" : "var(--ink-soft)",
              border: "1px solid " + (!attending ? "var(--ink-soft)" : "var(--hairline)"),
            }}
          >
            Declined
          </button>
        </div>
        <label
          className="ml-auto text-sm flex items-center gap-2"
          style={{ color: "var(--ink-soft)" }}
        >
          Guests
          <input
            type="number"
            min={1}
            max={10}
            value={guestCount}
            onChange={(e) => syncGuestCount(Number(e.target.value))}
            className="w-16 rounded-lg px-2 py-1 text-center tabular-nums"
            style={{
              background: "var(--cream-soft)",
              border: "1px solid var(--hairline)",
              color: "var(--ink)",
            }}
          />
        </label>
      </div>

      <div className="space-y-2">
        {guests.map((g, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-[2fr_2fr] gap-2"
          >
            <input
              type="text"
              value={g.name}
              onChange={(e) =>
                setGuests((cur) =>
                  cur.map((x, idx) =>
                    idx === i ? { ...x, name: e.target.value } : x,
                  ),
                )
              }
              placeholder="Name"
              required
              className="rounded-lg px-3 py-1.5 text-sm"
              style={{
                background: "var(--cream-soft)",
                border: "1px solid var(--hairline)",
                color: "var(--ink)",
              }}
            />
            <input
              type="tel"
              value={g.phone ?? ""}
              onChange={(e) =>
                setGuests((cur) =>
                  cur.map((x, idx) =>
                    idx === i
                      ? { ...x, phone: e.target.value || null }
                      : x,
                  ),
                )
              }
              placeholder="Phone (optional)"
              className="rounded-lg px-3 py-1.5 text-sm"
              style={{
                background: "var(--cream-soft)",
                border: "1px solid var(--hairline)",
                color: "var(--ink)",
              }}
            />
          </div>
        ))}
      </div>

      <textarea
        value={wishes}
        onChange={(e) => setWishes(e.target.value)}
        placeholder="Wishes (optional)"
        rows={2}
        className="w-full rounded-lg px-3 py-2 text-sm"
        style={{
          background: "var(--cream-soft)",
          border: "1px solid var(--hairline)",
          color: "var(--ink)",
        }}
      />

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

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl px-4 py-2 text-sm transition disabled:opacity-50"
          style={{
            background: "transparent",
            color: "var(--ink-soft)",
            border: "1px solid var(--hairline)",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50"
          style={{
            background: "var(--leaf-700)",
            color: "var(--cream)",
          }}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function AttendanceBadge({ attending }: { attending: boolean }) {
  return (
    <span
      className="text-[10px] uppercase tracking-[0.2em] font-medium px-2 py-0.5 rounded-full"
      style={{
        background: attending ? "var(--leaf-50)" : "var(--cream)",
        color: attending ? "var(--leaf-700)" : "var(--ink-muted)",
        border: "1px solid " + (attending ? "var(--leaf-200)" : "var(--hairline)"),
      }}
    >
      {attending ? "Yes" : "No"}
    </span>
  );
}

function WishRow({
  wish,
  onApprove,
  onDelete,
}: {
  wish: AdminWish;
  onApprove: (approved: boolean) => void;
  onDelete: () => void;
}) {
  return (
    <article
      className="rounded-2xl p-4 sm:p-5"
      style={{
        background: "var(--cream-soft)",
        border: "1px solid var(--hairline)",
        opacity: wish.approved ? 1 : 0.6,
      }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--ink)" }}
            >
              {wish.name}
            </span>
            <span className="text-xs" style={{ color: "var(--ink-muted)" }}>
              {formatDate(wish.createdAt)} · {wish.locale.toUpperCase()}
            </span>
            {!wish.approved && (
              <span
                className="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--lemon-100)",
                  color: "var(--ink-soft)",
                }}
              >
                Hidden
              </span>
            )}
          </div>
          <p
            className="text-sm italic"
            style={{ color: "var(--ink-soft)" }}
          >
            &quot;{wish.message}&quot;
          </p>
        </div>
        <div className="flex sm:flex-col gap-2">
          <button
            type="button"
            onClick={() => onApprove(!wish.approved)}
            className="text-sm rounded-xl px-3 py-1.5 transition"
            style={{
              background: "var(--leaf-50)",
              color: "var(--leaf-700)",
              border: "1px solid var(--leaf-100)",
            }}
          >
            {wish.approved ? "Hide" : "Approve"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-sm rounded-xl px-3 py-1.5 transition"
            style={{
              background: "transparent",
              color: "var(--danger)",
              border: "1px solid var(--danger-soft)",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function primaryName(r: AdminRsvp): string {
  return r.guests[0]?.name ?? "—";
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
