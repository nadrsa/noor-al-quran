"use client";

import { useEffect, useState } from "react";
import { useReader } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Flame, TrendingUp, Users, Crown } from "lucide-react";
import { SURAHS, TOTAL_VERSES } from "@/lib/quran/surahs";

export function LeaderboardView() {
  const reader = useReader((s) => s.reader);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"verses" | "streak" | "recent">("verses");

  useEffect(() => {
    fetch("/api/leaderboard?limit=50")
      .then((r) => r.json())
      .then((d) => setData(d.leaderboard || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...data].sort((a, b) => {
    if (sortBy === "verses") return b.totalVersesRead - a.totalVersesRead;
    if (sortBy === "streak") return (b.readingStreak || 0) - (a.readingStreak || 0);
    // recent
    const aD = a.lastReadDate ? new Date(a.lastReadDate).getTime() : 0;
    const bD = b.lastReadDate ? new Date(b.lastReadDate).getTime() : 0;
    return bD - aD;
  });

  const myRank = sorted.findIndex((r) => r.id === reader?.id) + 1;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-quran text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          المتنافسون في الخير
        </h2>
        <p className="text-sm text-muted-foreground font-arabic mt-1">
          تنافس مع قرّاء آخرين، وتابِع تقدم أحبتك. ﴿وَفِي ذَٰلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ﴾
        </p>
      </div>

      {/* My rank card */}
      {reader && myRank > 0 && (
        <Card className="border-primary/30 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center font-quran text-lg font-bold text-primary">
                {myRank.toLocaleString("en")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-arabic">ترتيبك الحالي</p>
                <p className="font-quran text-xl font-bold">
                  {myRank === 1 ? "المتصدّر 🥇" :
                   myRank === 2 ? "وصيف المتصدّرين 🥈" :
                   myRank === 3 ? "على منصّة التتويج 🥉" :
                   `في المركز ${myRank.toLocaleString("en")}`}
                </p>
              </div>
              <div className="text-end">
                <p className="font-quran text-2xl font-bold text-primary">
                  {reader.totalVersesRead.toLocaleString("en")}
                </p>
                <p className="text-[10px] text-muted-foreground font-arabic">آية مقروءة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sort tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "verses", label: "الأكثر آيات", icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { id: "streak", label: "أطول التزامًا", icon: <Flame className="w-3.5 h-3.5" /> },
          { id: "recent", label: "الأحدث قراءة", icon: <Users className="w-3.5 h-3.5" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSortBy(t.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-arabic transition-colors ${
              sortBy === t.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Podium - top 3 */}
      {!loading && sorted.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[1, 0, 2].map((podiumIdx) => {
            const r = sorted[podiumIdx];
            if (!r) return <div key={podiumIdx} />;
            const isFirst = podiumIdx === 0;
            const heightClass = isFirst ? "sm:pt-3" : "sm:pt-6";
            const medalIcon = podiumIdx === 0 ? <Crown className="w-5 h-5 text-amber-500" /> :
              podiumIdx === 1 ? <Medal className="w-5 h-5 text-slate-400" /> :
              <Award className="w-5 h-5 text-orange-700" />;
            return (
              <div
                key={r.id}
                className={`flex flex-col items-center justify-end text-center p-3 sm:p-4 rounded-xl border ${
                  isFirst
                    ? "bg-gradient-to-b from-amber-500/15 to-amber-500/5 border-amber-500/30"
                    : podiumIdx === 1
                    ? "bg-gradient-to-b from-slate-400/15 to-slate-400/5 border-slate-400/30"
                    : "bg-gradient-to-b from-orange-700/15 to-orange-700/5 border-orange-700/30"
                } ${heightClass}`}
              >
                <div className="mb-1">{medalIcon}</div>
                <Avatar className={`w-12 h-12 sm:w-14 sm:h-14 border-2 border-background mb-2 ${isFirst ? "sm:w-16 sm:h-16" : ""}`}>
                  <AvatarFallback
                    className="text-white font-bold"
                    style={{ backgroundColor: r.avatarColor }}
                  >
                    {r.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-arabic text-sm font-semibold truncate w-full">
                  {r.displayName}
                  {r.id === reader?.id && <span className="text-primary"> (أنت)</span>}
                </p>
                <p className="font-quran text-lg sm:text-xl font-bold text-primary mt-1">
                  {r.totalVersesRead.toLocaleString("en")}
                </p>
                <p className="text-[10px] text-muted-foreground font-arabic">آية</p>
                <p className="text-[10px] text-muted-foreground font-arabic mt-1 truncate w-full">
                  {r.currentSurahName}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <Card className="border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="font-quran text-lg">القائمة الكاملة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 max-h-[600px] overflow-y-auto thin-scroll">
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-muted/40 animate-pulse" />
            ))
          ) : (
            sorted.map((r, i) => {
              const isMe = r.id === reader?.id;
              const surah = SURAHS.find((s) => s.number === r.currentSurah);
              const progressPct = (r.totalVersesRead / TOTAL_VERSES) * 100;
              return (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                    isMe
                      ? "bg-primary/10 border border-primary/30"
                      : i < 3
                      ? "bg-muted/30"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    i === 0 ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" :
                    i === 1 ? "bg-slate-400/20 text-slate-600 dark:text-slate-300" :
                    i === 2 ? "bg-orange-700/20 text-orange-700 dark:text-orange-400" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {(i + 1).toLocaleString("en")}
                  </div>
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: r.avatarColor }}>
                      {r.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`font-arabic text-sm font-medium truncate ${isMe ? "text-primary" : ""}`}>
                        {r.displayName} {isMe && "(أنت)"}
                      </p>
                      {r.isDemo && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 font-arabic">تجريبي</Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-arabic truncate">
                      {surah?.nameArabic} • آية {r.currentVerse.toLocaleString("en")} •
                      <Flame className="inline w-3 h-3 mx-0.5" />
                      {(r.readingStreak || 0).toLocaleString("en")} يوم
                    </p>
                    <div className="h-1 rounded-full bg-muted mt-1 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(100, progressPct)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="font-quran text-base font-bold text-primary">
                      {r.totalVersesRead.toLocaleString("en")}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-arabic">آية</p>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground font-arabic">
        تُحدَّث القائمة تلقائيًا. ادعُ أهلَك وأصدقاءك للتسجيل والمنافسة في الخير.
      </p>
    </div>
  );
}
