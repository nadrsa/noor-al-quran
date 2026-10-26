"use client";

import { useEffect, useState, useMemo } from "react";
import { useReader } from "@/lib/store";
import { SURAHS, TOTAL_VERSES, getSurah } from "@/lib/quran/surahs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Search, MapPin, BookOpen } from "lucide-react";
import { VerseReader } from "@/components/quran/verse-reader";
import { toast } from "sonner";

export function ReadView() {
  const reader = useReader((s) => s.reader);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Meccan" | "Medinan" | "inProgress">("all");

  // Default to current surah when opened
  useEffect(() => {
    if (reader && selectedSurah === null) {
      // Stay on surah list by default — user clicks to enter
    }
  }, [reader, selectedSurah]);

  const filteredSurahs = useMemo(() => {
    return SURAHS.filter((s) => {
      if (search) {
        const q = search.toLowerCase().trim();
        const inName =
          s.nameArabic.includes(search) ||
          s.nameTransliteration.toLowerCase().includes(q) ||
          s.nameEnglish.toLowerCase().includes(q) ||
          String(s.number).includes(search);
        if (!inName) return false;
      }
      if (filter === "Meccan" && s.revelationType !== "Meccan") return false;
      if (filter === "Medinan" && s.revelationType !== "Medinan") return false;
      if (filter === "inProgress" && reader) {
        const absCurrent = (reader.currentSurah === s.number);
        if (!absCurrent) return false;
      }
      return true;
    });
  }, [search, filter, reader]);

  if (selectedSurah !== null) {
    return (
      <VerseReader
        surahNumber={selectedSurah}
        onBack={() => setSelectedSurah(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-quran text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            السور
          </h2>
          <p className="text-sm text-muted-foreground font-arabic mt-1">
            اختر سورة للبدء. تقدمك يُحفظ تلقائيًا.
          </p>
        </div>
        {reader && reader.currentSurah > 1 || (reader && reader.currentVerse > 0) ? (
          <Button
            onClick={() => setSelectedSurah(reader.currentSurah)}
            className="font-arabic"
            size="sm"
          >
            <MapPin className="w-4 h-4" />
            متابعة من {getSurah(reader.currentSurah)?.nameArabic}
          </Button>
        ) : null}
      </div>

      {/* Search and filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم السورة أو رقمها…"
            className="pr-10 font-arabic h-11"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "الكل" },
            { id: "Meccan", label: "مكية" },
            { id: "Medinan", label: "مدنية" },
            { id: "inProgress", label: "الحالية" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-arabic transition-colors ${
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats banner */}
      <Card className="border-primary/10 bg-primary/5">
        <CardContent className="py-3">
          <div className="flex items-center justify-between text-sm font-arabic">
            <span className="text-muted-foreground">عدد السور:</span>
            <span className="font-bold">{filteredSurahs.length.toLocaleString("en")}</span>
            <span className="text-muted-foreground">من أصل 114</span>
          </div>
        </CardContent>
      </Card>

      {/* Surah grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSurahs.map((s) => {
          const isCurrent = reader?.currentSurah === s.number;
          const isRead = reader ? reader.currentSurah > s.number : false;
          const surahProgress = isCurrent && reader
            ? Math.min(100, (reader.currentVerse / s.versesCount) * 100)
            : isRead ? 100 : 0;

          return (
            <button
              key={s.number}
              onClick={() => setSelectedSurah(s.number)}
              className="text-start p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md transition-all group relative overflow-hidden"
            >
              {/* Surah number decorative */}
              <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-quran text-sm font-bold text-primary">
                {s.number.toLocaleString("en")}
              </div>

              <div className="ps-0 pe-12">
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="font-quran text-xl font-bold group-hover:text-primary transition-colors">
                    {s.nameArabic}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground font-arabic">
                  {s.nameTransliteration} — {s.nameEnglish}
                </p>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="outline" className="text-[10px] font-arabic px-1.5 py-0">
                    {s.revelationType === "Meccan" ? "مكية" : "مدنية"}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-arabic">
                    {s.versesCount.toLocaleString("en")} آية
                  </span>
                </div>

                {surahProgress > 0 && (
                  <div className="mt-2.5">
                    <Progress value={surahProgress} className="h-1" />
                    <p className="text-[10px] text-muted-foreground font-arabic mt-1">
                      {isRead ? "✓ مكتملة" : `الآية ${reader?.currentVerse.toLocaleString("en")} من ${s.versesCount.toLocaleString("en")}`}
                    </p>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground font-arabic">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>لا توجد سور مطابقة</p>
        </div>
      )}
    </div>
  );
}
