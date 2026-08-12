import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { createHash } from "node:crypto";
import { requireAdmin } from "@/lib/auth";

// Local re-implementations of the client-side validators so the server
// enforces the same shape (never trust the client).

const PHONE_RE = /^[+\d][\d\s\-()]{6,}$/;

type GuestInput = { name?: unknown; phone?: unknown };

function normalizeGuest(g: GuestInput, fallbackName: string): {
  name: string;
  phone: string | null;
} {
  const name =
    typeof g?.name === "string" && g.name.trim().length > 0
      ? g.name.trim().slice(0, 120)
      : fallbackName;
  const phone =
    typeof g?.phone === "string" && g.phone.trim().length > 0
      ? g.phone.trim().slice(0, 40)
      : null;
  return { name, phone };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // Validate payload.
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "Body must be an object" },
      { status: 400 }
    );
  }

  const b = body as {
    attending?: unknown;
    guestCount?: unknown;
    guests?: unknown;
    wishes?: unknown;
    locale?: unknown;
  };

  if (b.attending !== "yes" && b.attending !== "no") {
    return NextResponse.json(
      { ok: false, error: "attending must be 'yes' or 'no'" },
      { status: 400 }
    );
  }

  const guestCountRaw = Number(b.guestCount);
  if (
    !Number.isFinite(guestCountRaw) ||
    !Number.isInteger(guestCountRaw) ||
    guestCountRaw < 1 ||
    guestCountRaw > 10
  ) {
    return NextResponse.json(
      { ok: false, error: "guestCount must be an integer 1..10" },
      { status: 400 }
    );
  }

  if (!Array.isArray(b.guests) || b.guests.length < 1) {
    return NextResponse.json(
      { ok: false, error: "guests must be a non-empty array" },
      { status: 400 }
    );
  }
  if (b.guests.length > 10) {
    return NextResponse.json(
      { ok: false, error: "guests must contain at most 10 entries" },
      { status: 400 }
    );
  }

  const primaryName = (() => {
    const first = b.guests?.[0] as GuestInput | undefined;
    return typeof first?.name === "string" ? first.name.trim() : "";
  })();
  if (primaryName.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Primary guest name is required" },
      { status: 400 }
    );
  }
  if (primaryName.length > 120) {
    return NextResponse.json(
      { ok: false, error: "Name is too long" },
      { status: 400 }
    );
  }

  const guests = (b.guests as GuestInput[]).map((g) =>
    normalizeGuest(g, primaryName)
  );

  if (guests.some((g) => g.phone && !PHONE_RE.test(g.phone))) {
    return NextResponse.json(
      { ok: false, error: "One or more phone numbers are invalid" },
      { status: 400 }
    );
  }

  if (!guests.some((g) => g.phone)) {
    return NextResponse.json(
      { ok: false, error: "At least one valid phone number is required" },
      { status: 400 }
    );
  }

  if (guests.some((g) => !g.name)) {
    return NextResponse.json(
      { ok: false, error: "Every guest needs a name" },
      { status: 400 }
    );
  }

  const wishes =
    typeof b.wishes === "string" && b.wishes.trim().length > 0
      ? b.wishes.trim().slice(0, 2000)
      : null;

  const locale =
    typeof b.locale === "string" && (b.locale === "en" || b.locale === "ms")
      ? b.locale
      : "en";

  // Hash the IP for a privacy-preserving audit trail.
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 32);

  const userAgent = request.headers.get("user-agent") ?? null;

  try {
    const created = await prisma.rsvp.create({
      data: {
        attending: b.attending === "yes",
        guestCount: guestCountRaw,
        guests,
        wishes,
        locale,
        userAgent,
        ipHash,
      },
      select: { id: true, submittedAt: true },
    });

    return NextResponse.json(
      { ok: true, id: created.id, submittedAt: created.submittedAt },
      { status: 201 }
    );
  } catch (err) {
    console.error("rsvp.post failed", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/rsvp — list all RSVPs (admin only).
export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const rsvps = await prisma.rsvp.findMany({
    orderBy: { submittedAt: "desc" },
  });
  return NextResponse.json({ ok: true, rsvps });
}
