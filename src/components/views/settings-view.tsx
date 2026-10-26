"use client";

import { useState } from "react";
import { useReader } from "@/lib/store";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { User, Palette, Moon, Sun, LogOut, Info, BookOpen } from "lucide-react";
import { toast } from "sonner";

const AVATAR_COLORS = [
  "#0d9488", "#7c3aed", "#db2777", "#ea580c",
  "#0891b2", "#16a34a", "#9333ea", "#0284c7",
];

export function SettingsView() {
  const reader = useReader((s) => s.reader);
  const updateReader = useReader((s) => s.updateReader);
  const logout = useReader((s) => s.logout);
  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState(reader?.displayName || "");
  const [avatarColor, setAvatarColor] = useState(reader?.avatarColor || AVATAR_COLORS[0]);
  const [saving, setSaving] = useState(false);

  if (!reader) return null;

  const save = async () => {
    if (displayName.trim().length < 1) {
      toast.error("الاسم الظاهر مطلوب");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/readers/${reader.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          avatarColor,
        }),
      });
      if (!res.ok) throw new Error("fail");
      const json = await res.json();
      updateReader({
        displayName: json.reader.displayName,
        avatarColor: json.reader.avatarColor,
      });
      toast.success("تم حفظ التغييرات");
    } catch {
      toast.error("فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div>
        <h2 className="font-quran text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          الإعدادات
        </h2>
      </div>

      {/* Profile */}
      <Card className="border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="font-quran text-lg">الملف الشخصي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-background shadow">
              <AvatarFallback
                className="text-white text-2xl font-bold"
                style={{ backgroundColor: avatarColor }}
              >
                {displayName.charAt(0) || reader.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-quran text-lg font-bold">{reader.displayName}</p>
              <p className="text-xs text-muted-foreground font-arabic">
                @{reader.name} • انضمّ {new Date(reader.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "short" })}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="displayName" className="font-arabic text-sm">الاسم الظاهر</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="font-arabic"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-arabic text-sm">لون الصورة الرمزية</Label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAvatarColor(c)}
                  className={`w-9 h-9 rounded-full transition-all ${
                    avatarColor === c ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`لون ${c}`}
                />
              ))}
            </div>
          </div>

          <Button onClick={save} disabled={saving} className="font-arabic w-full sm:w-auto">
            {saving ? "جارٍ الحفظ…" : "حفظ التغييرات"}
          </Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="font-quran text-lg flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            المظهر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-arabic text-sm font-medium">الوضع الليلي</p>
                <p className="text-xs text-muted-foreground font-arabic">
                  مريح للعين أثناء القراءة في الإضاءة المنخفضة
                </p>
              </div>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="font-quran text-lg flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            عن التطبيق
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm font-arabic text-muted-foreground leading-relaxed">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>
              <span className="font-bold text-foreground">نور القرآن</span> — تطبيق لقراءة القرآن الكريم
              وتتبّع التقدم، مع إمكانية المشاركة العائلية، تحديد الأهداف لختم القرآن، ومراجعة تفسير الآيات.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>
              <span className="font-bold text-foreground">حول النص:</span> يضم التطبيق نصوص آيات
              مختارة من السور القصيرة وسورة الفاتحة وبداية البقرة. تسجيل التقدم يعمل لجميع السور الـ114.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>
              <span className="font-bold text-foreground">الخصوصية:</span> جميع البيانات محفوظة على هذا الجهاز فقط.
              لا تُشارك أي معلومات مع طرف خارجي.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-destructive/20">
        <CardContent className="py-4">
          <Button
            variant="ghost"
            onClick={() => {
              if (confirm("هل تريد تسجيل الخروج؟ (سيبقى حسابك محفوظًا ويمكنك العودة بنفس الاسم)")) {
                logout();
              }
            }}
            className="font-arabic text-destructive hover:text-destructive w-full"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground font-arabic pb-4">
        نور القرآن — نسخة 1.0 • ﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾
      </p>
    </div>
  );
}
