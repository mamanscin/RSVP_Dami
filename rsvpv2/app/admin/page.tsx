import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { isAdminConfigured, isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminDashboard, type AdminRsvp } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Ummi & Danish",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  await connection();

  if (!isAdminConfigured()) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div
          className="max-w-md text-center rounded-2xl p-8"
          style={{
            background: "var(--cream-soft)",
            border: "1px solid var(--hairline)",
          }}
        >
          <h1 className="text-2xl font-serif mb-3" style={{ color: "var(--ink)" }}>
            Admin not configured
          </h1>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Set the <code className="px-1 rounded bg-black/5">ADMIN_PASSWORD</code> environment
            variable and restart the server to enable the admin dashboard.
          </p>
        </div>
      </main>
    );
  }

  const cookieStore = await cookies();
  if (!isAdminRequest({ cookies: cookieStore })) {
    redirect("/admin/login");
  }

  // Pre-load data on the server so the page is responsive on first paint.
  const [rsvps, wishes, stats] = await Promise.all([
    prisma.rsvp.findMany({ orderBy: { submittedAt: "desc" } }),
    prisma.wish.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.rsvp.aggregate({ _sum: { guestCount: true } }),
  ]);

  const totalGuests = stats._sum.guestCount ?? 0;
  const attending = rsvps.filter((r) => r.attending).length;
  const declined = rsvps.length - attending;

  return (
    <AdminDashboard
      initialRsvps={rsvps.map((r) => ({
        ...r,
        // Prisma types `Json` columns as `JsonValue` (which includes null),
        // but the application always writes a Guest[] here. Narrow at the
        // boundary so the rest of the code can rely on the typed shape.
        guests: r.guests as unknown as AdminRsvp["guests"],
        submittedAt: r.submittedAt.toISOString(),
      }))}
      initialWishes={wishes.map((w) => ({
        ...w,
        createdAt: w.createdAt.toISOString(),
      }))}
      initialStats={{
        totalRsvps: rsvps.length,
        attending,
        declined,
        totalGuests,
        wishTotal: wishes.length,
      }}
    />
  );
}
