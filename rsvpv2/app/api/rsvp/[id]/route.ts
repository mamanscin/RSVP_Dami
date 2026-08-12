import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const PHONE_RE = /^[+\d][\d\s\-()]{6,}$/;

type GuestInput = { name?: unknown; phone?: unknown };
type Params = { params: Promise<{ id: string }> };

function isPrismaNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}

// PATCH /api/rsvp/[id] — update an RSVP (admin only).
export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "Body must be an object" },
      { status: 400 },
    );
  }

  const b = body as {
    attending?: unknown;
    guestCount?: unknown;
    guests?: unknown;
    wishes?: unknown;
  };

  const data: Record<string, unknown> = {};

  if (b.attending !== undefined) {
    if (b.attending !== "yes" && b.attending !== "no") {
      return NextResponse.json(
        { ok: false, error: "attending must be 'yes' or 'no'" },
        { status: 400 },
      );
    }
    data.attending = b.attending === "yes";
  }

  if (b.guestCount !== undefined) {
    const n = Number(b.guestCount);
    if (!Number.isInteger(n) || n < 1 || n > 10) {
      return NextResponse.json(
        { ok: false, error: "guestCount must be an integer 1..10" },
        { status: 400 },
      );
    }
    data.guestCount = n;
  }

  if (b.guests !== undefined) {
    if (!Array.isArray(b.guests) || b.guests.length < 1) {
      return NextResponse.json(
        { ok: false, error: "guests must be a non-empty array" },
        { status: 400 },
      );
    }
    // Validate up-front so we can return 400 instead of 500 on bad input.
    let hasPhone = false;
    for (const g of b.guests as GuestInput[]) {
      const name = typeof g?.name === "string" ? g.name.trim() : "";
      if (!name) {
        return NextResponse.json(
          { ok: false, error: "Every guest needs a name" },
          { status: 400 },
        );
      }
      const phone =
        typeof g?.phone === "string" && g.phone.trim().length > 0
          ? g.phone.trim()
          : null;
      if (phone) {
        hasPhone = true;
        if (!PHONE_RE.test(phone)) {
          return NextResponse.json(
            { ok: false, error: "One or more phone numbers are invalid" },
            { status: 400 },
          );
        }
      }
    }
    if (!hasPhone) {
      return NextResponse.json(
        { ok: false, error: "At least one valid phone number is required" },
        { status: 400 },
      );
    }
    const guests = (b.guests as GuestInput[]).map((g) => {
      const name =
        typeof g?.name === "string" ? g.name.trim().slice(0, 120) : "";
      const phone =
        typeof g?.phone === "string" && g.phone.trim().length > 0
          ? g.phone.trim().slice(0, 40)
          : null;
      return { name, phone };
    });
    data.guests = guests;
  }

  if (b.wishes !== undefined) {
    if (b.wishes === null || b.wishes === "") {
      data.wishes = null;
    } else if (typeof b.wishes === "string") {
      data.wishes = b.wishes.trim().slice(0, 2000) || null;
    } else {
      return NextResponse.json(
        { ok: false, error: "wishes must be a string or null" },
        { status: 400 },
      );
    }
  }

  try {
    const updated = await prisma.rsvp.update({
      where: { id },
      data,
      select: {
        id: true,
        attending: true,
        guestCount: true,
        guests: true,
        wishes: true,
        submittedAt: true,
        locale: true,
      },
    });
    return NextResponse.json({ ok: true, rsvp: updated });
  } catch (err) {
    // Prisma "record not found"
    if (isPrismaNotFound(err)) {
      return NextResponse.json(
        { ok: false, error: "RSVP not found" },
        { status: 404 },
      );
    }
    console.error("rsvp.patch failed", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/rsvp/[id] — remove an RSVP (admin only).
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const { id } = await params;

  try {
    await prisma.rsvp.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (isPrismaNotFound(err)) {
      return NextResponse.json(
        { ok: false, error: "RSVP not found" },
        { status: 404 },
      );
    }
    console.error("rsvp.delete failed", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
