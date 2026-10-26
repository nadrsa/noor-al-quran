// API: /api/readers
// POST: register or login a new reader (by name)
// GET: list all readers (for leaderboard)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, displayName, avatarColor } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "الاسم مطلوب (حرفان على الأقل)" }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanDisplay = (displayName || cleanName).trim();
    const color = avatarColor || "#0d9488";

    // Find or create
    let reader = await db.reader.findUnique({ where: { name: cleanName } });
    if (!reader) {
      reader = await db.reader.create({
        data: {
          name: cleanName,
          displayName: cleanDisplay,
          avatarColor: color,
        },
      });
    } else {
      // Update display info if changed
      if (reader.displayName !== cleanDisplay || reader.avatarColor !== color) {
        reader = await db.reader.update({
          where: { id: reader.id },
          data: { displayName: cleanDisplay, avatarColor: color },
        });
      }
    }

    return NextResponse.json({ reader });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "فشل في إنشاء القارئ" }, { status: 500 });
  }
}

export async function GET() {
  const readers = await db.reader.findMany({
    orderBy: { totalVersesRead: "desc" },
    take: 100,
  });
  return NextResponse.json({ readers });
}
