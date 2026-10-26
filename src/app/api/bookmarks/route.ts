// API: /api/bookmarks
// POST: create or update a bookmark
// GET: list bookmarks for a reader
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { readerId, surahNumber, verseNumber, note, label } = body;

    if (!readerId || !surahNumber || !verseNumber) {
      return NextResponse.json({ error: "بيانات غير مكتملة" }, { status: 400 });
    }

    const bookmark = await db.bookmark.upsert({
      where: {
        readerId_surahNumber_verseNumber: { readerId, surahNumber, verseNumber },
      },
      create: {
        readerId,
        surahNumber,
        verseNumber,
        note: note || null,
        label: label || null,
      },
      update: {
        note: note ?? null,
        label: label ?? null,
      },
    });

    return NextResponse.json({ bookmark });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "فشل في حفظ العلامة" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const readerId = req.nextUrl.searchParams.get("readerId");
  if (!readerId) {
    return NextResponse.json({ error: "readerId required" }, { status: 400 });
  }
  const bookmarks = await db.bookmark.findMany({
    where: { readerId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bookmarks });
}
