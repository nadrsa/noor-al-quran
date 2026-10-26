// API: /api/leaderboard
// GET: top readers by totalVersesRead
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SURAHS, toAbsoluteVerse } from "@/lib/quran/surahs";

export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");

  const readers = await db.reader.findMany({
    orderBy: { totalVersesRead: "desc" },
    take: limit,
  });

  // Annotate each reader with the surah name where they currently are
  const annotated = readers.map((r) => {
    const surah = SURAHS.find((s) => s.number === r.currentSurah);
    return {
      id: r.id,
      name: r.name,
      displayName: r.displayName,
      avatarColor: r.avatarColor,
      totalVersesRead: r.totalVersesRead,
      currentSurah: r.currentSurah,
      currentVerse: r.currentVerse,
      currentSurahName: surah?.nameArabic || "",
      currentSurahNameEn: surah?.nameTransliteration || "",
      readingStreak: r.readingStreak,
      lastReadDate: r.lastReadDate,
      isDemo: r.name.startsWith("demo_"),
    };
  });

  return NextResponse.json({ leaderboard: annotated });
}
