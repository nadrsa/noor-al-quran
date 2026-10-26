// API: /api/quran/[surah]
// Proxies alquran.cloud to fetch full surah data (Arabic Uthmani + English Sahih + Arabic Tafsir)
// with in-memory caching to avoid repeated API calls.
//
// Source: https://alquran.cloud/api
// Editions used:
//   - quran-uthmani  : Arabic Uthmani text
//   - en.sahih       : Sahih International English translation
//   - ar.muyassar    : Arabic "Muyassar" tafsir (simplified explanation)

import { NextRequest, NextResponse } from "next/server";
import https from "node:https";
import dns from "node:dns/promises";

// Force IPv4 resolution. alquran.cloud has IPv6 AAAA records that some networks
// can't reach; IPv4 is universally available.
dns.setDefaultResultOrder("ipv4first");

// In-memory cache (per-server). Survives between hot reloads in dev.
const cache = new Map<string, { data: SurahData; ts: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

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
  cachedAt?: string;
}

// Custom fetch using node:https with IPv4 preference
function fetchIpv4First(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: "GET",
        family: 4, // force IPv4
        headers: {
          Accept: "application/json",
          "User-Agent": "Noor-Quran-App/1.0",
        },
        timeout: 12000,
      },
      (res) => {
        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          reject(new Error(`HTTP ${res.statusCode}`));
          res.resume();
          return;
        }
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy(new Error("Request timeout"));
    });
  });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ surah: string }> }) {
  const { surah: surahStr } = await params;
  const surahNum = parseInt(surahStr, 10);

  if (!surahNum || surahNum < 1 || surahNum > 114) {
    return NextResponse.json({ error: "رقم السورة غير صالح (1-114)" }, { status: 400 });
  }

  // Check cache first
  const cacheKey = String(surahNum);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json({
      ...cached.data,
      cached: true,
      cachedAt: new Date(cached.ts).toISOString(),
    });
  }

  // Fetch from alquran.cloud with all 3 editions in a single call
  const url = `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.sahih,ar.muyassar`;

  try {
    const raw = await fetchIpv4First(url);
    const json = JSON.parse(raw);

    if (json.code !== 200 || !Array.isArray(json.data) || json.data.length < 3) {
      throw new Error("Invalid upstream response");
    }

    const [arabicEdition, englishEdition, tafsirEdition] = json.data;

    // Merge the three editions into a unified Ayah[] structure
    const ayahs: Ayah[] = arabicEdition.ayahs.map((a: any, i: number) => ({
      numberInSurah: a.numberInSurah,
      arabic: a.text,
      translation: englishEdition.ayahs[i]?.text || "",
      tafsir: tafsirEdition.ayahs[i]?.text || "",
      sajdah: !!a.sajda,
      juz: a.juz || 1,
      page: a.page || 1,
    }));

    const data: SurahData = {
      number: arabicEdition.number,
      name: arabicEdition.name,
      englishName: arabicEdition.englishName,
      englishNameTranslation: arabicEdition.englishNameTranslation,
      revelationType: arabicEdition.revelationType,
      numberOfAyahs: arabicEdition.numberOfAyahs,
      ayahs,
    };

    // Save to cache
    cache.set(cacheKey, { data, ts: Date.now() });

    return NextResponse.json(data);
  } catch (e: any) {
    console.error("Quran proxy error:", e);

    // If we have stale cache, return it with a warning
    const stale = cache.get(cacheKey);
    if (stale) {
      return NextResponse.json({
        ...stale.data,
        cached: true,
        stale: true,
        cachedAt: new Date(stale.ts).toISOString(),
      });
    }

    return NextResponse.json(
      { error: "تعذّر جلب السورة من المصدر الخارجي", detail: e.message },
      { status: 502 }
    );
  }
}

