// filepath: app/api/dev-cleanup/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const r = await prisma.rsvp.deleteMany({});
  const w = await prisma.wish.deleteMany({});
  return NextResponse.json({ deletedRsvps: r.count, deletedWishes: w.count });
}
