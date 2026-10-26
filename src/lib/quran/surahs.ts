// Quran metadata: all 114 surahs with names, verse counts, and revelation type
// Source: standard Quran reference data

export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration: string;
  versesCount: number;
  revelationType: "Meccan" | "Medinan";
  juz: number; // starting juz
}

export const SURAHS: SurahMeta[] = [
  { number: 1, nameArabic: "الفاتحة", nameEnglish: "The Opening", nameTransliteration: "Al-Fatihah", versesCount: 7, revelationType: "Meccan", juz: 1 },
  { number: 2, nameArabic: "البقرة", nameEnglish: "The Cow", nameTransliteration: "Al-Baqarah", versesCount: 286, revelationType: "Medinan", juz: 1 },
  { number: 3, nameArabic: "آل عمران", nameEnglish: "Family of Imran", nameTransliteration: "Aal-i-Imraan", versesCount: 200, revelationType: "Medinan", juz: 3 },
  { number: 4, nameArabic: "النساء", nameEnglish: "The Women", nameTransliteration: "An-Nisaa", versesCount: 176, revelationType: "Medinan", juz: 4 },
  { number: 5, nameArabic: "المائدة", nameEnglish: "The Table", nameTransliteration: "Al-Maaida", versesCount: 120, revelationType: "Medinan", juz: 6 },
  { number: 6, nameArabic: "الأنعام", nameEnglish: "The Cattle", nameTransliteration: "Al-An'aam", versesCount: 165, revelationType: "Meccan", juz: 7 },
  { number: 7, nameArabic: "الأعراف", nameEnglish: "The Heights", nameTransliteration: "Al-A'raaf", versesCount: 206, revelationType: "Meccan", juz: 8 },
  { number: 8, nameArabic: "الأنفال", nameEnglish: "The Spoils of War", nameTransliteration: "Al-Anfaal", versesCount: 75, revelationType: "Medinan", juz: 9 },
  { number: 9, nameArabic: "التوبة", nameEnglish: "The Repentance", nameTransliteration: "At-Tawba", versesCount: 129, revelationType: "Medinan", juz: 10 },
  { number: 10, nameArabic: "يونس", nameEnglish: "Jonah", nameTransliteration: "Yunus", versesCount: 109, revelationType: "Meccan", juz: 11 },
  { number: 11, nameArabic: "هود", nameEnglish: "Hud", nameTransliteration: "Hud", versesCount: 123, revelationType: "Meccan", juz: 11 },
  { number: 12, nameArabic: "يوسف", nameEnglish: "Joseph", nameTransliteration: "Yusuf", versesCount: 111, revelationType: "Meccan", juz: 12 },
  { number: 13, nameArabic: "الرعد", nameEnglish: "The Thunder", nameTransliteration: "Ar-Ra'd", versesCount: 43, revelationType: "Medinan", juz: 13 },
  { number: 14, nameArabic: "إبراهيم", nameEnglish: "Abraham", nameTransliteration: "Ibrahim", versesCount: 52, revelationType: "Meccan", juz: 13 },
  { number: 15, nameArabic: "الحجر", nameEnglish: "The Rocky Tract", nameTransliteration: "Al-Hijr", versesCount: 99, revelationType: "Meccan", juz: 14 },
  { number: 16, nameArabic: "النحل", nameEnglish: "The Bee", nameTransliteration: "An-Nahl", versesCount: 128, revelationType: "Meccan", juz: 14 },
  { number: 17, nameArabic: "الإسراء", nameEnglish: "The Night Journey", nameTransliteration: "Al-Israa", versesCount: 111, revelationType: "Meccan", juz: 15 },
  { number: 18, nameArabic: "الكهف", nameEnglish: "The Cave", nameTransliteration: "Al-Kahf", versesCount: 110, revelationType: "Meccan", juz: 15 },
  { number: 19, nameArabic: "مريم", nameEnglish: "Mary", nameTransliteration: "Maryam", versesCount: 98, revelationType: "Meccan", juz: 16 },
  { number: 20, nameArabic: "طه", nameEnglish: "Ta-Ha", nameTransliteration: "Taa-Haa", versesCount: 135, revelationType: "Meccan", juz: 16 },
  { number: 21, nameArabic: "الأنبياء", nameEnglish: "The Prophets", nameTransliteration: "Al-Anbiyaa", versesCount: 112, revelationType: "Meccan", juz: 17 },
  { number: 22, nameArabic: "الحج", nameEnglish: "The Pilgrimage", nameTransliteration: "Al-Hajj", versesCount: 78, revelationType: "Medinan", juz: 17 },
  { number: 23, nameArabic: "المؤمنون", nameEnglish: "The Believers", nameTransliteration: "Al-Muminoon", versesCount: 118, revelationType: "Meccan", juz: 18 },
  { number: 24, nameArabic: "النور", nameEnglish: "The Light", nameTransliteration: "An-Noor", versesCount: 64, revelationType: "Medinan", juz: 18 },
  { number: 25, nameArabic: "الفرقان", nameEnglish: "The Criterion", nameTransliteration: "Al-Furqaan", versesCount: 77, revelationType: "Meccan", juz: 18 },
  { number: 26, nameArabic: "الشعراء", nameEnglish: "The Poets", nameTransliteration: "Ash-Shu'araa", versesCount: 227, revelationType: "Meccan", juz: 19 },
  { number: 27, nameArabic: "النمل", nameEnglish: "The Ant", nameTransliteration: "An-Naml", versesCount: 93, revelationType: "Meccan", juz: 19 },
  { number: 28, nameArabic: "القصص", nameEnglish: "The Stories", nameTransliteration: "Al-Qasas", versesCount: 88, revelationType: "Meccan", juz: 20 },
  { number: 29, nameArabic: "العنكبوت", nameEnglish: "The Spider", nameTransliteration: "Al-Ankaboot", versesCount: 69, revelationType: "Meccan", juz: 20 },
  { number: 30, nameArabic: "الروم", nameEnglish: "The Romans", nameTransliteration: "Ar-Room", versesCount: 60, revelationType: "Meccan", juz: 21 },
  { number: 31, nameArabic: "لقمان", nameEnglish: "Luqman", nameTransliteration: "Luqman", versesCount: 34, revelationType: "Meccan", juz: 21 },
  { number: 32, nameArabic: "السجدة", nameEnglish: "The Prostration", nameTransliteration: "As-Sajda", versesCount: 30, revelationType: "Meccan", juz: 21 },
  { number: 33, nameArabic: "الأحزاب", nameEnglish: "The Combined Forces", nameTransliteration: "Al-Ahzaab", versesCount: 73, revelationType: "Medinan", juz: 21 },
  { number: 34, nameArabic: "سبأ", nameEnglish: "Sheba", nameTransliteration: "Saba", versesCount: 54, revelationType: "Meccan", juz: 22 },
  { number: 35, nameArabic: "فاطر", nameEnglish: "Originator", nameTransliteration: "Faatir", versesCount: 45, revelationType: "Meccan", juz: 22 },
  { number: 36, nameArabic: "يس", nameEnglish: "Ya Sin", nameTransliteration: "Yaseen", versesCount: 83, revelationType: "Meccan", juz: 22 },
  { number: 37, nameArabic: "الصافات", nameEnglish: "Those who set the Ranks", nameTransliteration: "As-Saaffaat", versesCount: 182, revelationType: "Meccan", juz: 23 },
  { number: 38, nameArabic: "ص", nameEnglish: "The Letter Saad", nameTransliteration: "Saad", versesCount: 88, revelationType: "Meccan", juz: 23 },
  { number: 39, nameArabic: "الزمر", nameEnglish: "The Troops", nameTransliteration: "Az-Zumar", versesCount: 75, revelationType: "Meccan", juz: 23 },
  { number: 40, nameArabic: "غافر", nameEnglish: "The Forgiver", nameTransliteration: "Ghaafir", versesCount: 85, revelationType: "Meccan", juz: 24 },
  { number: 41, nameArabic: "فصلت", nameEnglish: "Explained in Detail", nameTransliteration: "Fussilat", versesCount: 54, revelationType: "Meccan", juz: 24 },
  { number: 42, nameArabic: "الشورى", nameEnglish: "The Consultation", nameTransliteration: "Ash-Shura", versesCount: 53, revelationType: "Meccan", juz: 25 },
  { number: 43, nameArabic: "الزخرف", nameEnglish: "The Ornaments of Gold", nameTransliteration: "Az-Zukhruf", versesCount: 89, revelationType: "Meccan", juz: 25 },
  { number: 44, nameArabic: "الدخان", nameEnglish: "The Smoke", nameTransliteration: "Ad-Dukhaan", versesCount: 59, revelationType: "Meccan", juz: 25 },
  { number: 45, nameArabic: "الجاثية", nameEnglish: "The Crouching", nameTransliteration: "Al-Jaathiya", versesCount: 37, revelationType: "Meccan", juz: 25 },
  { number: 46, nameArabic: "الأحقاف", nameEnglish: "The Wind-Curved Sandhills", nameTransliteration: "Al-Ahqaf", versesCount: 35, revelationType: "Meccan", juz: 26 },
  { number: 47, nameArabic: "محمد", nameEnglish: "Muhammad", nameTransliteration: "Muhammad", versesCount: 38, revelationType: "Medinan", juz: 26 },
  { number: 48, nameArabic: "الفتح", nameEnglish: "The Victory", nameTransliteration: "Al-Fath", versesCount: 29, revelationType: "Medinan", juz: 26 },
  { number: 49, nameArabic: "الحجرات", nameEnglish: "The Rooms", nameTransliteration: "Al-Hujuraat", versesCount: 18, revelationType: "Medinan", juz: 26 },
  { number: 50, nameArabic: "ق", nameEnglish: "The Letter Qaf", nameTransliteration: "Qaaf", versesCount: 45, revelationType: "Meccan", juz: 26 },
  { number: 51, nameArabic: "الذاريات", nameEnglish: "The Winnowing Winds", nameTransliteration: "Adh-Dhaariyaat", versesCount: 60, revelationType: "Meccan", juz: 26 },
  { number: 52, nameArabic: "الطور", nameEnglish: "The Mount", nameTransliteration: "At-Tur", versesCount: 49, revelationType: "Meccan", juz: 27 },
  { number: 53, nameArabic: "النجم", nameEnglish: "The Star", nameTransliteration: "An-Najm", versesCount: 62, revelationType: "Meccan", juz: 27 },
  { number: 54, nameArabic: "القمر", nameEnglish: "The Moon", nameTransliteration: "Al-Qamar", versesCount: 55, revelationType: "Meccan", juz: 27 },
  { number: 55, nameArabic: "الرحمن", nameEnglish: "The Beneficent", nameTransliteration: "Ar-Rahmaan", versesCount: 78, revelationType: "Medinan", juz: 27 },
  { number: 56, nameArabic: "الواقعة", nameEnglish: "The Inevitable", nameTransliteration: "Al-Waaqia", versesCount: 96, revelationType: "Meccan", juz: 27 },
  { number: 57, nameArabic: "الحديد", nameEnglish: "The Iron", nameTransliteration: "Al-Hadid", versesCount: 29, revelationType: "Medinan", juz: 27 },
  { number: 58, nameArabic: "المجادلة", nameEnglish: "The Pleading Woman", nameTransliteration: "Al-Mujaadila", versesCount: 22, revelationType: "Medinan", juz: 28 },
  { number: 59, nameArabic: "الحشر", nameEnglish: "The Exile", nameTransliteration: "Al-Hashr", versesCount: 24, revelationType: "Medinan", juz: 28 },
  { number: 60, nameArabic: "الممتحنة", nameEnglish: "She that is to be examined", nameTransliteration: "Al-Mumtahana", versesCount: 13, revelationType: "Medinan", juz: 28 },
  { number: 61, nameArabic: "الصف", nameEnglish: "The Ranks", nameTransliteration: "As-Saff", versesCount: 14, revelationType: "Medinan", juz: 28 },
  { number: 62, nameArabic: "الجمعة", nameEnglish: "The Congregation, Friday", nameTransliteration: "Al-Jumu'a", versesCount: 11, revelationType: "Medinan", juz: 28 },
  { number: 63, nameArabic: "المنافقون", nameEnglish: "The Hypocrites", nameTransliteration: "Al-Munaafiqoon", versesCount: 11, revelationType: "Medinan", juz: 28 },
  { number: 64, nameArabic: "التغابن", nameEnglish: "The Mutual Disillusion", nameTransliteration: "At-Taghaabun", versesCount: 18, revelationType: "Medinan", juz: 28 },
  { number: 65, nameArabic: "الطلاق", nameEnglish: "The Divorce", nameTransliteration: "At-Talaaq", versesCount: 12, revelationType: "Medinan", juz: 28 },
  { number: 66, nameArabic: "التحريم", nameEnglish: "The Prohibition", nameTransliteration: "At-Tahrim", versesCount: 12, revelationType: "Medinan", juz: 28 },
  { number: 67, nameArabic: "الملك", nameEnglish: "The Sovereignty", nameTransliteration: "Al-Mulk", versesCount: 30, revelationType: "Meccan", juz: 29 },
  { number: 68, nameArabic: "القلم", nameEnglish: "The Pen", nameTransliteration: "Al-Qalam", versesCount: 52, revelationType: "Meccan", juz: 29 },
  { number: 69, nameArabic: "الحاقة", nameEnglish: "The Reality", nameTransliteration: "Al-Haaqqa", versesCount: 52, revelationType: "Meccan", juz: 29 },
  { number: 70, nameArabic: "المعارج", nameEnglish: "The Ascending Stairways", nameTransliteration: "Al-Ma'aarij", versesCount: 44, revelationType: "Meccan", juz: 29 },
  { number: 71, nameArabic: "نوح", nameEnglish: "Noah", nameTransliteration: "Nooh", versesCount: 28, revelationType: "Meccan", juz: 29 },
  { number: 72, nameArabic: "الجن", nameEnglish: "The Jinn", nameTransliteration: "Al-Jinn", versesCount: 28, revelationType: "Meccan", juz: 29 },
  { number: 73, nameArabic: "المزمل", nameEnglish: "The Enshrouded One", nameTransliteration: "Al-Muzzammil", versesCount: 20, revelationType: "Meccan", juz: 29 },
  { number: 74, nameArabic: "المدثر", nameEnglish: "The Cloaked One", nameTransliteration: "Al-Muddaththir", versesCount: 56, revelationType: "Meccan", juz: 29 },
  { number: 75, nameArabic: "القيامة", nameEnglish: "The Resurrection", nameTransliteration: "Al-Qiyaama", versesCount: 40, revelationType: "Meccan", juz: 29 },
  { number: 76, nameArabic: "الإنسان", nameEnglish: "The Man", nameTransliteration: "Al-Insaan", versesCount: 31, revelationType: "Medinan", juz: 29 },
  { number: 77, nameArabic: "المرسلات", nameEnglish: "The Emissaries", nameTransliteration: "Al-Mursalaat", versesCount: 50, revelationType: "Meccan", juz: 29 },
  { number: 78, nameArabic: "النبأ", nameEnglish: "The Tidings", nameTransliteration: "An-Naba", versesCount: 40, revelationType: "Meccan", juz: 30 },
  { number: 79, nameArabic: "النازعات", nameEnglish: "Those who drag forth", nameTransliteration: "An-Naazi'aat", versesCount: 46, revelationType: "Meccan", juz: 30 },
  { number: 80, nameArabic: "عبس", nameEnglish: "He Frowned", nameTransliteration: "Abasa", versesCount: 42, revelationType: "Meccan", juz: 30 },
  { number: 81, nameArabic: "التكوير", nameEnglish: "The Overthrowing", nameTransliteration: "At-Takwir", versesCount: 29, revelationType: "Meccan", juz: 30 },
  { number: 82, nameArabic: "الانفطار", nameEnglish: "The Cleaving", nameTransliteration: "Al-Infitaar", versesCount: 19, revelationType: "Meccan", juz: 30 },
  { number: 83, nameArabic: "المطففين", nameEnglish: "The Defrauding", nameTransliteration: "Al-Mutaffifin", versesCount: 36, revelationType: "Meccan", juz: 30 },
  { number: 84, nameArabic: "الانشقاق", nameEnglish: "The Sundering", nameTransliteration: "Al-Inshiqaaq", versesCount: 25, revelationType: "Meccan", juz: 30 },
  { number: 85, nameArabic: "البروج", nameEnglish: "The Mansions of the Stars", nameTransliteration: "Al-Burooj", versesCount: 22, revelationType: "Meccan", juz: 30 },
  { number: 86, nameArabic: "الطارق", nameEnglish: "The Morning Star", nameTransliteration: "At-Taariq", versesCount: 17, revelationType: "Meccan", juz: 30 },
  { number: 87, nameArabic: "الأعلى", nameEnglish: "The Most High", nameTransliteration: "Al-A'laa", versesCount: 19, revelationType: "Meccan", juz: 30 },
  { number: 88, nameArabic: "الغاشية", nameEnglish: "The Overwhelming", nameTransliteration: "Al-Ghaashiya", versesCount: 26, revelationType: "Meccan", juz: 30 },
  { number: 89, nameArabic: "الفجر", nameEnglish: "The Dawn", nameTransliteration: "Al-Fajr", versesCount: 30, revelationType: "Meccan", juz: 30 },
  { number: 90, nameArabic: "البلد", nameEnglish: "The City", nameTransliteration: "Al-Balad", versesCount: 20, revelationType: "Meccan", juz: 30 },
  { number: 91, nameArabic: "الشمس", nameEnglish: "The Sun", nameTransliteration: "Ash-Shams", versesCount: 15, revelationType: "Meccan", juz: 30 },
  { number: 92, nameArabic: "الليل", nameEnglish: "The Night", nameTransliteration: "Al-Lail", versesCount: 21, revelationType: "Meccan", juz: 30 },
  { number: 93, nameArabic: "الضحى", nameEnglish: "The Morning Hours", nameTransliteration: "Ad-Dhuhaa", versesCount: 11, revelationType: "Meccan", juz: 30 },
  { number: 94, nameArabic: "الشرح", nameEnglish: "The Relief", nameTransliteration: "Ash-Sharh", versesCount: 8, revelationType: "Meccan", juz: 30 },
  { number: 95, nameArabic: "التين", nameEnglish: "The Fig", nameTransliteration: "At-Tin", versesCount: 8, revelationType: "Meccan", juz: 30 },
  { number: 96, nameArabic: "العلق", nameEnglish: "The Clot", nameTransliteration: "Al-Alaq", versesCount: 19, revelationType: "Meccan", juz: 30 },
  { number: 97, nameArabic: "القدر", nameEnglish: "The Power", nameTransliteration: "Al-Qadr", versesCount: 5, revelationType: "Meccan", juz: 30 },
  { number: 98, nameArabic: "البينة", nameEnglish: "The Clear Proof", nameTransliteration: "Al-Bayyina", versesCount: 8, revelationType: "Medinan", juz: 30 },
  { number: 99, nameArabic: "الزلزلة", nameEnglish: "The Earthquake", nameTransliteration: "Az-Zalzala", versesCount: 8, revelationType: "Medinan", juz: 30 },
  { number: 100, nameArabic: "العاديات", nameEnglish: "The Courser", nameTransliteration: "Al-Aadiyaat", versesCount: 11, revelationType: "Meccan", juz: 30 },
  { number: 101, nameArabic: "القارعة", nameEnglish: "The Calamity", nameTransliteration: "Al-Qaari'a", versesCount: 11, revelationType: "Meccan", juz: 30 },
  { number: 102, nameArabic: "التكاثر", nameEnglish: "The Rivalry in world increase", nameTransliteration: "At-Takaathur", versesCount: 8, revelationType: "Meccan", juz: 30 },
  { number: 103, nameArabic: "العصر", nameEnglish: "The Declining Day", nameTransliteration: "Al-Asr", versesCount: 3, revelationType: "Meccan", juz: 30 },
  { number: 104, nameArabic: "الهمزة", nameEnglish: "The Traducer", nameTransliteration: "Al-Humaza", versesCount: 9, revelationType: "Meccan", juz: 30 },
  { number: 105, nameArabic: "الفيل", nameEnglish: "The Elephant", nameTransliteration: "Al-Fil", versesCount: 5, revelationType: "Meccan", juz: 30 },
  { number: 106, nameArabic: "قريش", nameEnglish: "Quraysh", nameTransliteration: "Quraysh", versesCount: 4, revelationType: "Meccan", juz: 30 },
  { number: 107, nameArabic: "الماعون", nameEnglish: "The Small Kindnesses", nameTransliteration: "Al-Maa'un", versesCount: 7, revelationType: "Meccan", juz: 30 },
  { number: 108, nameArabic: "الكوثر", nameEnglish: "The Abundance", nameTransliteration: "Al-Kawthar", versesCount: 3, revelationType: "Meccan", juz: 30 },
  { number: 109, nameArabic: "الكافرون", nameEnglish: "The Disbelievers", nameTransliteration: "Al-Kaafiroon", versesCount: 6, revelationType: "Meccan", juz: 30 },
  { number: 110, nameArabic: "النصر", nameEnglish: "The Divine Support", nameTransliteration: "An-Nasr", versesCount: 3, revelationType: "Medinan", juz: 30 },
  { number: 111, nameArabic: "المسد", nameEnglish: "The Palm Fiber", nameTransliteration: "Al-Masad", versesCount: 5, revelationType: "Meccan", juz: 30 },
  { number: 112, nameArabic: "الإخلاص", nameEnglish: "The Sincerity", nameTransliteration: "Al-Ikhlaas", versesCount: 4, revelationType: "Meccan", juz: 30 },
  { number: 113, nameArabic: "الفلق", nameEnglish: "The Daybreak", nameTransliteration: "Al-Falaq", versesCount: 5, revelationType: "Meccan", juz: 30 },
  { number: 114, nameArabic: "الناس", nameEnglish: "Mankind", nameTransliteration: "An-Naas", versesCount: 6, revelationType: "Meccan", juz: 30 },
];

// Total verses in the Quran
export const TOTAL_VERSES = SURAHS.reduce((sum, s) => sum + s.versesCount, 0); // 6236

// Helper: get surah meta
export function getSurah(number: number): SurahMeta | undefined {
  return SURAHS.find((s) => s.number === number);
}

// Helper: convert surah+verse to absolute verse index across the whole Quran
export function toAbsoluteVerse(surahNumber: number, verseNumber: number): number {
  let abs = 0;
  for (const s of SURAHS) {
    if (s.number === surahNumber) return abs + verseNumber;
    abs += s.versesCount;
  }
  return abs;
}

// Helper: convert absolute verse to surah+verse
export function fromAbsoluteVerse(abs: number): { surahNumber: number; verseNumber: number } {
  let remaining = abs;
  for (const s of SURAHS) {
    if (remaining <= s.versesCount) {
      return { surahNumber: s.number, verseNumber: Math.max(1, remaining) };
    }
    remaining -= s.versesCount;
  }
  const last = SURAHS[SURAHS.length - 1];
  return { surahNumber: last.number, verseNumber: last.versesCount };
}
