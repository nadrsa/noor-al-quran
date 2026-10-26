// API: /api/goals
// POST: create a new reading goal
// GET: list goals for a reader
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { TOTAL_VERSES } from "@/lib/quran/surahs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { readerId, targetDate, startSurah, startVerse, endSurah, endVerse } = body;

    if (!readerId || !targetDate) {
      return NextResponse.json({ error: "بيانات غير مكتملة" }, { status: 400 });
    }

    const target = new Date(targetDate);
    if (isNaN(target.getTime()) || target.getTime() < Date.now()) {
      return NextResponse.json({ error: "التاريخ غير صالح" }, { status: 400 });
    }

    const sSurah = startSurah || 1;
    const sVerse = startVerse || 0;
    const eSurah = endSurah || 114;
    const eVerse = endVerse || 6;

    // Calculate verses needed and verses per day
    const versesNeeded = computeAbsoluteDistance(sSurah, sVerse, eSurah, eVerse);
    const daysRemaining = Math.max(1, Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    const versesPerDay = versesNeeded / daysRemaining;

    // Mark existing active goals as abandoned
    await db.goal.updateMany({
      where: { readerId, status: "active" },
      data: { status: "abandoned" },
    });

    const goal = await db.goal.create({
      data: {
        readerId,
        targetDate: target,
        startSurah: sSurah,
        startVerse: sVerse,
        endSurah: eSurah,
        endVerse: eVerse,
        versesPerDay,
        status: "active",
      },
    });

    return NextResponse.json({ goal, versesNeeded, daysRemaining, versesPerDay });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "فشل في إنشاء الهدف" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const readerId = req.nextUrl.searchParams.get("readerId");
  if (!readerId) {
    return NextResponse.json({ error: "readerId required" }, { status: 400 });
  }
  const goals = await db.goal.findMany({
    where: { readerId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ goals });
}

// Helper: compute distance between two surah:verse positions
function computeAbsoluteDistance(
  sSurah: number, sVerse: number,
  eSurah: number, eVerse: number
): number {
  // Use the SURAHS table to compute absolute positions
  // We need to import lazily to avoid circular
  // Inline implementation
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { toAbsoluteVerse } = require("@/lib/quran/surahs") as typeof import("@/lib/quran/surahs");
  const startAbs = toAbsoluteVerse(sSurah, sVerse);
  const endAbs = toAbsoluteVerse(eSurah, eVerse);
  const dist = endAbs - startAbs;
  return Math.max(1, dist > 0 ? dist : TOTAL_VERSES - startAbs + endAbs);
}
