"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useReader } from "@/lib/store";
import { getSurah } from "@/lib/quran/surahs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight, ChevronLeft, Bookmark, BookmarkCheck, Check, Info,
  AlertCircle, Eye, Clock, ShieldCheck, Lock, Sparkles, Loader2, WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface VerseReaderProps {
  surahNumber: number;
  onBack: () => void;
}

const PAGE_SIZE = 5;

// Compute required reading time based on word count
function computeRequiredMs(arabic: string | null): number {
  if (!arabic) return 5000;
  const words = arabic.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(30000, Math.max(4000, 3000 + words * 800));
}

function formatTime(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface Ayah {
  numberInSurah: number;
  arabic: string;
  translation: string;
  tafsir: string;
  sajdah: boolean;
  juz: number;
  page: number;
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
  cached?: boolean;
  stale?: boolean;
}

export function VerseReader({ surahNumber, onBack }: VerseReaderProps) {
  const reader = useReader((s) => s.reader);
  const updateReader = useReader((s) => s.updateReader);

  const surahMeta = getSurah(surahNumber);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [bookmarkModalVerse, setBookmarkModalVerse] = useState<number | null>(null);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [bookmarkLabel, setBookmarkLabel] = useState("");
  const [verifiedVerses, setVerifiedVerses] = useState<Set<number>>(new Set());
  // API data state
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Fetch full surah from our proxy API
  useEffect(() => {
    let cancelled = false;
    setFetching(true);
    setFetchError(null);
    setAyahs([]);
    setVerifiedVerses(new Set());

    fetch(`/api/quran/${surahNumber}`)
      .then(async (r) => {
        if (!r.ok) {
          const e = await r.json().catch(() => ({}));
          throw new Error(e.error || `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((data: SurahData) => {
        if (cancelled) return;
        setAyahs(data.ayahs);
        setFromCache(!!data.cached);
      })
      .catch((e) => {
        if (cancelled) return;
        setFetchError(e.message || "فشل جلب السورة");
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [surahNumber]);

  // Reset page when surah changes — start from reader's current verse
  useEffect(() => {
    if (!reader || ayahs.length === 0) return;
    const startVerse = reader.currentSurah === surahNumber ? reader.currentVerse : 1;
    const startPage = Math.max(0, Math.floor((startVerse - 1) / PAGE_SIZE));
    setPage(startPage);
  }, [surahNumber, reader, ayahs.length]);

  // Load bookmarks for this surah
  useEffect(() => {
    if (!reader) return;
    fetch(`/api/bookmarks?readerId=${reader.id}`)
      .then((r) => r.json())
      .then((d) => {
        const set = new Set<number>();
        for (const b of d.bookmarks || []) {
          if (b.surahNumber === surahNumber) set.add(b.verseNumber);
        }
        setBookmarks(set);
      })
      .catch(() => {});
  }, [surahNumber, reader]);

  // Reset verified verses when page changes
  useEffect(() => {
    setVerifiedVerses(new Set());
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page, surahNumber]);

  const markRead = useCallback(async (upToVerse: number) => {
    if (!reader) return;
    setLoading(true);
    try {
      const fromVerse = reader.currentSurah === surahNumber
        ? Math.max(1, reader.currentVerse)
        : 1;
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          readerId: reader.id,
          surahNumber,
          fromVerse: Math.min(fromVerse, upToVerse),
          toVerse: upToVerse,
        }),
      });
      if (!res.ok) throw new Error("fail");
      const json = await res.json();
      updateReader({
        currentSurah: json.reader.currentSurah,
        currentVerse: json.reader.currentVerse,
        totalVersesRead: json.reader.totalVersesRead,
        readingStreak: json.reader.readingStreak,
        lastReadDate: json.reader.lastReadDate,
      });
      toast.success(`سُجّلت القراءة حتى الآية ${upToVerse} 🌟`);
    } catch {
      toast.error("فشل تسجيل التقدم");
    } finally {
      setLoading(false);
    }
  }, [reader, surahNumber, updateReader]);

  const toggleBookmark = useCallback(async (verseNumber: number) => {
    if (!reader) return;
    if (bookmarks.has(verseNumber)) {
      try {
        const res = await fetch(`/api/bookmarks?readerId=${reader.id}`);
        const d = await res.json();
        const bm = (d.bookmarks || []).find(
          (b: any) => b.surahNumber === surahNumber && b.verseNumber === verseNumber
        );
        if (bm) await fetch(`/api/bookmarks/${bm.id}`, { method: "DELETE" });
        const next = new Set(bookmarks);
        next.delete(verseNumber);
        setBookmarks(next);
        toast.success("أُزيلت العلامة");
      } catch {
        toast.error("فشل حذف العلامة");
      }
    } else {
      setBookmarkModalVerse(verseNumber);
      setBookmarkNote("");
      setBookmarkLabel("");
    }
  }, [reader, surahNumber, bookmarks]);

  const handleVerseVerified = useCallback((verseNumber: number) => {
    setVerifiedVerses((prev) => {
      if (prev.has(verseNumber)) return prev;
      const next = new Set(prev);
      next.add(verseNumber);
      return next;
    });
  }, []);

  if (!surahMeta) return null;

  const versesCount = surahMeta.versesCount;
  const startVerse = page * PAGE_SIZE + 1;
  const endVerse = Math.min(versesCount, (page + 1) * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(versesCount / PAGE_SIZE));

  const pageVerseNumbers = Array.from({ length: endVerse - startVerse + 1 }, (_, i) => startVerse + i);
  const allVerified = pageVerseNumbers.every((v) => verifiedVerses.has(v));
  const verifiedCount = pageVerseNumbers.filter((v) => verifiedVerses.has(v)).length;

  const saveBookmark = async () => {
    if (!reader || bookmarkModalVerse === null) return;
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          readerId: reader.id,
          surahNumber,
          verseNumber: bookmarkModalVerse,
          note: bookmarkNote,
          label: bookmarkLabel,
        }),
      });
      if (!res.ok) throw new Error("fail");
      const next = new Set(bookmarks);
      next.add(bookmarkModalVerse);
      setBookmarks(next);
      setBookmarkModalVerse(null);
      toast.success("تم حفظ العلامة 🔖");
    } catch {
      toast.error("فشل حفظ العلامة");
    }
  };

  const overallProgress = reader && reader.currentSurah === surahNumber
    ? Math.min(100, (reader.currentVerse / versesCount) * 100)
    : reader && reader.currentSurah > surahNumber
    ? 100
    : 0;

  return (
    <div className="space-y-4" ref={topRef}>
      {/* Surah header */}
      <Card className="border-primary/20 overflow-hidden">
        <div className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent">
          <CardContent className="py-5">
            <div className="flex items-start justify-between gap-3">
              <Button variant="ghost" size="sm" onClick={onBack} className="font-arabic -ms-2">
                <ChevronRight className="w-4 h-4" />
                كل السور
              </Button>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 mb-2 font-quran text-lg font-bold text-primary">
                  {surahMeta.number}
                </div>
                <h2 className="font-quran text-3xl font-bold text-primary">
                  {surahMeta.nameArabic}
                </h2>
                <p className="text-xs text-muted-foreground font-arabic mt-1">
                  {surahMeta.nameTransliteration} — {surahMeta.nameEnglish}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground font-arabic">
                  <span>{surahMeta.revelationType === "Meccan" ? "مكية" : "مدنية"}</span>
                  <span>•</span>
                  <span>{surahMeta.versesCount} آية</span>
                </div>
              </div>
              <div className="w-16" />
            </div>

            {surahNumber !== 9 && !fetching && (
              <div className="bismillah mt-3 text-primary/80">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
            )}

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-arabic mb-1">
                <span>تقدمك في هذه السورة</span>
                <span>{overallProgress.toFixed(1)}%</span>
              </div>
              <Progress value={overallProgress} className="h-1.5" />
            </div>

            {/* Cache indicator */}
            {!fetching && !fetchError && fromCache && (
              <div className="mt-2 text-[10px] text-muted-foreground/70 font-arabic text-center flex items-center justify-center gap-1">
                <Check className="w-3 h-3" />
                البيانات من الذاكرة المؤقتة (تحميل سريع)
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Loading state */}
      {fetching && (
        <Card className="border-primary/20">
          <CardContent className="py-12 text-center">
            <Loader2 className="w-10 h-10 mx-auto mb-3 text-primary animate-spin" />
            <p className="font-arabic text-sm text-muted-foreground">
              جارٍ جلب سورة {surahMeta.nameArabic} من مصدر القرآن…
            </p>
            <p className="font-arabic text-xs text-muted-foreground/70 mt-1">
              يتم تخزينها محليًا لتسريع القراءة التالية
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {fetchError && !fetching && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-8 text-center">
            <WifiOff className="w-10 h-10 mx-auto mb-3 text-destructive" />
            <p className="font-arabic text-sm font-semibold text-destructive mb-1">
              تعذّر جلب السورة
            </p>
            <p className="font-arabic text-xs text-muted-foreground mb-4">
              {fetchError}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="font-arabic"
              onClick={() => {
                setFetching(true);
                setFetchError(null);
                fetch(`/api/quran/${surahNumber}`)
                  .then(async (r) => {
                    if (!r.ok) throw new Error(`HTTP ${r.status}`);
                    return r.json();
                  })
                  .then((data: SurahData) => {
                    setAyahs(data.ayahs);
                    setFromCache(!!data.cached);
                  })
                  .catch((e) => setFetchError(e.message))
                  .finally(() => setFetching(false));
              }}
            >
              <Loader2 className="w-4 h-4" />
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Strict monitoring notice — only after data loaded */}
      {!fetching && !fetchError && (
        <>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-arabic flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-amber-800 dark:text-amber-300">
              <span className="font-semibold">نظام مراقبة القراءة: </span>
              يجب قراءة كل آية فعليًا قبل أن يتمكن النظام من تسجيلها. شريط التقدّم بجانب كل آية يُظهر الوقت المتبقي. لا يمكن تسجيل الصفحة إلا بعد اكتمال جميع الآيات.
            </div>
          </div>

          {/* Page verification status */}
          <Card className={`border-2 transition-colors ${allVerified ? "border-emerald-500/40 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
            <CardContent className="py-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {allVerified ? (
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-pulse" />
                  )}
                  <div>
                    <p className={`font-arabic text-sm font-bold ${allVerified ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
                      {allVerified ? "تم التحقق من جميع آيات هذه الصفحة" : "بانتظار اكتمال قراءة الآيات"}
                    </p>
                    <p className="text-xs text-muted-foreground font-arabic">
                      {verifiedCount} من {pageVerseNumbers.length} آيات تم التحقق منها
                    </p>
                  </div>
                </div>
                <div className="flex-1 min-w-[120px] max-w-[200px]">
                  <Progress
                    value={(verifiedCount / pageVerseNumbers.length) * 100}
                    className={`h-2 ${allVerified ? "" : "[&>div]:bg-amber-500"}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verses */}
          <div className="space-y-3">
            {pageVerseNumbers.map((vNum) => {
              const ayah = ayahs[vNum - 1]; // ayahs array is 0-indexed
              const isRead = reader
                ? (reader.currentSurah > surahNumber) ||
                  (reader.currentSurah === surahNumber && reader.currentVerse >= vNum)
                : false;
              const isBookmarked = bookmarks.has(vNum);
              const isVerified = verifiedVerses.has(vNum);
              const isExpanded = selectedVerse === vNum;

              return (
                <VerifiedVerse
                  key={vNum}
                  verseNumber={vNum}
                  arabic={ayah?.arabic || null}
                  translation={ayah?.translation || null}
                  tafsir={ayah?.tafsir || null}
                  sajdah={ayah?.sajdah || false}
                  isRead={isRead}
                  isBookmarked={isBookmarked}
                  isVerified={isVerified}
                  isExpanded={isExpanded}
                  onVerified={() => handleVerseVerified(vNum)}
                  onToggleBookmark={() => toggleBookmark(vNum)}
                  onToggleTafsir={() => setSelectedVerse(isExpanded ? null : vNum)}
                />
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border/50">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="font-arabic"
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </Button>

            <div className="text-center text-xs font-arabic">
              <p className="text-muted-foreground">
                صفحة {page + 1} من {totalPages}
              </p>
              <p className="text-muted-foreground/70">
                الآيات {startVerse}—{endVerse}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="font-arabic"
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* Submit page button */}
          <div className="space-y-2">
            <Button
              variant={allVerified ? "default" : "secondary"}
              disabled={!allVerified || loading}
              onClick={() => markRead(endVerse)}
              className="w-full font-arabic h-12 text-base"
              size="lg"
            >
              {loading ? (
                "جارٍ التسجيل…"
              ) : allVerified ? (
                <>
                  <Check className="w-5 h-5" />
                  سجّل قراءة هذه الصفحة (حتى الآية {endVerse})
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  أكمل قراءة جميع الآيات أولاً ({verifiedCount}/{pageVerseNumbers.length})
                </>
              )}
            </Button>
            {!allVerified && (
              <p className="text-center text-xs text-amber-700 dark:text-amber-500 font-arabic">
                سيُفعّل الزر تلقائيًا عند اكتمال شريط التحقق لجميع الآيات
              </p>
            )}
          </div>
        </>
      )}

      {/* Bookmark modal */}
      <Dialog open={bookmarkModalVerse !== null} onOpenChange={(o) => !o && setBookmarkModalVerse(null)}>
        <DialogContent className="font-arabic">
          <DialogHeader>
            <DialogTitle className="font-quran text-xl text-center">
              علامة على الآية {bookmarkModalVerse}
            </DialogTitle>
            <DialogDescription className="text-center">
              أضف ملاحظة أو عنوانًا للعلامة (اختياري)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="bm-label" className="text-sm">عنوان مختصر</Label>
              <Input
                id="bm-label"
                value={bookmarkLabel}
                onChange={(e) => setBookmarkLabel(e.target.value)}
                placeholder="مثال: آية الرحمة"
                className="font-arabic"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bm-note" className="text-sm">ملاحظة</Label>
              <Textarea
                id="bm-note"
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                placeholder="ما الذي لفت انتباهك في هذه الآية؟"
                className="font-arabic min-h-[80px]"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 font-arabic" onClick={() => setBookmarkModalVerse(null)}>
              إلغاء
            </Button>
            <Button className="flex-1 font-arabic" onClick={saveBookmark}>
              حفظ العلامة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============ VerifiedVerse ============

interface VerifiedVerseProps {
  verseNumber: number;
  arabic: string | null;
  translation: string | null;
  tafsir: string | null;
  sajdah: boolean;
  isRead: boolean;
  isBookmarked: boolean;
  isVerified: boolean;
  isExpanded: boolean;
  onVerified: () => void;
  onToggleBookmark: () => void;
  onToggleTafsir: () => void;
}

function VerifiedVerse({
  verseNumber,
  arabic,
  translation,
  tafsir,
  sajdah,
  isRead,
  isBookmarked,
  isVerified,
  isExpanded,
  onVerified,
  onToggleBookmark,
  onToggleTafsir,
}: VerifiedVerseProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [visible, setVisible] = useState(false);
  const requiredMs = useMemo(() => computeRequiredMs(arabic), [arabic]);

  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setVisible(entry.isIntersecting && entry.intersectionRatio > 0.4);
        }
      },
      { threshold: [0.4, 0.6, 1.0] }
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVerified) return;
    if (!visible) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 100;
        if (next >= requiredMs) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onVerified();
          return requiredMs;
        }
        return next;
      });
    }, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, isVerified, requiredMs, onVerified]);

  const progressPct = Math.min(100, (elapsed / requiredMs) * 100);
  const remainingMs = Math.max(0, requiredMs - elapsed);

  return (
    <Card
      ref={cardRef}
      className={`overflow-hidden transition-all border-2 ${
        isVerified
          ? "border-emerald-500/40 bg-emerald-500/[0.03]"
          : visible
          ? "border-primary/30 bg-card"
          : "border-border"
      }`}
    >
      <CardContent className="py-4 sm:py-5">
        <div className="flex items-start gap-3">
          <div className="shrink-0 pt-1">
            <div className="verse-number-circle">{verseNumber}</div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Arabic verse text */}
            <p
              className="verse-arabic leading-loose mb-2 cursor-pointer select-text"
              onClick={onToggleTafsir}
            >
              {arabic || (
                <span className="text-muted-foreground/60 font-arabic text-base">
                  ﴿ نص الآية {verseNumber} ﴾
                </span>
              )}
            </p>

            {/* Sajdah indicator */}
            {sajdah && (
              <div className="mb-2 inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 font-arabic px-2 py-0.5 rounded-md bg-amber-500/10">
                <Sparkles className="w-3 h-3" />
                آية سجدة
              </div>
            )}

            {/* Verification status bar */}
            <div className="mb-3 p-2 rounded-lg bg-muted/40 border border-border/40">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-arabic">
                  {isVerified ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        تم التحقق من القراءة
                      </span>
                    </>
                  ) : visible ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-primary animate-pulse" />
                      <span className="text-primary font-semibold">
                        جارٍ القراءة… تبقى {formatTime(remainingMs)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        مرّر لتقرأ هذه الآية ({formatTime(requiredMs)} مطلوبة)
                      </span>
                    </>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground font-arabic">
                  {Math.round(progressPct)}%
                </span>
              </div>
              <Progress
                value={progressPct}
                className={`h-1.5 ${
                  isVerified ? "[&>div]:bg-emerald-500" : "[&>div]:bg-primary"
                }`}
              />
            </div>

            {/* Action row */}
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/50">
              {isRead && (
                <span className="inline-flex items-center gap-1 text-xs font-arabic text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md bg-emerald-500/10">
                  <Check className="w-3.5 h-3.5" />
                  مقروءة سابقًا
                </span>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleBookmark}
                className="font-arabic h-8"
                disabled={!isVerified && !isBookmarked}
                title={!isVerified && !isBookmarked ? "اقرأ الآية أولًا" : ""}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-primary" />
                    <span className="text-primary">معلّمة</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>علّم الآية</span>
                  </>
                )}
              </Button>

              {translation && tafsir && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleTafsir}
                  className="font-arabic h-8"
                  disabled={!isVerified}
                  title={!isVerified ? "اقرأ الآية أولًا لعرض التفسير" : ""}
                >
                  <Info className="w-3.5 h-3.5" />
                  التفسير
                </Button>
              )}

              {!isVerified && (
                <span className="text-[10px] text-amber-700 dark:text-amber-500 font-arabic mr-auto flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  مُقفل حتى تُقرأ
                </span>
              )}
            </div>

            {/* Inline tafsir expansion */}
            {isExpanded && isVerified && translation && tafsir && (
              <div className="mt-3 p-3 rounded-lg bg-muted/40 border border-border/50 animate-fade-in">
                <p className="text-xs text-muted-foreground font-arabic mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  المعنى (Sahih International)
                </p>
                <p className="text-sm font-arabic leading-relaxed mb-3">{translation}</p>
                <p className="text-xs text-muted-foreground font-arabic mb-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  التفسير الميسّر
                </p>
                <p className="text-sm font-arabic leading-relaxed">{tafsir}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
