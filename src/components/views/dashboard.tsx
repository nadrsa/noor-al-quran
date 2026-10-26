"use client";

import { useEffect, useState, useCallback } from "react";
import { useReader } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BookOpen, Flame, Target, TrendingUp, Play, ChevronLeft, Bookmark, Trophy,
} from "lucide-react";
import { SURAHS, TOTAL_VERSES, getSurah, toAbsoluteVerse } from "@/lib/quran/surahs";
import type { TabId } from "@/components/app-shell";
import { toast } from "sonner";

interface DashboardData {
  reader: any;
  recentProgress: any[];
  byDay: Record<string, number>;
}

export function Dashboard({ onNavigate }: { onNavigate: (t: TabId) => void }) {
  const reader = useReader((s) => s.reader);
  const updateReader = useReader((s) => s.updateReader);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!reader) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/readers/${reader.id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        const r = json.reader;
        updateReader({
          currentSurah: r.currentSurah,
          currentVerse: r.currentVerse,
          totalVersesRead: r.totalVersesRead,
          readingStreak: r.readingStreak,
          lastReadDate: r.lastReadDate,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [reader, updateReader]);

  useEffect(() => {
    load();
  }, [load]);

  if (!reader) return null;

  const currentSurah = getSurah(reader.currentSurah);
  const progressPercent = Math.min(100, (reader.totalVersesRead / TOTAL_VERSES) * 100);
  const surahProgress = currentSurah
    ? Math.min(100, (reader.currentVerse / currentSurah.versesCount) * 100)
    : 0;

  const today = new Date();
  const last14Days: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    last14Days.push({ date: key, count: data?.byDay?.[key] || 0 });
  }
  const maxCount = Math.max(1, ...last14Days.map((d) => d.count));
  const versesLast7Days = last14Days.slice(7).reduce((s, d) => s + d.count, 0);

  const activeGoal = data?.reader?.goals?.find((g: any) => g.status === "active");

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-primary/20">
        <div className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent">
          <CardContent className="py-5 sm:py-6">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs text-muted-foreground font-arabic mb-1">السلام عليكم ورحمة الله</p>
                <h2 className="font-quran text-2xl sm:text-3xl font-bold">
                  {reader.displayName} 🌙
                </h2>
                <p className="text-sm text-muted-foreground font-arabic mt-1">
                  {getGreeting(reader.totalVersesRead)}
                </p>
              </div>
              <Avatar className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-background shadow-md">
                <AvatarFallback
                  className="text-white text-xl font-bold"
                  style={{ backgroundColor: reader.avatarColor }}
                >
                  {reader.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <StatChip
                icon={<BookOpen className="w-4 h-4" />}
                label="آيات مقروءة"
                value={reader.totalVersesRead.toLocaleString("en")}
                sub={`من ${TOTAL_VERSES.toLocaleString("en")}`}
              />
              <StatChip
                icon={<TrendingUp className="w-4 h-4" />}
                label="نسبة الإكمال"
                value={`${progressPercent.toFixed(1)}%`}
                sub={`${(TOTAL_VERSES - reader.totalVersesRead).toLocaleString("en")} متبقية`}
              />
              <StatChip
                icon={<Flame className="w-4 h-4" />}
                label="أيام متتالية"
                value={`${reader.readingStreak}`}
                sub="يوم"
              />
              <StatChip
                icon={<Target className="w-4 h-4" />}
                label="آخر 7 أيام"
                value={`${versesLast7Days.toLocaleString("en")}`}
                sub="آية"
              />
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="font-quran text-lg flex items-center gap-2">
              <Play className="w-4 h-4 text-primary" />
              متابعة القراءة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-quran text-xl font-bold text-primary">
                    {currentSurah?.nameArabic}
                  </span>
                  <span className="text-xs text-muted-foreground font-arabic">
                    ({currentSurah?.nameTransliteration})
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-arabic mt-1">
                  توقفت عند الآية {reader.currentVerse.toLocaleString("en")} من {currentSurah?.versesCount.toLocaleString("en")}
                </p>
                <Progress value={surahProgress} className="h-1.5 mt-2" />
              </div>
              <Button
                onClick={() => onNavigate("read")}
                className="shrink-0 font-arabic"
                size="sm"
              >
                متابعة
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-3 rounded-xl border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-arabic text-sm font-medium">تقدمك في القرآن كله</span>
                <span className="text-sm font-bold text-primary font-arabic">{progressPercent.toFixed(2)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground font-arabic">
                <span>من {TOTAL_VERSES.toLocaleString("en")} آية</span>
                <span>تبقّي {(TOTAL_VERSES - reader.totalVersesRead).toLocaleString("en")} آية</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="font-quran text-lg flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              الهدف الحالي
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeGoal ? (
              <ActiveGoalCard goal={activeGoal} totalVersesRead={reader.totalVersesRead} onNavigate={onNavigate} />
            ) : (
              <div className="text-center py-6 space-y-3">
                <p className="text-sm text-muted-foreground font-arabic">
                  لم تحدد هدفًا بعد. حدّد موعدًا لختم القرآن وسنحسب لك المقدار اليومي.
                </p>
                <Button onClick={() => onNavigate("goals")} className="font-arabic" size="sm">
                  <Target className="w-4 h-4" />
                  ضع هدفًا جديدًا
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="font-quran text-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              نشاطك في آخر أسبوعين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-1 h-32">
              {last14Days.map((d, i) => {
                const heightPct = (d.count / maxCount) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 group">
                    <div className="w-full flex items-end justify-center h-full">
                      <div
                        className="w-full max-w-[24px] rounded-t-md bg-gradient-to-t from-primary/40 to-primary transition-all group-hover:from-primary/60 group-hover:to-primary"
                        style={{ height: `${Math.max(2, heightPct)}%` }}
                        title={`${d.count} آية`}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground font-arabic">
                      {i % 2 === 0 ? new Date(d.date).getDate().toLocaleString("en") : ""}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground font-arabic">
              <span>أول أسبوع</span>
              <span>هذا الأسبوع</span>
            </div>
          </CardContent>
        </Card>

        <LeaderboardPreview onNavigate={onNavigate} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickAction icon={<BookOpen className="w-5 h-5" />} label="اقرأ الآن" onClick={() => onNavigate("read")} />
        <QuickAction icon={<Bookmark className="w-5 h-5" />} label="العلامات" onClick={() => onNavigate("bookmarks")} />
        <QuickAction icon={<Trophy className="w-5 h-5" />} label="المتنافسون" onClick={() => onNavigate("leaderboard")} />
        <QuickAction icon={<Target className="w-5 h-5" />} label="الأهداف" onClick={() => onNavigate("goals")} />
      </div>
    </div>
  );
}

function getGreeting(versesRead: number): string {
  if (versesRead === 0) return "ابدأ رحلتك مع كتاب الله من الآية الأولى";
  if (versesRead < 100) return "خطوة مباركة! واصل القراءة";
  if (versesRead < 1000) return "ما شاء الله، تقدم رائع";
  if (versesRead < 3000) return "تبارك الله، أنت في طريقك للختم";
  if (versesRead < TOTAL_VERSES) return "أنت قريب من الختم، واصل!";
  return "ما شاء الله! لقد ختمت القرآن 🎉";
}

function StatChip({
  icon, label, value, sub,
}: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-card border border-border/50">
      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground font-arabic truncate">{label}</p>
        <p className="font-quran text-base font-bold leading-tight">{value}</p>
        <p className="text-[10px] text-muted-foreground font-arabic truncate">{sub}</p>
      </div>
    </div>
  );
}

function ActiveGoalCard({ goal, totalVersesRead, onNavigate }: { goal: any; totalVersesRead: number; onNavigate: (t: TabId) => void }) {
  const target = new Date(goal.targetDate);
  const daysLeft = Math.max(1, Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const versesNeeded = Math.max(1, TOTAL_VERSES - totalVersesRead);
  const onTrack = goal.versesPerDay * daysLeft >= versesNeeded;

  return (
    <div className="space-y-3">
      <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/15">
        <p className="text-xs text-muted-foreground font-arabic">المتبقي للختم</p>
        <p className="font-quran text-2xl font-bold text-primary">
          {daysLeft.toLocaleString("en")} <span className="text-sm font-normal">يوم</span>
        </p>
        <p className="text-xs text-muted-foreground font-arabic mt-1">
          الموعد: {target.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2 rounded-lg bg-muted/40">
          <p className="text-[10px] text-muted-foreground font-arabic">يوميًا مطلوب</p>
          <p className="font-quran text-lg font-bold">{Math.ceil(goal.versesPerDay).toLocaleString("en")}</p>
          <p className="text-[10px] text-muted-foreground font-arabic">آية</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/40">
          <p className="text-[10px] text-muted-foreground font-arabic">متبقّ</p>
          <p className="font-quran text-lg font-bold">{versesNeeded.toLocaleString("en")}</p>
          <p className="text-[10px] text-muted-foreground font-arabic">آية</p>
        </div>
      </div>
      <div className={`p-2 rounded-lg text-center text-xs font-arabic ${onTrack ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"}`}>
        {onTrack ? "أنت على المسار الصحيح 🌟" : "سارع قبل فوات الأوان ⏳"}
      </div>
      <Button onClick={() => onNavigate("goals")} variant="outline" size="sm" className="w-full font-arabic">
        تعديل الهدف
      </Button>
    </div>
  );
}

function LeaderboardPreview({ onNavigate }: { onNavigate: (t: TabId) => void }) {
  const reader = useReader((s) => s.reader);
  const [top, setTop] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard?limit=5")
      .then((r) => r.json())
      .then((d) => setTop(d.leaderboard || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="border-primary/10">
      <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
        <CardTitle className="font-quran text-lg flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          المتصدّرون
        </CardTitle>
        <Button variant="ghost" size="sm" className="font-arabic" onClick={() => onNavigate("leaderboard")}>
          الكل
          <ChevronLeft className="w-3 h-3" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-muted/40 animate-pulse" />)
        ) : (
          top.map((r, i) => {
            const isMe = r.id === reader?.id;
            return (
              <div
                key={r.id}
                className={`flex items-center gap-3 p-2 rounded-lg ${isMe ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/40"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  i === 0 ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" :
                  i === 1 ? "bg-slate-400/20 text-slate-600 dark:text-slate-300" :
                  i === 2 ? "bg-orange-700/20 text-orange-700 dark:text-orange-400" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {(i + 1).toLocaleString("en")}
                </div>
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: r.avatarColor }}>
                    {r.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={`font-arabic text-sm font-medium truncate ${isMe ? "text-primary" : ""}`}>
                    {r.displayName} {isMe && "(أنت)"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-arabic truncate">
                    {r.currentSurahName} — آية {r.currentVerse.toLocaleString("en")}
                  </p>
                </div>
                <span className="font-quran text-sm font-bold text-primary shrink-0">
                  {r.totalVersesRead.toLocaleString("en")}
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <span className="font-arabic text-sm font-medium">{label}</span>
    </button>
  );
}
