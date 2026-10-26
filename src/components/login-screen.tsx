"use client";

import { useState, useEffect } from "react";
import { useReader } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Moon, Sun, Users, Target, TrendingUp, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

const AVATAR_COLORS = [
  "#0d9488", "#7c3aed", "#db2777", "#ea580c",
  "#0891b2", "#16a34a", "#9333ea", "#0284c7",
];

export function LoginScreen() {
  const setReader = useReader((s) => s.setReader);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [color, setColor] = useState(AVATAR_COLORS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("الرجاء إدخال اسم (حرفان على الأقل)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/readers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          displayName: displayName.trim() || name.trim(),
          avatarColor: color,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "فشل التسجيل");
      }
      const { reader } = await res.json();
      setReader({
        id: reader.id,
        name: reader.name,
        displayName: reader.displayName,
        avatarColor: reader.avatarColor,
        currentSurah: reader.currentSurah,
        currentVerse: reader.currentVerse,
        totalVersesRead: reader.totalVersesRead,
        readingStreak: reader.readingStreak,
        lastReadDate: reader.lastReadDate,
        createdAt: reader.createdAt,
      });
      toast.success(`أهلاً بك ${reader.displayName} 🌙`);
    } catch (e: any) {
      toast.error(e.message || "فشل التسجيل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pattern-bg">
      {/* Top bar with theme toggle */}
      <header className="px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-quran text-lg font-bold text-primary leading-tight">نور القرآن</h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">Noor Al-Quran</p>
          </div>
        </div>
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
            aria-label="تبديل الوضع"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Hero side */}
          <div className="hidden lg:block space-y-6 pr-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>تطبيق قراءة القرآن الكريم</span>
              </div>
              <h2 className="font-quran text-4xl font-bold leading-tight">
                رحلتك مع كتاب الله
                <br />
                <span className="text-primary">تبدأ من هنا</span>
              </h2>
              <p className="text-muted-foreground font-arabic leading-relaxed text-lg">
                تتبّع تقدمك في قراءة القرآن، ضع أهدافك لختمه، شارك عائلتك وأصدقاءك الرحلة، وتنافسوا في الخير. كل آية تقرؤها تُسجَّل بدقة وتُضاف إلى رصيدك.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <FeatureCard
                icon={<TrendingUp className="w-5 h-5" />}
                title="تتبّع دقيق"
                desc="سجّل كل آية تصل إليها"
              />
              <FeatureCard
                icon={<Users className="w-5 h-5" />}
                title="مشاركة عائلية"
                desc="تابع تقدم أحبتك"
              />
              <FeatureCard
                icon={<Target className="w-5 h-5" />}
                title="أهداف ذكية"
                desc="احسب وتيرتك للختم"
              />
              <FeatureCard
                icon={<BookOpen className="w-5 h-5" />}
                title="تفسير الآيات"
                desc="فهم مع كل آية"
              />
            </div>
          </div>

          {/* Form side */}
          <Card className="decorative-border shadow-xl border-primary/10">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center mb-3">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-quran text-2xl">إنشاء حساب القارئ</CardTitle>
              <CardDescription className="font-arabic">
                سجّل اسمك للبدء. لن تُشارك بياناتك مع أي طرف خارجي.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="font-arabic text-sm">اسم المستخدم (للدخول)</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: ahmed أو saeed"
                    className="font-arabic h-11"
                    autoComplete="username"
                    required
                  />
                  <p className="text-xs text-muted-foreground font-arabic">
                    هذا الاسم يُستخدم للدخول. إذا أدخلت اسمًا موجودًا ستعود إلى حسابك السابق.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="displayName" className="font-arabic text-sm">الاسم الظاهر (اختياري)</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="مثال: أحمد، عائلة أحمد…"
                    className="font-arabic h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-arabic text-sm">لون ملفك الشخصي</Label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-9 h-9 rounded-full transition-all ${
                          color === c ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110" : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: c }}
                        aria-label={`لون ${c}`}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 font-arabic text-base"
                  size="lg"
                >
                  {loading ? "جارٍ التسجيل…" : "ابدأ رحلتك مع القرآن"}
                </Button>

                <p className="text-center text-xs text-muted-foreground font-arabic pt-2">
                  بالضغط على ابدأ فأنت توافق على استخدام البيانات محليًا فقط.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="px-4 py-4 text-center text-xs text-muted-foreground font-arabic">
        نور القرآن — ﴿إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ﴾
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-card/50 border border-border/60">
      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-arabic text-sm font-semibold leading-tight">{title}</p>
        <p className="font-arabic text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
