// API: /api/progress
// POST: mark verse(s) as read - updates reader position and progress entries
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toAbsoluteVerse, getSurah } from "@/lib/quran/surahs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { readerId, surahNumber, fromVerse, toVerse } = body;

    if (!readerId || !surahNumber || !toVerse) {
      return NextResponse.json({ error: "بيانات غير مكتملة" }, { status: 400 });
    }

    const surah = getSurah(surahNumber);
    if (!surah) {
      return NextResponse.json({ error: "السورة غير موجودة" }, { status: 404 });
    }

    const startVerse = fromVerse || toVerse;
    const endVerse = Math.min(toVerse, surah.versesCount);

    if (endVerse < 1 || endVerse > surah.versesCount) {
      return NextResponse.json({ error: "رقم الآية خارج النطاق" }, { status: 400 });
    }

    const reader = await db.reader.findUnique({ where: { id: readerId } });
    if (!reader) {
      return NextResponse.json({ error: "القارئ غير موجود" }, { status: 404 });
    }

    // Create progress entries for each verse marked (or sample to avoid too many rows)
    const step = endVerse - startVerse > 50 ? 5 : 1;
    const now = new Date();
    const entries: Array<{
      readerId: string;
      surahNumber: number;
      verseNumber: number;
      action: string;
      readAt: Date;
    }> = [];
    for (let v = startVerse; v <= endVerse; v += step) {
      entries.push({
        readerId,
        surahNumber,
        verseNumber: v,
        action: "read",
        readAt: now,
      });
    }
    if (entries.length > 0) {
      await db.progress.createMany({ data: entries });
    }

    // Update reader position if this advances their position
    const currentAbs = toAbsoluteVerse(reader.currentSurah, reader.currentVerse);
    const newAbs = toAbsoluteVerse(surahNumber, endVerse);

    const update: any = {};
    if (newAbs > currentAbs) {
      update.currentSurah = surahNumber;
      update.currentVerse = endVerse;
      update.totalVersesRead = newAbs;

      // Update streak
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

    const updated = await db.reader.update({ where: { id: readerId }, data: update });

    return NextResponse.json({
      ok: true,
      reader: updated,
      versesMarked: entries.length,
      newPosition: { surah: surahNumber, verse: endVerse },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "فشل في تسجيل التقدم" }, { status: 500 });
  }
}

// GET: progress for a reader (last 30 days)
export async function GET(req: NextRequest) {
  const readerId = req.nextUrl.searchParams.get("readerId");
  if (!readerId) {
    return NextResponse.json({ error: "readerId required" }, { status: 400 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const progress = await db.progress.findMany({
    where: { readerId, readAt: { gte: thirtyDaysAgo } },
    orderBy: { readAt: "asc" },
  });

  const byDay = new Map<string, number>();
  for (const p of progress) {
    const dayKey = p.readAt.toISOString().slice(0, 10);
    byDay.set(dayKey, (byDay.get(dayKey) || 0) + 1);
  }

  return NextResponse.json({ progress, byDay: Object.fromEntries(byDay) });
}
