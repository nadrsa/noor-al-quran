// API: /api/readers/[id]
// GET: get a single reader with full stats
// PATCH: update reader (display name, avatar color, current position)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toAbsoluteVerse } from "@/lib/quran/surahs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reader = await db.reader.findUnique({
    where: { id },
    include: {
      bookmarks: { orderBy: { createdAt: "desc" }, take: 50 },
      goals: { orderBy: { createdAt: "desc" }, take: 10 },
      memberships: { include: { group: { include: { members: { include: { reader: true } } } } } },
    },
  });

  if (!reader) {
    return NextResponse.json({ error: "القارئ غير موجود" }, { status: 404 });
  }

  // Get last 30 days of progress for stats
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentProgress = await db.progress.findMany({
    where: { readerId: id, readAt: { gte: thirtyDaysAgo } },
    orderBy: { readAt: "asc" },
  });

  // Group progress by day
  const byDay = new Map<string, number>();
  for (const p of recentProgress) {
    const dayKey = p.readAt.toISOString().slice(0, 10);
    byDay.set(dayKey, (byDay.get(dayKey) || 0) + 1);
  }

  return NextResponse.json({ reader, recentProgress, byDay: Object.fromEntries(byDay) });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { displayName, avatarColor, currentSurah, currentVerse } = body;

  const reader = await db.reader.findUnique({ where: { id } });
  if (!reader) {
    return NextResponse.json({ error: "القارئ غير موجود" }, { status: 404 });
  }

  const update: any = {};
  if (displayName) update.displayName = displayName;
  if (avatarColor) update.avatarColor = avatarColor;
  if (typeof currentSurah === "number" && typeof currentVerse === "number") {
    update.currentSurah = currentSurah;
    update.currentVerse = currentVerse;
    update.totalVersesRead = toAbsoluteVerse(currentSurah, currentVerse);

    // Update streak
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const lastKey = reader.lastReadDate?.toISOString().slice(0, 10);
    if (lastKey !== todayKey) {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      if (lastKey === yesterday) {
        update.readingStreak = (reader.readingStreak || 0) + 1;
      } else {
        update.readingStreak = 1;
      }
    }
    update.lastReadDate = now;
  }

  const updated = await db.reader.update({ where: { id }, data: update });
  return NextResponse.json({ reader: updated });
}
