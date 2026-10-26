// API: /api/surahs
// GET: returns all 114 surahs metadata
import { NextResponse } from "next/server";
import { SURAHS, TOTAL_VERSES } from "@/lib/quran/surahs";

export async function GET() {
  return NextResponse.json({ surahs: SURAHS, totalVerses: TOTAL_VERSES });
}
