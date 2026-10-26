// API: /api/groups
// POST: create a group with an invite code
// GET: list groups for a reader
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function makeInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, ownerId } = body;

    if (!name || !ownerId) {
      return NextResponse.json({ error: "بيانات غير مكتملة" }, { status: 400 });
    }

    // Generate unique invite code
    let code = makeInviteCode();
    let exists = await db.group.findUnique({ where: { inviteCode: code } });
    while (exists) {
      code = makeInviteCode();
      exists = await db.group.findUnique({ where: { inviteCode: code } });
    }

    const group = await db.group.create({
      data: {
        name: name.trim(),
        description: description || null,
        inviteCode: code,
        members: {
          create: { readerId: ownerId, role: "owner" },
        },
      },
      include: { members: true },
    });

    return NextResponse.json({ group });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "فشل في إنشاء المجموعة" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const readerId = req.nextUrl.searchParams.get("readerId");
  if (!readerId) {
    return NextResponse.json({ error: "readerId required" }, { status: 400 });
  }
  const memberships = await db.groupMember.findMany({
    where: { readerId },
    include: {
      group: {
        include: {
          members: { include: { reader: true } },
        },
      },
    },
  });
  return NextResponse.json({ groups: memberships.map((m) => m.group) });
}

// PATCH: join a group via invite code
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { inviteCode, readerId } = body;

    if (!inviteCode || !readerId) {
      return NextResponse.json({ error: "بيانات غير مكتملة" }, { status: 400 });
    }

    const group = await db.group.findUnique({
      where: { inviteCode: inviteCode.toUpperCase().trim() },
    });
    if (!group) {
      return NextResponse.json({ error: "رمز الدعوة غير صالح" }, { status: 404 });
    }

    const existing = await db.groupMember.findUnique({
      where: { groupId_readerId: { groupId: group.id, readerId } },
    });
    if (existing) {
      return NextResponse.json({ ok: true, message: "already a member", group });
    }

    await db.groupMember.create({
      data: { groupId: group.id, readerId, role: "member" },
    });

    return NextResponse.json({ ok: true, group });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "فشل في الانضمام للمجموعة" }, { status: 500 });
  }
}
