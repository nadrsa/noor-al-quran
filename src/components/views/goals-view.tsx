"use client";

import { useEffect, useState } from "react";
import { useReader } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, TrendingUp, CheckCircle2, Clock, Zap, AlertCircle } from "lucide-react";
import { SURAHS, TOTAL_VERSES, toAbsoluteVerse } from "@/lib/quran/surahs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function GoalsView() {
  const reader = useReader((s) => s.reader);
  const updateReader = useReader((s) => s.updateReader);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    if (!reader) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/goals?readerId=${reader.id}`);
      const d = await res.json();
      setGoals(d.goals || []);
      // Auto-show form if no active goal
      if (!(d.goals || []).some((g: any) => g.status === "active")) {
        setShowForm(true);
      }
    } catch {
      toast.error("فشل تحميل الأهداف");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [reader]);

  if (!reader) return null;

  const activeGoal = goals.find((g) => g.status === "active");
  const versesRemaining = Math.max(0, TOTAL_VERSES - reader.totalVersesRead);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-quran text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            أهداف الختم
          </h2>
          <p className="text-sm text-muted-foreground font-arabic mt-1">
            حدّد موعدًا لختم القرآن، وسنحسب لك المقدار اليومي المطلوب.
          </p>
        </div>
        {activeGoal && (
          <Button onClick={() => setShowForm(!showForm)} variant="outline" className="font-arabic" size="sm">
            {showForm ? "إخفاء النموذج" : "هدف جديد"}
          </Button>
        )}
      </div>

      {/* Active goal banner */}
      {activeGoal && !showForm && (
        <ActiveGoalBanner goal={activeGoal} reader={reader} />
      )}

      {/* Goal form */}
      {showForm && (
        <GoalForm
          readerId={reader.id}
          onCreated={() => {
            setShowForm(false);
            load();
            // Refresh reader to get updated goal linkage
            fetch(`/api/readers/${reader.id}`).then(r => r.json()).then(json => {
              updateReader({
                currentSurah: json.reader.currentSurah,
                currentVerse: json.reader.currentVerse,
                totalVersesRead: json.reader.totalVersesRead,
                readingStreak: json.reader.readingStreak,
                lastReadDate: json.reader.lastReadDate,
              });
            });
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Quick calculator (no save) */}
      <QuickCalculator versesRemaining={versesRemaining} />

      {/* Past goals */}
      {goals.filter((g) => g.status !== "active").length > 0 && (
        <Card className="border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="font-quran text-lg">الأهداف السابقة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {goals.filter((g) => g.status !== "active").map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 border border-border/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    g.status === "completed" ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"
                  }`}>
                    {g.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-arabic text-sm font-medium truncate">
                      الهدف حتى {new Date(g.targetDate).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                    <p className="text-xs text-muted-foreground font-arabic">
                      {Math.ceil(g.versesPerDay).toLocaleString("en")} آية/يومًا
                    </p>
                  </div>
                </div>
                <Badge variant={g.status === "completed" ? "default" : "secondary"} className="font-arabic">
                  {g.status === "completed" ? "مكتمل" : "متروك"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ActiveGoalBanner({ goal, reader }: { goal: any; reader: any }) {
  const target = new Date(goal.targetDate);
  const daysLeft = Math.max(0, Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const versesRemaining = Math.max(0, TOTAL_VERSES - reader.totalVersesRead);
  const versesPerDayNeeded = daysLeft > 0 ? Math.ceil(versesRemaining / daysLeft) : versesRemaining;
  const goalVersesPerDay = goal.versesPerDay;
  const onTrack = reader.totalVersesRead >= (toAbsoluteVerse(goal.startSurah, goal.startVerse) + (Math.ceil((Date.now() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24))) * goalVersesPerDay * 0.7);

  // Estimate today's reading requirement based on remaining
  const versesToday = Math.max(0, versesPerDayNeeded);

  return (
    <Card className="border-primary/20 overflow-hidden">
      <div className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent">
        <CardContent className="py-5 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground font-arabic">الهدف الحالي</span>
              </div>
              <h3 className="font-quran text-2xl font-bold">
                ختم القرآن خلال {daysLeft.toLocaleString("en")} يوم
              </h3>
              <p className="text-sm text-muted-foreground font-arabic mt-1">
                الموعد: {target.toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className={`px-3 py-2 rounded-xl text-center ${onTrack ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
              <p className={`text-xs font-arabic ${onTrack ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
                {onTrack ? "على المسار 🌟" : "تحتاج تسريع ⏳"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <GoalStat
              icon={<Calendar className="w-4 h-4" />}
              label="الأيام المتبقية"
              value={daysLeft.toLocaleString("en")}
              unit="يوم"
            />
            <GoalStat
              icon={<TrendingUp className="w-4 h-4" />}
              label="الآيات المتبقية"
              value={versesRemaining.toLocaleString("en")}
              unit="آية"
            />
            <GoalStat
              icon={<Zap className="w-4 h-4" />}
              label="يوميًا مطلوب منك"
              value={versesToday.toLocaleString("en")}
              unit="آية"
              highlight
            />
            <GoalStat
              icon={<Target className="w-4 h-4" />}
              label="الهدف الأصلي"
              value={Math.ceil(goalVersesPerDay).toLocaleString("en")}
              unit="آية/يوم"
            />
          </div>

          <div className="p-3 rounded-xl bg-card/50 border border-border/50">
            <div className="flex items-center justify-between text-xs font-arabic mb-1">
              <span className="text-muted-foreground">تقدمك نحو الهدف</span>
              <span className="font-bold text-primary">
                {((reader.totalVersesRead / TOTAL_VERSES) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={(reader.totalVersesRead / TOTAL_VERSES) * 100} className="h-2" />
          </div>

          {/* Recommendation */}
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/15">
            <p className="text-sm font-arabic">
              <span className="font-bold text-primary">توصية اليوم: </span>
              اقرأ <span className="font-bold">{versesToday.toLocaleString("en")}</span> آية تقريبًا — أي ما يعادل
              <span className="font-bold"> {estimateReadingTime(versesToday)} دقيقة </span>
              من القراءة المركّزة.
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function estimateReadingTime(verses: number): string {
  // average ~30 seconds per verse for proper reading with tarteel
  const minutes = Math.max(1, Math.round(verses * 0.5));
  if (minutes < 60) return minutes.toLocaleString("en");
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toLocaleString("en")} ساعة و${m.toLocaleString("en")} دقيقة`;
}

function GoalStat({ icon, label, value, unit, highlight }: {
  icon: React.ReactNode; label: string; value: string; unit: string; highlight?: boolean;
}) {
  return (
    <div className={`p-2.5 rounded-lg border ${highlight ? "bg-primary/10 border-primary/30" : "bg-card/50 border-border/50"}`}>
      <div className={`flex items-center gap-1.5 mb-1 ${highlight ? "text-primary" : "text-muted-foreground"}`}>
        {icon}
        <span className="text-[10px] font-arabic">{label}</span>
      </div>
      <p className={`font-quran text-lg font-bold ${highlight ? "text-primary" : ""}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground font-arabic">{unit}</p>
    </div>
  );
}

function GoalForm({ readerId, onCreated, onCancel }: {
  readerId: string; onCreated: () => void; onCancel: () => void;
}) {
  const [months, setMonths] = useState("3");
  const [customDate, setCustomDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [startSurah, setStartSurah] = useState("1");
  const [startVerse, setStartVerse] = useState("0");
  const [endSurah, setEndSurah] = useState("114");
  const [endVerse, setEndVerse] = useState("6");

  // Calculate live preview
  const targetDate = customDate
    ? new Date(customDate)
    : new Date(Date.now() + parseInt(months) * 30 * 24 * 60 * 60 * 1000);

  const versesNeeded = Math.max(1, toAbsoluteVerse(parseInt(endSurah), parseInt(endVerse)) - toAbsoluteVerse(parseInt(startSurah), parseInt(startVerse)));
  const daysRemaining = Math.max(1, Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const versesPerDay = Math.ceil(versesNeeded / daysRemaining);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          readerId,
          targetDate: targetDate.toISOString(),
          startSurah: parseInt(startSurah),
          startVerse: parseInt(startVerse),
          endSurah: parseInt(endSurah),
          endVerse: parseInt(endVerse),
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "fail");
      }
      toast.success("تم إنشاء الهدف بنجاح 🎯");
      onCreated();
    } catch (e: any) {
      toast.error(e.message || "فشل إنشاء الهدف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="font-quran text-lg flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          {months === "" && !customDate ? "هدف جديد" : "حدّد هدفك"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick presets */}
        <div className="space-y-2">
          <Label className="font-arabic text-sm">اختر مدة سريعة:</Label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { m: "1", label: "شهر" },
              { m: "3", label: "3 أشهر" },
              { m: "6", label: "6 أشهر" },
              { m: "12", label: "سنة" },
            ].map((p) => (
              <button
                key={p.m}
                onClick={() => { setMonths(p.m); setCustomDate(""); }}
                className={`p-2.5 rounded-lg text-xs font-arabic border transition-colors ${
                  months === p.m && !customDate
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:bg-muted border-border"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom date */}
        <div className="space-y-1.5">
          <Label htmlFor="custom-date" className="font-arabic text-sm">أو تاريخ محدد:</Label>
          <Input
            id="custom-date"
            type="date"
            value={customDate}
            onChange={(e) => {
              setCustomDate(e.target.value);
              setMonths("");
            }}
            min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}
            className="font-arabic"
          />
        </div>

        {/* Range */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="font-arabic text-sm">من سورة:</Label>
            <Select value={startSurah} onValueChange={(v) => setStartSurah(v)}>
              <SelectTrigger className="font-arabic">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {SURAHS.map((s) => (
                  <SelectItem key={s.number} value={String(s.number)} className="font-arabic">
                    {s.number.toLocaleString("en")}. {s.nameArabic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="font-arabic text-sm">إلى سورة:</Label>
            <Select value={endSurah} onValueChange={(v) => setEndSurah(v)}>
              <SelectTrigger className="font-arabic">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {SURAHS.map((s) => (
                  <SelectItem key={s.number} value={String(s.number)} className="font-arabic">
                    {s.number.toLocaleString("en")}. {s.nameArabic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preview */}
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 space-y-2">
          <p className="text-xs font-arabic text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            ملخّص الهدف
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="font-quran text-xl font-bold text-primary">{versesNeeded.toLocaleString("en")}</p>
              <p className="text-[10px] text-muted-foreground font-arabic">آية للختم</p>
            </div>
            <div>
              <p className="font-quran text-xl font-bold text-primary">{daysRemaining.toLocaleString("en")}</p>
              <p className="text-[10px] text-muted-foreground font-arabic">يوم متبقٍ</p>
            </div>
            <div>
              <p className="font-quran text-xl font-bold text-primary">{versesPerDay.toLocaleString("en")}</p>
              <p className="text-[10px] text-muted-foreground font-arabic">آية/يومًا</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground font-arabic">
            <AlertCircle className="w-3 h-3" />
            زمن القراءة اليومي التقريبي: {estimateReadingTime(versesPerDay)}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 font-arabic" onClick={onCancel}>
            إلغاء
          </Button>
          <Button
            className="flex-1 font-arabic"
            disabled={loading || (!months && !customDate)}
            onClick={submit}
          >
            {loading ? "جارٍ الحفظ…" : "تفعيل الهدف"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickCalculator({ versesRemaining }: { versesRemaining: number }) {
  const [versesPerDay, setVersesPerDay] = useState(20);
  const days = Math.ceil(versesRemaining / versesPerDay);
  const months = (days / 30).toFixed(1);
  const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  return (
    <Card className="border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="font-quran text-lg flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          حاسبة سريعة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground font-arabic">
          كم آية تريد قراءتها يوميًا؟ جرّب وستري متى تختم.
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-arabic text-sm">الآيات يوميًا</Label>
            <span className="font-quran text-lg font-bold text-primary">
              {versesPerDay.toLocaleString("en")}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={200}
            value={versesPerDay}
            onChange={(e) => setVersesPerDay(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-arabic">
            <span>1 آية</span>
            <span>50</span>
            <span>100</span>
            <span>200</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-lg bg-muted/40">
            <p className="font-quran text-2xl font-bold text-primary">{days.toLocaleString("en")}</p>
            <p className="text-[10px] text-muted-foreground font-arabic">يوم للختم</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/40">
            <p className="font-quran text-2xl font-bold text-primary">{months}</p>
            <p className="text-[10px] text-muted-foreground font-arabic">شهر تقريبًا</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/40">
            <p className="font-quran text-base font-bold text-primary leading-tight">
              {endDate.toLocaleDateString("ar-EG", { month: "short", day: "numeric" })}
            </p>
            <p className="text-[10px] text-muted-foreground font-arabic">تاريخ الختم</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
