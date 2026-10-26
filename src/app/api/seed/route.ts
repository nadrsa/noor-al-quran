// API: /api/seed
// Seeds the database with demo readers and progress entries for the leaderboard
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SURAHS, toAbsoluteVerse } from "@/lib/quran/surahs";

export async function POST(_req: NextRequest) {
  // Idempotent: if any demo readers exist, skip
  const existing = await db.reader.count({ where: { name: { startsWith: "demo_" } } });
  if (existing > 0) {
    return NextResponse.json({ ok: true, message: "already seeded" });
  }

  const demoReaders = [
    { name: "demo_ahmed_family", displayName: "عائلة أحمد", avatarColor: "#0d9488", surah: 2, verse: 100 },
    { name: "demo_said", displayName: "سعيد", avatarColor: "#7c3aed", surah: 3, verse: 50 },
    { name: "demo_khadija", displayName: "خديجة", avatarColor: "#db2777", surah: 18, verse: 25 },
    { name: "demo_yusuf", displayName: "يوسف", avatarColor: "#ea580c", surah: 36, verse: 40 },
    { name: "demo_maryam", displayName: "مريم", avatarColor: "#0891b2", surah: 55, verse: 12 },
    { name: "demo_omar", displayName: "عمر", avatarColor: "#16a34a", surah: 12, verse: 75 },
  ];

  for (const r of demoReaders) {
    const reader = await db.reader.create({
      data: {
        name: r.name,
        displayName: r.displayName,
        avatarColor: r.avatarColor,
        currentSurah: r.surah,
        currentVerse: r.verse,
        totalVersesRead: toAbsoluteVerse(r.surah, r.verse),
        lastReadDate: new Date(Date.now() - Math.floor(Math.random() * 4) * 24 * 60 * 60 * 1000),
        readingStreak: 1 + Math.floor(Math.random() * 7),
      },
    });

    // Generate progress entries across the surahs the reader has gone through
    for (const surah of SURAHS) {
      if (surah.number < r.surah) {
        // Whole surah read
        for (let v = 1; v <= surah.versesCount; v += Math.max(1, Math.floor(surah.versesCount / 8))) {
          await db.progress.create({
            data: {
              readerId: reader.id,
              surahNumber: surah.number,
              verseNumber: Math.min(v, surah.versesCount),
              action: "read",
              readAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            },
          });
        }
      } else if (surah.number === r.surah) {
        // Partial surah
        for (let v = 1; v <= r.verse; v += 5) {
          await db.progress.create({
            data: {
              readerId: reader.id,
              surahNumber: surah.number,
              verseNumber: Math.min(v, r.verse),
              action: "read",
              readAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
            },
          });
        }
        break;
      }
    }
  }

  return NextResponse.json({ ok: true, message: "seeded demo readers" });
}
