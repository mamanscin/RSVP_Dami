import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

function isPrismaNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}

// PATCH /api/wishes/[id] — update wish (approve, edit message, etc.).
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
  const b = body as { approved?: unknown; message?: unknown };
  const data: Record<string, unknown> = {};
  if (b.approved !== undefined) {
    if (typeof b.approved !== "boolean") {
      return NextResponse.json(
        { ok: false, error: "approved must be boolean" },
        { status: 400 },
      );
    }
    data.approved = b.approved;
  }
  if (b.message !== undefined) {
    if (typeof b.message !== "string") {
      return NextResponse.json(
        { ok: false, error: "message must be a string" },
        { status: 400 },
      );
    }
    data.message = b.message.trim().slice(0, 2000);
  }
  try {
    const updated = await prisma.wish.update({
      where: { id },
      data,
      select: { id: true, name: true, message: true, approved: true, createdAt: true, locale: true },
    });
    return NextResponse.json({ ok: true, wish: updated });
  } catch (err) {
    if (isPrismaNotFound(err)) {
      return NextResponse.json(
        { ok: false, error: "Wish not found" },
        { status: 404 },
      );
    }
    console.error("wish.patch failed", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/wishes/[id] — remove a wish (admin only).
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const { id } = await params;

  try {
    await prisma.wish.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (isPrismaNotFound(err)) {
      return NextResponse.json(
        { ok: false, error: "Wish not found" },
        { status: 404 },
      );
    }
    console.error("wish.delete failed", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
