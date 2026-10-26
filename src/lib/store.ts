"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CurrentReader {
  id: string;
  name: string;
  displayName: string;
  avatarColor: string;
  currentSurah: number;
  currentVerse: number;
  totalVersesRead: number;
  readingStreak: number;
  lastReadDate: string | null;
  createdAt: string;
}

interface ReaderState {
  reader: CurrentReader | null;
  setReader: (r: CurrentReader | null) => void;
  updateReader: (patch: Partial<CurrentReader>) => void;
  logout: () => void;
}

// Safe storage factory: returns a no-op storage when localStorage is
// unavailable (e.g. sandboxed iframes, private mode, SSR). This prevents
// the persist middleware from throwing and blocking the UI.
const safeStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // ignore quota / access errors
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

export const useReader = create<ReaderState>()(
  persist(
    (set) => ({
      reader: null,
      setReader: (r) => set({ reader: r }),
      updateReader: (patch) =>
        set((state) => ({
          reader: state.reader ? { ...state.reader, ...patch } : null,
        })),
      logout: () => set({ reader: null }),
    }),
    {
      name: "noor-quran-reader",
      storage: createJSONStorage(() => safeStorage),
      // Don't block rendering waiting for rehydration — the store starts
      // with reader=null (showing LoginScreen) and updates once storage
      // is read. skipHydration=false lets the middleware handle it async.
      skipHydration: false,
    }
  )
);
