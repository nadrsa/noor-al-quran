"use client";

import { useEffect, useState, useCallback } from "react";
import { useReader } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Plus, UserPlus, Copy, Check, Crown, BookOpen } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SURAHS, TOTAL_VERSES } from "@/lib/quran/surahs";

export function GroupsView() {
  const reader = useReader((s) => s.reader);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const load = useCallback(async () => {
    if (!reader) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/groups?readerId=${reader.id}`);
      const d = await res.json();
      setGroups(d.groups || []);
    } catch {
      toast.error("فشل تحميل المجموعات");
    } finally {
      setLoading(false);
    }
  }, [reader]);

  useEffect(() => {
    load();
  }, [load]);

  const joinGroup = async () => {
    if (!reader) return;
    if (joinCode.trim().length < 4) {
      toast.error("أدخل رمز الدعوة الصحيح");
      return;
    }
    try {
      const res = await fetch("/api/groups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteCode: joinCode.trim().toUpperCase(),
          readerId: reader.id,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "fail");
      }
      toast.success("انضممت إلى المجموعة 🎉");
      setJoinCode("");
      load();
    } catch (e: any) {
      toast.error(e.message || "فشل الانضمام");
    }
  };

  if (!reader) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-quran text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            المجموعات
          </h2>
          <p className="text-sm text-muted-foreground font-arabic mt-1">
            أنشئ مجموعة عائلية أو لأصدقائك وتنافسوا في الخير معًا.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="font-arabic" size="sm">
          <Plus className="w-4 h-4" />
          مجموعة جديدة
        </Button>
      </div>

      {/* Join via code */}
      <Card className="border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="font-quran text-lg flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" />
            الانضمام برمز الدعوة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="مثال: ABC123"
              className="font-mono uppercase text-center text-lg tracking-widest"
              maxLength={6}
            />
            <Button onClick={joinGroup} className="font-arabic" disabled={!joinCode.trim()}>
              انضمام
            </Button>
          </div>
          <p className="text-xs text-muted-foreground font-arabic mt-2">
            اسأل منشئ المجموعة عن رمز الدعوة المكوّن من 6 أحرف/أرقام.
          </p>
        </CardContent>
      </Card>

      {/* My groups */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-arabic text-muted-foreground mb-3">
              لست عضوًا في أي مجموعة بعد.
            </p>
            <Button onClick={() => setShowCreate(true)} variant="outline" className="font-arabic" size="sm">
              <Plus className="w-4 h-4" />
              أنشئ أول مجموعة
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {groups.map((g) => (
            <GroupCard key={g.id} group={g} readerId={reader.id} onLeave={load} />
          ))}
        </div>
      )}

      <CreateGroupDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        ownerId={reader.id}
        onCreated={() => {
          setShowCreate(false);
          load();
        }}
      />
    </div>
  );
}

function GroupCard({ group, readerId, onLeave }: { group: any; readerId: string; onLeave: () => void }) {
  const [copied, setCopied] = useState(false);
  const myMembership = group.members.find((m: any) => m.readerId === readerId);
  const isOwner = myMembership?.role === "owner";

  const sortedMembers = [...group.members].sort((a: any, b: any) => b.reader.totalVersesRead - a.reader.totalVersesRead);
  const totalVerses = group.members.reduce((s: number, m: any) => s + m.reader.totalVersesRead, 0);
  const avgVerses = group.members.length > 0 ? Math.round(totalVerses / group.members.length) : 0;

  const copyCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    toast.success("تم نسخ الرمز");
    setTimeout(() => setCopied(false), 2000);
  };

  const leave = async () => {
    if (!confirm(`هل تريد مغادرة مجموعة «${group.name}»؟`)) return;
    // Note: leave endpoint not implemented in this demo; we'd need DELETE /api/groups/members
    toast.info("ميزة المغادرة قيد التطوير");
  };

  return (
    <Card className="border-primary/20 overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-l from-primary/5 to-transparent">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="font-quran text-xl">{group.name}</CardTitle>
              {isOwner && (
                <Badge className="font-arabic text-[10px]">
                  <Crown className="w-3 h-3" />
                  منشئ
                </Badge>
              )}
            </div>
            {group.description && (
              <p className="text-sm text-muted-foreground font-arabic">{group.description}</p>
            )}
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors"
            title="نسخ رمز الدعوة"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
            <span className="font-mono font-bold text-sm text-primary tracking-wider">{group.inviteCode}</span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted/40">
            <p className="font-quran text-xl font-bold text-primary">{group.members.length.toLocaleString("en")}</p>
            <p className="text-[10px] text-muted-foreground font-arabic">أعضاء</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40">
            <p className="font-quran text-xl font-bold text-primary">{totalVerses.toLocaleString("en")}</p>
            <p className="text-[10px] text-muted-foreground font-arabic">آية مجتمعة</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40">
            <p className="font-quran text-xl font-bold text-primary">{avgVerses.toLocaleString("en")}</p>
            <p className="text-[10px] text-muted-foreground font-arabic">المتوسط</p>
          </div>
        </div>

        {/* Members */}
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground font-arabic mb-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            ترتيب الأعضاء
          </p>
          {sortedMembers.map((m: any, i: number) => {
            const isMe = m.readerId === readerId;
            const surah = SURAHS.find((s) => s.number === m.reader.currentSurah);
            const progress = (m.reader.totalVersesRead / TOTAL_VERSES) * 100;
            return (
              <div
                key={m.id}
                className={`flex items-center gap-2.5 p-2 rounded-lg ${isMe ? "bg-primary/10" : ""}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                  i === 0 ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" :
                  i === 1 ? "bg-slate-400/20 text-slate-600 dark:text-slate-300" :
                  i === 2 ? "bg-orange-700/20 text-orange-700 dark:text-orange-400" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {(i + 1).toLocaleString("en")}
                </div>
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarFallback className="text-white text-[10px] font-bold" style={{ backgroundColor: m.reader.avatarColor }}>
                    {m.reader.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={`font-arabic text-xs font-medium truncate ${isMe ? "text-primary" : ""}`}>
                    {m.reader.displayName} {isMe && "(أنت)"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-arabic truncate">
                    {surah?.nameArabic} • آية {m.reader.currentVerse.toLocaleString("en")}
                  </p>
                  <Progress value={progress} className="h-1 mt-1" />
                </div>
                <span className="font-quran text-sm font-bold text-primary shrink-0">
                  {m.reader.totalVersesRead.toLocaleString("en")}
                </span>
              </div>
            );
          })}
        </div>

        {!isOwner && (
          <Button variant="ghost" size="sm" className="w-full font-arabic text-destructive" onClick={leave}>
            مغادرة المجموعة
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function CreateGroupDialog({ open, onOpenChange, ownerId, onCreated }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  ownerId: string;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (name.trim().length < 2) {
      toast.error("أدخل اسمًا للمجموعة");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          ownerId,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "fail");
      }
      toast.success("تم إنشاء المجموعة 🎉");
      setName("");
      setDescription("");
      onCreated();
    } catch (e: any) {
      toast.error(e.message || "فشل الإنشاء");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-arabic">
        <DialogHeader>
          <DialogTitle className="font-quran text-xl text-center">إنشاء مجموعة جديدة</DialogTitle>
          <DialogDescription className="text-center">
            أنشئ مجموعة لعائلتك أو أصدقائك وشاركهم رمز الدعوة.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="gname" className="text-sm">اسم المجموعة</Label>
            <Input
              id="gname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عائلة أحمد، أصدقاء الخير"
              className="font-arabic"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gdesc" className="text-sm">الوصف (اختياري)</Label>
            <Input
              id="gdesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="نبذة عن المجموعة"
              className="font-arabic"
            />
          </div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 text-xs font-arabic text-muted-foreground">
            سيتم توليد رمز دعوة من 6 أحرف يمكنك مشاركته مع من تريد.
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 font-arabic" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button className="flex-1 font-arabic" disabled={loading} onClick={create}>
            {loading ? "جارٍ الإنشاء…" : "إنشاء"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
