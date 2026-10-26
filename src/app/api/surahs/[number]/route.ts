// API: /api/surahs/[number]
// GET: returns surah metadata and verse list (using VERSES data when available)
import { NextRequest, NextResponse } from "next/server";
import { getSurah, SURAHS } from "@/lib/quran/surahs";
import { getVerseText } from "@/lib/quran/verses";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  const { number: numStr } = await params;
  const number = parseInt(numStr);
  const surah = getSurah(number);
  if (!surah) {
    return NextResponse.json({ error: "السورة غير موجودة" }, { status: 404 });
  }

  // Build verse list
  const verses: Array<{
    surahNumber: number;
    verseNumber: number;
    arabic: string | null;
    translation: string | null;
    tafsir: string | null;
    available: boolean;
  }> = [];
  for (let v = 1; v <= surah.versesCount; v++) {
    const text = getVerseText(number, v);
    if (text) {
      verses.push({
        surahNumber: number,
        verseNumber: v,
        arabic: text.arabic,
        translation: text.translation,
        tafsir: text.tafsir,
        available: true,
      });
    } else {
      verses.push({
        surahNumber: number,
        verseNumber: v,
        arabic: null,
        translation: null,
        tafsir: null,
        available: false,
      });
    }
  }

  return NextResponse.json({ surah, verses });
}

// Also support listing all surahs at /api/surahs (no [number])
export async function OPTIONS() {
  return NextResponse.json({});
}
