"use client";

import { useEffect, useState, useCallback } from "react";
import { useReader } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Trash2, BookOpen, Quote } from "lucide-react";
import { getSurah } from "@/lib/quran/surahs";
import { getVerseText } from "@/lib/quran/verses";
import { toast } from "sonner";

export function BookmarksView() {
  const reader = useReader((s) => s.reader);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!reader) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookmarks?readerId=${reader.id}`);
      const d = await res.json();
      setBookmarks(d.bookmarks || []);
    } catch {
      toast.error("فشل تحميل العلامات");
    } finally {
      setLoading(false);
    }
  }, [reader]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: number | string, surahName: string, verse: number) => {
    if (!confirm(`حذف العلامة على ${surahName} — آية ${verse}؟`)) return;
    try {
      await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      toast.success("أُزيلت العلامة");
      load();
    } catch {
      toast.error("فشل الحذف");
    }
  };

  if (!reader) return null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-quran text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-primary" />
          علاماتي
        </h2>
        <p className="text-sm text-muted-foreground font-arabic mt-1">
          الآيات التي وضعت عليها علامة لمراجعتها لاحقًا.
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Bookmark className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-arabic text-muted-foreground">
              لا توجد علامات بعد. ابدأ القراءة وعلّم الآيات المميزة.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bm) => {
            const surah = getSurah(bm.surahNumber);
            const verseText = getVerseText(bm.surahNumber, bm.verseNumber);
            return (
              <Card key={bm.id} className="border-primary/10 overflow-hidden">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Bookmark className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-quran text-lg font-bold text-primary">
                          {surah?.nameArabic}
                        </h3>
                        <Badge variant="outline" className="font-arabic text-[10px]">
                          آية {bm.verseNumber.toLocaleString("en")}
                        </Badge>
                        {bm.label && (
                          <Badge className="font-arabic text-[10px]">{bm.label}</Badge>
                        )}
                      </div>

                      {verseText?.arabic && (
                        <p className="verse-arabic text-lg leading-relaxed mb-2 line-clamp-2">
                          {verseText.arabic}
                        </p>
                      )}

                      {bm.note && (
                        <div className="flex items-start gap-1.5 text-xs font-arabic text-muted-foreground mt-2 p-2 rounded-lg bg-muted/40">
                          <Quote className="w-3 h-3 mt-0.5 shrink-0" />
                          <span>{bm.note}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 mt-3">
                        <span className="text-[10px] text-muted-foreground font-arabic">
                          {new Date(bm.createdAt).toLocaleDateString("ar-EG", {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(bm.id, surah?.nameArabic || "", bm.verseNumber)}
                          className="font-arabic text-destructive hover:text-destructive h-7"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs font-arabic text-muted-foreground flex items-start gap-2">
        <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span>
          نصيحة: استخدم العلامات للتركيز على الآيات التي تؤثر فيك وتراجعها بانتظام.
        </span>
      </div>
    </div>
  );
}
