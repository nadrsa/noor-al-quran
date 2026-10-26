"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Quote, Sparkles, ChevronDown, ChevronUp, BookMarked } from "lucide-react";
import { HADITHS, HADITH_CATEGORIES, HADITHS_BY_CATEGORY, TOTAL_HADITHS } from "@/lib/quran/hadiths";

export function HadithsView() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredHadiths = useMemo(() => {
    if (activeCategory === "all") return HADITHS;
    return HADITHS_BY_CATEGORY[activeCategory] || [];
  }, [activeCategory]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="font-quran text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-primary" />
          أحاديث فضل القرآن
        </h2>
        <p className="text-sm text-muted-foreground font-arabic mt-1">
          {TOTAL_HADITHS} حديث صحيح من الكتب الستة ومسند أحمد، مرتبة حسب الموضوع.
        </p>
      </div>

      {/* Stats banner */}
      <Card className="border-primary/20 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-quran text-base font-bold text-primary mb-1">
                ﴿أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ ۚ وَلَوْ كَانَ مِنْ عِندِ غَيْرِ اللَّهِ لَوَجَدُوا فِيهِ اخْتِلَافًا كَثِيرًا﴾
              </p>
              <p className="text-xs text-muted-foreground font-arabic">
                هذه الأحاديث تُحفّز على المداومة وتُبيّن عظمة أجر قارئ القرآن في الدنيا والآخرة.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category filters */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-arabic">تصفية حسب الموضوع:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-arabic transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            الكل ({TOTAL_HADITHS})
          </button>
          {HADITH_CATEGORIES.map((cat) => {
            const count = (HADITHS_BY_CATEGORY[cat.id] || []).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-arabic transition-colors ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.title} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Active category description */}
      {activeCategory !== "all" && (
        <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs font-arabic text-muted-foreground">
          {(() => {
            const cat = HADITH_CATEGORIES.find((c) => c.id === activeCategory);
            return cat ? `${cat.icon} ${cat.description}` : "";
          })()}
        </div>
      )}

      {/* Hadiths list */}
      <div className="space-y-3">
        {filteredHadiths.map((h, idx) => {
          const isExpanded = expandedId === h.id;
          const category = HADITH_CATEGORIES.find((c) => c.id === h.category);
          return (
            <Card
              key={h.id}
              className={`border-primary/10 overflow-hidden transition-all ${
                isExpanded ? "border-primary/30 shadow-md" : ""
              }`}
            >
              <CardContent className="py-4">
                {/* Number + category badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-quran text-sm font-bold">
                      {(idx + 1).toLocaleString("en")}
                    </div>
                    {category && (
                      <Badge variant="outline" className="font-arabic text-[10px] gap-1">
                        <span>{category.icon}</span>
                        {category.title}
                      </Badge>
                    )}
                  </div>
                  <Badge
                    className={`font-arabic text-[10px] ${
                      h.grade.includes("متفق") ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" :
                      h.grade === "صحيح" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" :
                      "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                    }`}
                    variant="outline"
                  >
                    {h.grade}
                  </Badge>
                </div>

                {/* Arabic hadith */}
                <div className="relative">
                  <Quote className="absolute -top-1 right-0 w-6 h-6 text-primary/15" />
                  <p className="font-quran text-lg leading-loose pr-8 cursor-pointer select-text" onClick={() => setExpandedId(isExpanded ? null : h.id)}>
                    «{h.arabic}»
                  </p>
                </div>

                {/* Narrator + source */}
                <div className="flex items-center gap-2 flex-wrap mt-3 text-[10px] text-muted-foreground font-arabic">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/50">
                    <span className="font-semibold">الراوي:</span> {h.narrator}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/50">
                    <span className="font-semibold">المصدر:</span> {h.source} — {h.reference}
                  </span>
                </div>

                {/* Expand button */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : h.id)}
                  className="mt-3 flex items-center gap-1 text-xs text-primary font-arabic hover:underline"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      طي
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      الترجمة والفائدة
                    </>
                  )}
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-3 space-y-3 animate-fade-in">
                    <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                      <p className="text-xs text-muted-foreground font-arabic mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        الترجمة الإنجليزية
                      </p>
                      <p className="text-sm leading-relaxed font-arabic">{h.translation}</p>
                    </div>
                    {h.benefit && (
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                        <p className="text-xs text-primary font-arabic mb-1 flex items-center gap-1 font-semibold">
                          <Sparkles className="w-3 h-3" />
                          الفائدة والعبرة
                        </p>
                        <p className="text-sm font-arabic leading-relaxed text-foreground">{h.benefit}</p>
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground/70 font-arabic">
                      المصدر الإنجليزي: {h.sourceEn} — الراوي: {h.narratorEn}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer note */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="py-3">
          <p className="text-xs font-arabic text-amber-800 dark:text-amber-300 leading-relaxed">
            <span className="font-semibold">تنبيه:</span> هذه الأحاديث مُخرّجة من الكتب الستة (البخاري ومسلم وأبي داود والترمذي والنسائي وابن ماجه) ومسند أحمد. كلها صحيحة أو حسنة. للأصل والسند راجع المصدر المذكور تحت كل حديث.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
