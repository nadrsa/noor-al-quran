"use client";

import { useState } from "react";
import { useReader } from "@/lib/store";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  BookOpen,
  Target,
  Trophy,
  Bookmark,
  Moon,
  Sun,
  LogOut,
  Settings,
  Users,
  BookMarked,
} from "lucide-react";
import { Dashboard } from "@/components/views/dashboard";
import { ReadView } from "@/components/views/read-view";
import { GoalsView } from "@/components/views/goals-view";
import { LeaderboardView } from "@/components/views/leaderboard-view";
import { BookmarksView } from "@/components/views/bookmarks-view";
import { GroupsView } from "@/components/views/groups-view";
import { SettingsView } from "@/components/views/settings-view";
import { HadithsView } from "@/components/views/hadiths-view";

export type TabId =
  | "dashboard"
  | "read"
  | "hadiths"
  | "goals"
  | "leaderboard"
  | "bookmarks"
  | "groups"
  | "settings";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "الرئيسية", icon: <Home className="w-4 h-4" /> },
  { id: "read", label: "اقرأ", icon: <BookOpen className="w-4 h-4" /> },
  { id: "hadiths", label: "أحاديث", icon: <BookMarked className="w-4 h-4" /> },
  { id: "goals", label: "الأهداف", icon: <Target className="w-4 h-4" /> },
  { id: "leaderboard", label: "المتنافسون", icon: <Trophy className="w-4 h-4" /> },
  { id: "bookmarks", label: "العلامات", icon: <Bookmark className="w-4 h-4" /> },
  { id: "groups", label: "المجموعات", icon: <Users className="w-4 h-4" /> },
  { id: "settings", label: "الإعدادات", icon: <Settings className="w-4 h-4" /> },
];

export function AppShell() {
  const reader = useReader((s) => s.reader);
  const logout = useReader((s) => s.logout);
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<TabId>("dashboard");

  if (!reader) return null;

  const initial = reader.displayName.charAt(0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Logo */}
          <button
            onClick={() => setTab("dashboard")}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="hidden sm:block text-start">
              <h1 className="font-quran text-base font-bold text-primary leading-tight">نور القرآن</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Noor Al-Quran</p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 mx-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-arabic transition-colors ${
                  tab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
              aria-label="تبديل الوضع"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <button
              onClick={() => setTab("settings")}
              className="flex items-center gap-2 rounded-full hover:bg-muted p-0.5 pr-0.5 pl-2 transition-colors"
            >
              <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-background">
                <AvatarFallback
                  className="text-white text-sm font-semibold"
                  style={{ backgroundColor: reader.avatarColor }}
                >
                  {initial}
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:block font-arabic text-sm font-medium max-w-[120px] truncate">
                {reader.displayName}
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm("هل تريد تسجيل الخروج؟ (سيبقى حسابك محفوظًا)")) {
                  logout();
                }
              }}
              className="rounded-full"
              aria-label="خروج"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <div key={tab} className="animate-fade-in">
            {tab === "dashboard" && <Dashboard onNavigate={setTab} />}
            {tab === "read" && <ReadView />}
            {tab === "hadiths" && <HadithsView />}
            {tab === "goals" && <GoalsView />}
            {tab === "leaderboard" && <LeaderboardView />}
            {tab === "bookmarks" && <BookmarksView />}
            {tab === "groups" && <GroupsView />}
            {tab === "settings" && <SettingsView />}
          </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-stretch justify-around max-w-2xl mx-auto px-1 py-1 safe-area-pb">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-md flex-1 min-w-0 transition-colors ${
                tab === t.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`p-1 rounded-lg ${tab === t.id ? "bg-primary/10" : ""}`}>
                {t.icon}
              </div>
              <span className="font-arabic text-[10px] leading-tight truncate w-full text-center">
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <footer className="hidden md:block px-6 py-3 text-center text-xs text-muted-foreground font-arabic border-t border-border/40">
        نور القرآن — ﴿وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ﴾
      </footer>
    </div>
  );
}
