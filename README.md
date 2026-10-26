# نور القرآن — Noor Al-Quran

تطبيق احترافي لقراءة القرآن الكريم مع تتبع التقدم، المنافسة العائلية، تحديد الأهداف، ومراجعة الأحاديث النبوية الصحيحة في فضل القرآن.

## ✨ المميزات

- 📖 **القرآن الكريم كاملاً** (114 سورة × 6236 آية) عبر `api.alquran.cloud`
- 🔒 **نظام مراقبة صارم** يُجبر المستخدم على القراءة الفعلية لكل آية (مؤقت + IntersectionObserver)
- 🎯 **أهداف ذكية** لحساب المقدار اليومي للختم
- 👥 **مجموعات عائلية** برموز دعوة للمنافسة في الخير
- 🏆 **لوحة متصدرين** بمعايير متعددة
- 🔖 **علامات (Bookmarks)** مع ملاحظات
- 📚 **32 حديث صحيح** في فضل القرآن من الكتب الستة
- 🌙 **وضع ليلي/نهاري** بتصميم إسلامي راقٍ
- 📱 **متجاوب 100%** مع الموبايل والديسكتوب

## 🛠️ التقنيات

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Database:** PostgreSQL (Supabase) + Prisma ORM
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State:** Zustand + persist middleware
- **Theme:** next-themes
- **API:** alquran.cloud (للقرآن والتفسير)

---

## 🚀 النشر على Vercel + Supabase

### الخطوة 1: إعداد Supabase (قاعدة البيانات)

1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ حساب مجاني
2. اضغط **"New Project"** واختر:
   - **Name:** `noor-quran-db` (أي اسم)
   - **Database Password:** أنشئ كلمة مرور قوية واحفظها
   - **Region:** الأقرب لموقعك (مثلاً `Singapore` للمستخدمين الآسيويين)
3. انتظر 2-3 دقائق حتى يكتمل إنشاء المشروع
4. اذهب إلى **Project Settings → Database → Connection string**
5. ستجد نوعين من روابط الاتصال:
   - **Connection pooling** (port `6543`) — هذا هو `DATABASE_URL`
   - **Direct connection** (port `5432`) — هذا هو `DIRECT_URL`
6. انسخ كل منهما واحفظهما (ستحتاجهما في الخطوة 3)

### الخطوة 2: رفع المشروع إلى GitHub

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit: Noor Al-Quran app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/noor-al-quran.git
git push -u origin main
```

### الخطوة 3: النشر على Vercel

1. اذهب إلى [vercel.com](https://vercel.com) وسجّل الدخول بحساب GitHub
2. اضغط **"New Project"**
3. اختر مستودع `noor-al-quran` من قائمة GitHub
4. **لا تضغط Deploy بعد!** اذهب إلى **"Environment Variables"** وأضف:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | `postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true` |
   | `DIRECT_URL` | `postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres` |

   - `[REF]` = Project Ref من Supabase (مثل `abcd1234efgh`)
   - `[PASSWORD]` = كلمة المرور التي أنشأتها في الخطوة 1
   - `[REGION]` = منطقة Supabase (مثل `ap-southeast-1`)

5. اضغط **"Deploy"** — سيستغرق 2-3 دقائق
6. ستحصل على رابط مثل `noor-al-quran.vercel.app` — ثابت لا يتغير

### الخطوة 4: إنشاء جداول قاعدة البيانات

بعد أول نشر ناجح، يجب إنشاء الجداول في Supabase. هناك طريقتان:

#### الطريقة الأسهل: عبر Prisma محلياً

```bash
# في مشروعك المحلي، حدّث .env بقيم Supabase الحقيقية:
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# ثم نفّذ:
bun run db:push
```

هذا سيُنشئ كل الجداول (Reader, Progress, Bookmark, Goal, Group, إلخ) في Supabase.

#### الطريقة البديلة: عبر Supabase SQL Editor

اذهب إلى Supabase Dashboard → SQL Editor → الصق محتوى `prisma/migrations/init.sql` (إن وُجد) — لكن `db:push` أسهل.

### الخطوة 5: زيارة التطبيق! 🎉

افتح رابط Vercel — ستجد:
- ✅ شاشة تسجيل دخول
- ✅ كل السور الـ114 مع نصوصها وتفسيرها
- ✅ نظام المراقبة الصارم
- ✅ قاعدة البيانات تعمل على Supabase

---

## 🔄 التحديثات اللاحقة

كل تحديث تريد إجراءه:

```bash
# عدّل الكود
git add .
git commit -m "feat: add new feature"
git push
```

Vercel سينشر التحديث تلقائياً خلال 1-2 دقيقة. **الرابط يبقى كما هو.**

---

## 🏃‍♂️ التشغيل محلياً

### المتطلبات
- Node.js 18+ أو Bun
- Git

### الخطوات

```bash
# 1. استنسخ المشروع
git clone https://github.com/YOUR-USERNAME/noor-al-quran.git
cd noor-al-quran

# 2. ثبّت التبعيات
bun install  # أو npm install

# 3. أعد ملف البيئة
cp .env.example .env
# ثم عدّل .env بـ:
# - DATABASE_URL="file:./db/custom.db"  ← لـ SQLite محلي
# - أو قيم Supabase إن أردت

# 4. أنشئ الجداول
bun run db:push

# 5. شغّل التطبيق
bun run dev
```

افتح [http://localhost:3000](http://localhost:3000)

---

## 📂 بنية المشروع

```
noor-al-quran/
├── prisma/
│   └── schema.prisma           # بنية قاعدة البيانات (PostgreSQL)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── quran/[surah]/   # وسيط API لـ alquran.cloud
│   │   │   ├── readers/         # إدارة القرّاء
│   │   │   ├── progress/        # تسجيل التقدم
│   │   │   ├── bookmarks/       # العلامات
│   │   │   ├── goals/           # الأهداف
│   │   │   ├── leaderboard/     # المتصدرون
│   │   │   └── groups/          # المجموعات
│   │   ├── layout.tsx
│   │   ├── page.tsx             # الصفحة الرئيسية
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── views/               # الصفحات (dashboard, read, hadiths, ...)
│   │   ├── quran/               # verse-reader مع نظام المراقبة
│   │   ├── app-shell.tsx        # الهيكل العام
│   │   └── login-screen.tsx
│   └── lib/
│       ├── quran/
│       │   ├── surahs.ts        # بيانات الـ114 سورة
│       │   ├── verses.ts        # نصوص الآيات (للسور المضمّنة محلياً)
│       │   └── hadiths.ts       # 32 حديث صحيح
│       ├── store.ts             # Zustand store
│       └── db.ts                # Prisma client
├── package.json
├── next.config.ts
├── vercel.json                  # إعدادات Vercel
├── .env.example
└── README.md
```

---

## 🌐 ملاحظات تقنية

### لماذا PostgreSQL بدلاً من SQLite؟

SQLite رائع للتطوير المحلي لكنه **لا يعمل على Vercel** لأن Vercel يستعمل serverless functions (حاويات مؤقتة تُدمر بعد كل طلب، فلا يمكن حفظ ملفات).

PostgreSQL عبر Supabase يعمل كخادم منفصل دائم، فيستمر حفظ البيانات بين الطلبات.

### كيف يعمل نظام المراقبة الصارم؟

1. كل آية تُعرض في عنصر مع `IntersectionObserver`
2. عندما تصبح الآية مرئية في الـ viewport (≥40%)، يبدأ مؤقت
3. الوقت المطلوب يُحسب ديناميكياً: `Math.min(30000, Math.max(4000, 3000 + words × 800))` — آية 4 كلمات = ~6 ثوانٍ
4. عند مغادرة الـ viewport، يتوقف المؤقت (يمنع الغش بالـ scroll السريع)
5. عند اكتمال المؤقت، تُعلَّم الآية كـ "مُتحقَّق منها"
6. زر "سجّل قراءة الصفحة" يبقى مقفلاً حتى تُقرأ جميع آيات الصفحة

### كيف يعمل الـ caching للقرآن؟

عند أول طلب لسورة من `/api/quran/[surah]`:
1. الخادم يجلب النص العربي + الترجمة + التفسير من alquran.cloud (دفعة واحدة)
2. يحفظ النتيجة في الذاكرة (Map) لمدة 24 ساعة
3. الطلبات التالية لنفس السورة تأتي من الذاكرة (< 10ms بدلاً من 1.3s)

ملاحظة: على Vercel، الذاكرة تُدمر بين الطلبات الباردة، لذلك قد يُعاد الجلب أحياناً — لكنه سريع جداً.

---

## 📜 الترخيص

هذا المشروع مفتوح المصدر للاستخدام الشخصي والتعليمي.

## 🤝 المساهمة

المساهمات مرحب بها! افتح Issue أو Pull Request على GitHub.

## 🤲 دعاء

﴿رَبِّ زِدْنِي عِلْمًا﴾

نسأل الله أن يجعل هذا العمل خالصاً لوجهه الكريم، وأن ينفع به كل من قرأ فيه.
