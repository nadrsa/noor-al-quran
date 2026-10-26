// Real Arabic verse text for selected surahs (mostly short surahs from Juz Amma + Al-Fatihah + start of Al-Baqarah)
// Verse numbers are 1-indexed. Bismillah is verse 1 for all surahs except At-Tawba (9).

import { YASEEN_VERSES } from "./surah-yaseen";
import { ARRAHMAN_VERSES as AR_RAHMAN_VERSES } from "./surah-ar-rahman";
import { ALMULK_VERSES as AL_MULK_VERSES } from "./surah-al-mulk";

export interface VerseText {
  surahNumber: number;
  verseNumber: number;
  arabic: string;
  translation: string;
  tafsir: string;
}

// Al-Fatihah (1) - all 7 verses
const alFatihah: VerseText[] = [
  {
    surahNumber: 1, verseNumber: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    tafsir: "تُفتتح بها القرآن وكل سورة (إلا التوبة)؛ فيها اسم الله الجامع لكل أسمائه الحسنى، والرحمة الشاملة لجميع خلقه في الدنيا، والمخصوصة للمؤمنين في الآخرة."
  },
  {
    surahNumber: 1, verseNumber: 2,
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translation: "All praise is for Allah—Lord of all worlds,",
    tafsir: "الثناء على الله بأنواع الجميل الذي لا يَليق إلا به؛ فهو الخالق الرازق المدبر لكل المخلوقات."
  },
  {
    surahNumber: 1, verseNumber: 3,
    arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "The Entirely Merciful, the Especially Merciful,",
    tafsir: "اسمان دالان على أن رحمته وسعت كل شيء، وهي أخصُّ بالمؤمنين."
  },
  {
    surahNumber: 1, verseNumber: 4,
    arabic: "مَالِكِ يَوْمِ الدِّينِ",
    translation: "Master of the Day of Judgment.",
    tafsir: "المالك المتصرف وحده في يوم القيامة، يوم يُجازى كل عبد بعمله."
  },
  {
    surahNumber: 1, verseNumber: 5,
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    translation: "You alone we worship and You alone we ask for help.",
    tafsir: "أخلص العبادة لله وحده، ولا نستعين إلا به في جميع أمورنا؛ ففيها تقديم الوسيلة قبل المسؤول."
  },
  {
    surahNumber: 1, verseNumber: 6,
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    translation: "Guide us along the Straight Path,",
    tafsir: "دعاء بالثبات على الإسلام، وزيادة الهداية إلى طريق الحق المستقيم لا عوج فيه."
  },
  {
    surahNumber: 1, verseNumber: 7,
    arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    translation: "The Path of those You have blessed—not those you are displeased with, or those who are astray.",
    tafsir: "بيان طريق المؤمنين الذين أنعم الله عليهم من النبيين والصدِّيقين والشهداء والصالحين، وتمييزهم عن طريق المغضوب عليهم (اليهود) والضالين (النصارى)."
  },
];

// Al-Ikhlas (112) - 4 verses
const alIkhlas: VerseText[] = [
  {
    surahNumber: 112, verseNumber: 1,
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    translation: "Say, He is Allah—One.",
    tafsir: "إثبات وحدانية الله المطلقة، فهو الأحد الذي لا نظير له ولا شريك."
  },
  {
    surahNumber: 112, verseNumber: 2,
    arabic: "اللَّهُ الصَّمَدُ",
    translation: "Allah—the Sustainer needed by all.",
    tafsir: "السيد الذي يُقصد في الحوائج، الكامل في صفاته، الذي لا يحتاج إلى أحد."
  },
  {
    surahNumber: 112, verseNumber: 3,
    arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    translation: "He has never had offspring, nor was He born.",
    tafsir: "تنزيه الله عن الولد والوالد، فلا يتفرع عنه شيء ولا يتفرع هو عن شيء."
  },
  {
    surahNumber: 112, verseNumber: 4,
    arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    translation: "And there is none comparable to Him.",
    tafsir: "ليس له مماثل ولا شبيه في ذاته أو صفاته أو أفعاله."
  },
];

// Al-Falaq (113) - 5 verses
const alFalaq: VerseText[] = [
  {
    surahNumber: 113, verseNumber: 1,
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    translation: "Say, I seek refuge in the Lord of the daybreak,",
    tafsir: "الاستعاذة بالله رب الصبح الذي يَفلق الظلام، فهو قادر على دفع كل شر."
  },
  {
    surahNumber: 113, verseNumber: 2,
    arabic: "مِن شَرِّ مَا خَلَقَ",
    translation: "From the evil of whatever He has created,",
    tafsir: "تحصن من شر جميع المخلوقات visible وغير visible."
  },
  {
    surahNumber: 113, verseNumber: 3,
    arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
    translation: "And from the evil of the night when it grows dark,",
    tafsir: "من شر الليل إذا أظلم وما فيه من المؤذيات."
  },
  {
    surahNumber: 113, verseNumber: 4,
    arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
    translation: "And from the evil of those who blow on knots,",
    tafsir: "من شر السواحر اللاتي ينفثن في العُقد عند السحر."
  },
  {
    surahNumber: 113, verseNumber: 5,
    arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    translation: "And from the evil of an envier when they envy.",
    tafsir: "من شر الحاسد الذي يتمنى زوال النعمة عن غيره، فيؤذي بحسده."
  },
];

// An-Nas (114) - 6 verses
const anNaas: VerseText[] = [
  {
    surahNumber: 114, verseNumber: 1,
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    translation: "Say, I seek refuge in the Lord of mankind,",
    tafsir: "الاستعاذة بالله رب الناس القائم بأمورهم."
  },
  {
    surahNumber: 114, verseNumber: 2,
    arabic: "مَلِكِ النَّاسِ",
    translation: "The Master of mankind,",
    tafsir: "هو المالك المتصرف فيهم تصرف الملوك في رعاياهم."
  },
  {
    surahNumber: 114, verseNumber: 3,
    arabic: "إِلَٰهِ النَّاسِ",
    translation: "The God of mankind,",
    tafsir: "هو المعبود بحق وحده، لا إله غيره."
  },
  {
    surahNumber: 114, verseNumber: 4,
    arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
    translation: "From the evil of the lurking whisperer,",
    tafsir: "من شر الشيطان الذي يوسوس في الصدور ثم يختفي عند ذكر الله."
  },
  {
    surahNumber: 114, verseNumber: 5,
    arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
    translation: "Who whispers into the hearts of humankind,",
    tafsir: "الذي يُلقي الشر في صدور الناس."
  },
  {
    surahNumber: 114, verseNumber: 6,
    arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
    translation: "From among jinn and humankind.",
    tafsir: "الوسواس يكون من الجن ويكون من الإنس، فالاستعاذة تشمل النوعين."
  },
];

// Al-Asr (103) - 3 verses
const alAsr: VerseText[] = [
  {
    surahNumber: 103, verseNumber: 1,
    arabic: "وَالْعَصْرِ",
    translation: "By the time!",
    tafsir: "أقسم الله بالعصر (الزمن) على أن الناس في خسارة."
  },
  {
    surahNumber: 103, verseNumber: 2,
    arabic: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    translation: "Surely humanity is in loss,",
    tafsir: "الإنسان في نقص وخسارة إلا من اجتمع فيه أربع صفات."
  },
  {
    surahNumber: 103, verseNumber: 3,
    arabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    translation: "Except those who have faith, do good, and urge each other to the truth, and urge each other to perseverance.",
    tafsir: "استثنى الله من الخسارة من جمع أربعًا: الإيمان، والعمل الصالح، والتواصي بالحق، والتواصي بالصبر."
  },
];

// Al-Kawthar (108) - 3 verses
const alKawthar: VerseText[] = [
  {
    surahNumber: 108, verseNumber: 1,
    arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
    translation: "Indeed, We have granted you ˹O Prophet˺ abundance.",
    tafsir: "أعطى الله نبيه الكوثر، وهو نهر في الجنة، وأعطاه الخير الكثير في الدنيا والآخرة."
  },
  {
    surahNumber: 108, verseNumber: 2,
    arabic: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
    translation: "So pray and sacrifice to your Lord ˹alone˺.",
    tafsir: "اشكر نعمة ربك بالصلاة والنحر له وحده."
  },
  {
    surahNumber: 108, verseNumber: 3,
    arabic: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
    translation: "Only the one who hates you is ˹truly˺ cut off ˹from any goodness˺.",
    tafsir: "إن مبغضك يا محمد هو المنقطع عن كل خير، وأنت دائم الذكر."
  },
];

// Al-Fil (105) - 5 verses
const alFil: VerseText[] = [
  { surahNumber: 105, verseNumber: 1, arabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ", translation: "Have you not seen ˹O Prophet˺ how your Lord dealt with the Army of the Elephant?", tafsir: "تذكير بقصة أصحاب الفيل الذين أرادوا هدم الكعبة فأهلكهم الله." },
  { surahNumber: 105, verseNumber: 2, arabic: "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ", translation: "Did He not frustrate their scheme?", tafsir: "أبطل مكرهم وأضلَّهم عن مقصودهم." },
  { surahNumber: 105, verseNumber: 3, arabic: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ", translation: "For He sent against them flocks of birds,", tafsir: "أرسل عليهم طيورًا متفرقة Gruppen." },
  { surahNumber: 105, verseNumber: 4, arabic: "تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ", translation: "that pelted them with stones of baked clay,", tafsir: "ترميهم بحجارة من طين متحجر." },
  { surahNumber: 105, verseNumber: 5, arabic: "فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ", translation: "leaving them like chewed up straw.", tafsir: "جعلهم كأوراق الزرع اليابسة المأكولة." },
];

// Quraysh (106) - 4 verses
const quraysh: VerseText[] = [
  { surahNumber: 106, verseNumber: 1, arabic: "لِإِيلَافِ قُرَيْشٍ", translation: "Since the Quraysh are taken under Allāh's protection,", tafsir: "تعودت قريش على رحلتي الشتاء والصيف للأمن والرزق." },
  { surahNumber: 106, verseNumber: 2, arabic: "إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ", translation: "taken under His protection in winter and summer journeys,", tafsir: "تعهدهم برحلتي الشتاء إلى اليمن والصيف إلى الشام." },
  { surahNumber: 106, verseNumber: 3, arabic: "فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ", translation: "let them worship the Lord of this ˹Sacred˺ House.", tafsir: "فليعبدوا الله رب الكعبة الذي أطعمهم من جوع وآمنهم من خوف." },
  { surahNumber: 106, verseNumber: 4, arabic: "الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ", translation: "Who has fed them against hunger and made them secure against fear.", tafsir: "هو الذي أنعم عليهم بالأمن والرخاء فلا يشركون به أحدًا." },
];

// Al-Ma'un (107) - 7 verses
const alMaun: VerseText[] = [
  { surahNumber: 107, verseNumber: 1, arabic: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ", translation: "Have you seen the one who denies the ˹Day of˺ Judgment?", tafsir: "تعجيب من حال من يكذب بالجزاء." },
  { surahNumber: 107, verseNumber: 2, arabic: "فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ", translation: "That is the one who repulses the orphan,", tafsir: "ذلك هو الذي يدفع اليتيم بعنف عن حقه." },
  { surahNumber: 107, verseNumber: 3, arabic: "وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ", translation: "and does not encourage the feeding of the poor.", tafsir: "ولا يحث غيره ولا نفسه على إطعام المحتاج." },
  { surahNumber: 107, verseNumber: 4, arabic: "فَوَيْلٌ لِّلْمُصَلِّينَ", translation: "So woe to those ˹hypocrites˺ who pray,", tafsir: "وعيد شديد للمصلين الذين هم عن صلاتهم ساهون." },
  { surahNumber: 107, verseNumber: 5, arabic: "الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ", translation: "yet are unmindful of their prayers;", tafsir: "الذين يصلون لكنهم يغفلون عنها حتى يخرج وقتها." },
  { surahNumber: 107, verseNumber: 6, arabic: "الَّذِينَ هُمْ يُرَاءُونَ", translation: "those who only show off,", tafsir: "الذين يُصلون ليراهم الناس ولا يصلون لله." },
  { surahNumber: 107, verseNumber: 7, arabic: "وَيَمْنَعُونَ الْمَاعُونَ", translation: "and refuse to give ˹even the simplest˺ aid.", tafsir: "ويمنعون إعارة ما يُنتفع به من الأدوات البسيطة." },
];

// Al-Kafirun (109) - 6 verses
const alKafirun: VerseText[] = [
  { surahNumber: 109, verseNumber: 1, arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", translation: "Say, ˹O Prophet,˺ O you disbelievers!", tafsir: "خطاب للكافرين بإظهار البراءة من دينهم." },
  { surahNumber: 109, verseNumber: 2, arabic: "لَا أَعْبُدُ مَا تَعْبُدُونَ", translation: "I do not worship what you worship,", tafsir: "لا أعبد أصنامكم التي تعبدونها من دون الله." },
  { surahNumber: 109, verseNumber: 3, arabic: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", translation: "nor do you worship what I worship.", tafsir: "ولا أنتم تعبدون الله الذي أعبده." },
  { surahNumber: 109, verseNumber: 4, arabic: "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ", translation: "I will never worship what you worship,", tafsir: "ولا أنا عابد ما عبدتم في المستقبل." },
  { surahNumber: 109, verseNumber: 5, arabic: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", translation: "nor will you ever worship what I worship.", tafsir: "ولا أنتم عابدون ما أعبد في المستقبل." },
  { surahNumber: 109, verseNumber: 6, arabic: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", translation: "You have your way, and I have my Way.", tafsir: "لكم دينكم الذي أصررتم عليه، ولي دين الإسلام الذي أكرمني الله به." },
];

// An-Nasr (110) - 3 verses
const anNasr: VerseText[] = [
  { surahNumber: 110, verseNumber: 1, arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", translation: "When Allah's help comes and the victory ˹over Mecca is achieved˺,", tafsir: "إشارة إلى فتح مكة وعلامات قرب أجل النبي صلى الله عليه وسلم." },
  { surahNumber: 110, verseNumber: 2, arabic: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", translation: "and you ˹O Prophet˺ see people embracing Allah's Way in crowds,", tafsir: "يدخل الناس في دين الله أفواجًا بعد الفتح." },
  { surahNumber: 110, verseNumber: 3, arabic: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", translation: "then glorify the praises of your Lord and seek His forgiveness, for certainly He is ever Accepting of Repentance.", tafsir: "أكثر من التسبيح والتحميد والاستغفار، فإنه قُرب أجلك." },
];

// Al-Masad (111) - 5 verses
const alMasad: VerseText[] = [
  { surahNumber: 111, verseNumber: 1, arabic: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ", translation: "May the hands of Abu Lahab perish, and he ˹himself˺ perish.", tafsir: "دعاء على أبي لهاب بالخسار لما عادى النبي." },
  { surahNumber: 111, verseNumber: 2, arabic: "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ", translation: "Neither his wealth nor ˹worldly˺ gains will benefit him.", tafsir: "لم يدفعه ماله ولا كسبه من عذاب الله." },
  { surahNumber: 111, verseNumber: 3, arabic: "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ", translation: "He will burn in a flaming Fire,", tafsir: "سيدخل نار جهنم المتوقدة." },
  { surahNumber: 111, verseNumber: 4, arabic: "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ", translation: "and ˹so will˺ his wife, the carrier of ˹thorny˺ kindling,", tafsir: "وامرأته كانت تحمل الشوك تؤذي به النبي." },
  { surahNumber: 111, verseNumber: 5, arabic: "فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ", translation: "around her neck will be a rope of palm-fibre.", tafsir: "في عنقها حبل محكم الفتل من الليف." },
];

// Al-Qadr (97) - 5 verses
const alQadr: VerseText[] = [
  { surahNumber: 97, verseNumber: 1, arabic: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", translation: "Indeed, ˹it is˺ We ˹Who˺ sent this ˹Quran˺ down on the Night of Glory.", tafsir: "أنزل الله القرآن في ليلة الشرف والفضل، وهي ليلة القدر في رمضان." },
  { surahNumber: 97, verseNumber: 2, arabic: "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ", translation: "And what will make you realize what the Night of Glory is?", tafsir: "تعظيم لشأن هذه الليلة." },
  { surahNumber: 97, verseNumber: 3, arabic: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ", translation: "The Night of Glory is better than a thousand months.", tafsir: "العمل فيها خير من العمل في ألف شهر خلت منها." },
  { surahNumber: 97, verseNumber: 4, arabic: "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ", translation: "That night the angels and the ˹holy˺ spirit descend, by their Lord's permission, for every ˹decreed˺ matter.", tafsir: "تنزل الملائكة وجبريل فيها بإذن الله بأمر كل خير." },
  { surahNumber: 97, verseNumber: 5, arabic: "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ", translation: "It is all peace until the break of dawn.", tafsir: "هي خير وأمان كلها ليس فيها شر إلى طلوع الفجر." },
];

// Az-Zalzala (99) - 8 verses
const azZalzala: VerseText[] = [
  { surahNumber: 99, verseNumber: 1, arabic: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا", translation: "When the earth is shaken ˹in˺ its final earthquake,", tafsir: "إذا تحركت الأرض تحريكًا شديدًا يوم القيامة." },
  { surahNumber: 99, verseNumber: 2, arabic: "وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا", translation: "and the earth throws out its burdens,", tafsir: "وأخرجت ما في باطنها من الموتى والكنوز." },
  { surahNumber: 99, verseNumber: 3, arabic: "وَقَالَ الْإِنسَانُ مَا لَهَا", translation: "and man cries, What is wrong with it?", tafsir: "يقول الإنسان متعجبًا: ما لها تتحرك؟" },
  { surahNumber: 99, verseNumber: 4, arabic: "يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا", translation: "On that Day, the earth will recount its records,", tafsir: "تشهد الأرض على الناس بما عملوا عليها." },
  { surahNumber: 99, verseNumber: 5, arabic: "بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا", translation: "because your Lord has inspired it ˹to do so˺.", tafsir: "أن الله أمرها بأن تحدث بأخبارها." },
  { surahNumber: 99, verseNumber: 6, arabic: "يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِّيُرَوْا أَعْمَالَهُمْ", translation: "On that Day, people will proceed in separate groups to be shown ˹the outcome of˺ their deeds.", tafsir: "يخرج الناس من قبورهم فرقًا ليشاهدوا أعمالهم." },
  { surahNumber: 99, verseNumber: 7, arabic: "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ", translation: "So whoever does an atom's weight of good will see it.", tafsir: "فمن عمل خيرًا قَدْرَ الذرة يَرَ ثوابه." },
  { surahNumber: 99, verseNumber: 8, arabic: "وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ", translation: "And whoever does an atom's weight of evil will see it.", tafsir: "ومن عمل شرًا قَدْرَ الذرة يَرَ عقابه." },
];

// Al-Adiyat (100) - 11 verses
const alAdiyat: VerseText[] = [
  { surahNumber: 100, verseNumber: 1, arabic: "وَالْعَادِيَاتِ ضَبْحًا", translation: "By the galloping, panting horses,", tafsir: "قسم بخيل المغازين التي تلهث من العدو." },
  { surahNumber: 100, verseNumber: 2, arabic: "فَالْمُورِيَاتِ قَدْحًا", translation: "striking sparks of fire ˹with their hoofs˺,", tafsir: "التي تُنير النار بحوافرها من الصخر." },
  { surahNumber: 100, verseNumber: 3, arabic: "فَالْمُغِيرَاتِ صُبْحًا", translation: "raiding at dawn,", tafsir: "الهجمات على الأعداء وقت الصباح." },
  { surahNumber: 100, verseNumber: 4, arabic: "فَأَثَرْنَ بِهِ نَقْعًا", translation: "raising clouds of dust,", tafsir: "فأثرن غبارًا بكثرة العَدْو." },
  { surahNumber: 100, verseNumber: 5, arabic: "فَوَسَطْنَ بِهِ جَمْعًا", translation: "and penetrating together into the midst of the enemy.", tafsir: "فوزن وسط جموع الأعداء." },
  { surahNumber: 100, verseNumber: 6, arabic: "إِنَّ الْإِنسَانَ لِرَبِّهِ لَكَنُودٌ", translation: "Surely humankind is ungrateful to their Lord,", tafsir: "الإنسان جحود لنعم ربه كثير الكفران." },
  { surahNumber: 100, verseNumber: 7, arabic: "وَإِنَّهُ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ", translation: "and they themselves agree to this.", tafsir: "وشاهد على نفسه بذلك." },
  { surahNumber: 100, verseNumber: 8, arabic: "وَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ", translation: "And truly, they are excessively demanding of ˹worldly˺ wealth.", tafsir: "إنه لحب المال شديد الحرص." },
  { surahNumber: 100, verseNumber: 9, arabic: "أَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِي الْقُبُورِ", translation: "Do they not know ˹that˺ when the contents of graves are spilled out,", tafsir: "ألا يعلم حين تُقلب القبور وتُخرج الموتى؟" },
  { surahNumber: 100, verseNumber: 10, arabic: "وَحُصِّلَ مَا فِي الصُّدُورِ", translation: "and ˹the secrets˺ stored in hearts are uncovered—", tafsir: "ويُستخرج ما في الصدور من النيات." },
  { surahNumber: 100, verseNumber: 11, arabic: "إِنَّ رَبَّهُم بِهِمْ يَوْمَئِذٍ لَّخَبِيرٌ", translation: "on that Day their Lord will certainly know everything about them.", tafsir: "إن ربهم يومئذٍ عالم بأعمالهم ونيّاتهم فيجازيهم عليها." },
];

// Al-Qari'a (101) - 11 verses
const alQaria: VerseText[] = [
  { surahNumber: 101, verseNumber: 1, arabic: "الْقَارِعَةُ", translation: "The Striking Hour!", tafsir: "القيامة لأنها تقرع القلوب بأهوالها." },
  { surahNumber: 101, verseNumber: 2, arabic: "مَا الْقَارِعَةُ", translation: "What is the Striking Hour?", tafsir: "تفخيم لشأنها." },
  { surahNumber: 101, verseNumber: 3, arabic: "وَمَا أَدْرَاكَ مَا الْقَارِعَةُ", translation: "What do you know what the Striking Hour is?", tafsir: "توكيد لشناعتها." },
  { surahNumber: 101, verseNumber: 4, arabic: "يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ", translation: "˹It is˺ a Day when people will be like scattered moths.", tafsir: "في تفرقهم وذهابهم ومجيئهم من هول ما يرون." },
  { surahNumber: 101, verseNumber: 5, arabic: "وَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنفُوشِ", translation: "And the mountains will be like carded wool.", tafsir: "كالصوف المتناثر في خفّتها وذهابها." },
  { surahNumber: 101, verseNumber: 6, arabic: "فَأَمَّا مَن ثَقُلَتْ مَوَازِينُهُ", translation: "So as for those whose scale ˹of good deeds˺ is heavy,", tafsir: "من رجحت حسناته على سيئاته." },
  { surahNumber: 101, verseNumber: 7, arabic: "فَهُوَ فِي عِيشَةٍ رَّاضِيَةٍ", translation: "they will be in a pleasant life.", tafsir: "في نعيم مقيم راضٍ." },
  { surahNumber: 101, verseNumber: 8, arabic: "وَأَمَّا مَنْ خَفَّتْ مَوَازِينُهُ", translation: "But as for those whose scale is light,", tafsir: "من خفت حسناته." },
  { surahNumber: 101, verseNumber: 9, arabic: "فَأُمُّهُ هَاوِيَةٌ", translation: "they will be in the Bottomless Pit.", tafsir: "فمأواه الهاوية وهي جهنم." },
  { surahNumber: 101, verseNumber: 10, arabic: "وَمَا أَدْرَاكَ مَا هِيَهْ", translation: "And what will make you realize what that is?", tafsir: "تفخيم لشدتها." },
  { surahNumber: 101, verseNumber: 11, arabic: "نَارٌ حَامِيَةٌ", translation: "A raging Fire!", tafsir: "نار شديدة الحرارة." },
];

// At-Takathur (102) - 8 verses
const atTakathur: VerseText[] = [
  { surahNumber: 102, verseNumber: 1, arabic: "أَلْهَاكُمُ التَّكَاثُرُ", translation: "Rivalry for worldly gains distracts you", tafsir: "شغلكم التفاخر بكثرة المال والعدد عن طاعة الله." },
  { surahNumber: 102, verseNumber: 2, arabic: "حَتَّىٰ زُرْتُمُ الْمَقَابِرَ", translation: "until you come to ˹your˺ graves.", tafsir: "حتى تموتوا وتُدفنوا في القبور." },
  { surahNumber: 102, verseNumber: 3, arabic: "كَلَّا سَوْفَ تَعْلَمُونَ", translation: "But no! You will soon know.", tafsir: "ردع لهم عن ذلك، وسيعلمون سوء عاقبته." },
  { surahNumber: 102, verseNumber: 4, arabic: "ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ", translation: "Again, no! You will soon know.", tafsir: "توكيد للوعيد." },
  { surahNumber: 102, verseNumber: 5, arabic: "كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ", translation: "Indeed, if you were to know ˹your fate˺ with absolute certainty...", tafsir: "لو تعلمون علم اليقين لما ألهاكم التكاثر." },
  { surahNumber: 102, verseNumber: 6, arabic: "لَتَرَوُنَّ الْجَحِيمَ", translation: "you would surely see the Hellfire.", tafsir: "لترونها رأي العين يوم القيامة." },
  { surahNumber: 102, verseNumber: 7, arabic: "ثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ", translation: "Then you will surely see it with the ˹eye of˺ certainty.", tafsir: "رؤية يقين لا شك فيها." },
  { surahNumber: 102, verseNumber: 8, arabic: "ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ", translation: "Then on that Day you will definitely be questioned about ˹your worldly˺ pleasures.", tafsir: "تُسألون عن شكر النعم التي أنعم الله بها عليكم." },
];

// Al-Humaza (104) - 9 verses
const alHumaza: VerseText[] = [
  { surahNumber: 104, verseNumber: 1, arabic: "وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ", translation: "Woe to every ˹scandal-monger and˺ backbiter,", tafsir: "وعيد شديد لمن يطعن في الناس ويغتابهم." },
  { surahNumber: 104, verseNumber: 2, arabic: "الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ", translation: "who gathers wealth ˹greedily˺ and counts ˹it˺ repeatedly,", tafsir: "الذي يجمع المال ويعدده خوفًا من فواته." },
  { surahNumber: 104, verseNumber: 3, arabic: "يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ", translation: "thinking that his wealth will make him live forever.", tafsir: "يظن أن ماله يخلده في الدنيا." },
  { surahNumber: 104, verseNumber: 4, arabic: "كَلَّا ۖ لَيُنبَذَنَّ فِي الْحُطَمَةِ", translation: "But no! He will surely be thrown into the Crusher.", tafsir: "ليُطرحن في النار المحطمة." },
  { surahNumber: 104, verseNumber: 5, arabic: "وَمَا أَدْرَاكَ مَا الْحُطَمَةُ", translation: "And what will make you realize what the Crusher is?", tafsir: "تفخيم لأمرها." },
  { surahNumber: 104, verseNumber: 6, arabic: "نَارُ اللَّهِ الْمُوقَدَةُ", translation: "˹It is˺ Allah's kindled Fire,", tafsir: "هي نار الله الموقدة على أهلها." },
  { surahNumber: 104, verseNumber: 7, arabic: "الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ", translation: "that rises over the hearts.", tafsir: "تعلو على القلوب فتحرقها من شدتها." },
  { surahNumber: 104, verseNumber: 8, arabic: "إِنَّهَا عَلَيْهِم مُّؤْصَدَةٌ", translation: "It will close in on them,", tafsir: "مطبقة عليهم لا يخرجون منها." },
  { surahNumber: 104, verseNumber: 9, arabic: "فِي عَمَدٍ مُّمَدَّدَةٍ", translation: "in extended columns.", tafsir: "في عمد طوال ممدودة عليهم." },
];

// At-Tin (95) - 8 verses
const atTin: VerseText[] = [
  { surahNumber: 95, verseNumber: 1, arabic: "وَالتِّينِ وَالزَّيْتُونِ", translation: "By the fig and the olive,", tafsir: "قسم بالتين والزيتون، وهما من نعم الله." },
  { surahNumber: 95, verseNumber: 2, arabic: "وَطُورِ سِينِينَ", translation: "and by Mount Sinai,", tafsir: "وقسم بطور سينين الذي كلم الله عليه موسى." },
  { surahNumber: 95, verseNumber: 3, arabic: "وَهَٰذَا الْبَلَدِ الْأَمِينِ", translation: "and by this secure city ˹of Mecca˺!", tafsir: "وقسم بمكة الآمنة." },
  { surahNumber: 95, verseNumber: 4, arabic: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ", translation: "Indeed, We created humans in the finest design.", tafsir: "خلقنا الإنسان في أحسن صورة." },
  { surahNumber: 95, verseNumber: 5, arabic: "ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ", translation: "then We reduced them to the lowest of the low.", tafsir: "إلا من آمن وعمل صالحًا، فنرده إلى أسفل النار." },
  { surahNumber: 95, verseNumber: 6, arabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ", translation: "except those who have faith and do good—their reward will be never-ending.", tafsir: "استثنى المؤمنين العاملين الصالحات فلهم أجر لا ينقطع." },
  { surahNumber: 95, verseNumber: 7, arabic: "فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ", translation: "So, after this, what makes you ˹O Prophet˺ deny the ˹final˺ Judgment?", tafsir: "ما الذي يحملك على التكذيب بالجزاء بعد هذه الأدلة؟" },
  { surahNumber: 95, verseNumber: 8, arabic: "أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ", translation: "Is Allah not the Wisest of the judges?", tafsir: "أليس الله بأحكم الحاكمين في تدبيره وخلقه؟" },
];

// Al-Alaq (96) - 19 verses (only first 5)
const alAlaq: VerseText[] = [
  { surahNumber: 96, verseNumber: 1, arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ", translation: "Read, ˹O Prophet,˺ in the Name of your Lord Who created.", tafsir: "أول ما نزل من القرآن، أمر بالقراءة باسم الله الخالق." },
  { surahNumber: 96, verseNumber: 2, arabic: "خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ", translation: "created humans from a clinging clot.", tafsir: "خلق الإنسان من علقة وهي الدم الجامد." },
  { surahNumber: 96, verseNumber: 3, arabic: "اقْرَأْ وَرَبُّكَ الْأَكْرَمُ", translation: "Read! And your Lord is the Most Generous,", tafsir: "اقرأ وربك الأكرم في إنعامه." },
  { surahNumber: 96, verseNumber: 4, arabic: "الَّذِي عَلَّمَ بِالْقَلَمِ", translation: "Who taught by the pen,", tafsir: "الذي علم خلقه الكتابة بالقلم." },
  { surahNumber: 96, verseNumber: 5, arabic: "عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ", translation: "taught humanity what they knew not.", tafsir: "علم الإنسان ما لم يكن يعلم قبل ذلك." },
];

// Ash-Sharh (94) - 8 verses
const ashSharh: VerseText[] = [
  { surahNumber: 94, verseNumber: 1, arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", translation: "Did We not expand your heart for you ˹O Prophet˺?", tafsir: "ألم نشرح صدرك لقبول الووح والإسلام؟" },
  { surahNumber: 94, verseNumber: 2, arabic: "وَوَضَعْنَا عَنكَ وِزْرَكَ", translation: "and relieve you of your burden,", tafsir: "وحططنا عنك ذنوبك." },
  { surahNumber: 94, verseNumber: 3, arabic: "الَّذِي أَنقَضَ ظَهْرَكَ", translation: "which weighed down your back,", tafsir: "الذي كان يثقل ظهرك." },
  { surahNumber: 94, verseNumber: 4, arabic: "وَرَفَعْنَا لَكَ ذِكْرَكَ", translation: "and elevated your mention for you?", tafsir: "رفعنا ذكرك في الدنيا والآخرة." },
  { surahNumber: 94, verseNumber: 5, arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "So, surely with hardship comes ease.", tafsir: "لا يغلب عسر يسرين، فمع كل عسر يسر." },
  { surahNumber: 94, verseNumber: 6, arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Truly, with hardship comes ease.", tafsir: "توكيد بأن اليسر يأتي مع العسر." },
  { surahNumber: 94, verseNumber: 7, arabic: "فَإِذَا فَرَغْتَ فَانصَبْ", translation: "So once you have finished ˹your duties˺, then stand ˹for worship˺.", tafsir: "إذا فرغت من شغلك فانصب في الطاعة." },
  { surahNumber: 94, verseNumber: 8, arabic: "وَإِلَىٰ رَبِّكَ فَارْغَب", translation: "and to your Lord turn ˹all˺ your hopes.", tafsir: "وأخلص رغبتك إلى ربك." },
];

// Ad-Duha (93) - 11 verses
const adDuha: VerseText[] = [
  { surahNumber: 93, verseNumber: 1, arabic: "وَالضُّحَىٰ", translation: "By the morning sunlight,", tafsir: "قسم بضوء النهار." },
  { surahNumber: 93, verseNumber: 2, arabic: "وَاللَّيْلِ إِذَا سَجَىٰ", translation: "and by the night when it falls still!", tafsir: "وقسم بالليل إذا سكن بأهله." },
  { surahNumber: 93, verseNumber: 3, arabic: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", translation: "Your Lord ˹O Prophet˺ has not abandoned you, nor does He hate you.", tafsir: "رد على من قال إن ربك قلاك حين فتر الوحي." },
  { surahNumber: 93, verseNumber: 4, arabic: "وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ", translation: "And the next life is certainly far better for you than this life.", tafsir: "والآخرة خير لك من الدنيا." },
  { surahNumber: 93, verseNumber: 5, arabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", translation: "Soon your Lord will give you so much that you will be well pleased.", tafsir: "سيعطيك ربك حتى ترضى." },
  { surahNumber: 93, verseNumber: 6, arabic: "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ", translation: "Did He not find you ˹O Prophet˺ an orphan, and give you a home?", tafsir: "كنت يتيمًا فآواك بعمك أبي طالب." },
  { surahNumber: 93, verseNumber: 7, arabic: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ", translation: "Did He not find you lost, and guide you?", tafsir: "ووجدك لا تعرف الكتاب ولا الإيمان فهداك إلى الإسلام." },
  { surahNumber: 93, verseNumber: 8, arabic: "وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ", translation: "Did He not find you in need, and make you self-sufficient?", tafsir: "ووجدك فقيرًا فأغناك بما رزقك." },
  { surahNumber: 93, verseNumber: 9, arabic: "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ", translation: "So do not oppress the orphan,", tafsir: "فلا تَقْهر اليتيم كما كنت تُقهر." },
  { surahNumber: 93, verseNumber: 10, arabic: "وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ", translation: "nor repulse the beggar.", tafsir: "ولا تَنهر السائل." },
  { surahNumber: 93, verseNumber: 11, arabic: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ", translation: "And proclaim the blessings of your Lord.", tafsir: "وتحدث بنعم الله عليك شكرًا له." },
];

// Al-Baqarah - first 5 verses (with Bismillah as verse 1)
const alBaqarahStart: VerseText[] = [
  {
    surahNumber: 2, verseNumber: 1,
    arabic: "الٓمٓ",
    translation: "Alif-Lãm-Mĩm.",
    tafsir: "حروف مقطعة في فواتح السور، للدلالة على إعجاز القرآن، وقد اختلف العلماء في معناها والأرجح أن الله استأثر بعلمها."
  },
  {
    surahNumber: 2, verseNumber: 2,
    arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
    translation: "This is the Book! There is no doubt about it—a guide for those mindful ˹of Allah˺.",
    tafsir: "هذا القرآن لا شك في أنه من عند الله، هدى للمتقين الذين يتقون الشرك والمعاصي."
  },
  {
    surahNumber: 2, verseNumber: 3,
    arabic: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
    translation: "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
    tafsir: "يصف المتقين بأنهم يؤمنون بما غاب عنهم مما أخبر به الله، ويقيمون الصلاة بأركانها، ويتصدقون مما رزقهم الله."
  },
  {
    surahNumber: 2, verseNumber: 4,
    arabic: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
    translation: "and who believe in what is revealed to you ˹O Prophet˺ and what was revealed before you, and have sure faith in the Hereafter.",
    tafsir: "يؤمنون بالقرآن وبالكتب السابقة كالتوراة والإنجيل، ويوقنون بالبعث والحساب."
  },
  {
    surahNumber: 2, verseNumber: 5,
    arabic: "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
    translation: "It is they who are ˹truly˺ guided by their Lord, and it is they who will be successful.",
    tafsir: "هؤلاء على نور من ربهم، وهم الفائزون بالنعيم في الدارين."
  },
];

// An-Naba (78) - 40 verses
const anNaba: VerseText[] = [
  { surahNumber: 78, verseNumber: 1, arabic: "عَمَّ يَتَسَاءَلُونَ", translation: "What are they asking one another?", tafsir: "استفهام عن الذي يتساءل عنه المشركون." },
  { surahNumber: 78, verseNumber: 2, arabic: "عَنِ النَّبَإِ الْعَظِيمِ", translation: "˹About˺ the great news,", tafsir: "عن البعث الذي يختلفون فيه." },
  { surahNumber: 78, verseNumber: 3, arabic: "الَّذِي هُمْ فِيهِ مُخْتَلِفُونَ", translation: "about which they dispute.", tafsir: "الذي اختلفوا فيه فمصدق ومكذب." },
  { surahNumber: 78, verseNumber: 4, arabic: "كَلَّا سَيَعْلَمُونَ", translation: "But no! They will soon know.", tafsir: "ردع لهم، سيعلمون ما يحل بهم." },
  { surahNumber: 78, verseNumber: 5, arabic: "ثُمَّ كَلَّا سَيَعْلَمُونَ", translation: "Again, no! They will soon know.", tafsir: "توكيد للوعيد." },
];

export const VERSES: VerseText[] = [
  ...alFatihah,
  ...alBaqarahStart,
  ...adDuha,
  ...ashSharh,
  ...atTin,
  ...alAlaq,
  ...alQadr,
  ...azZalzala,
  ...alAdiyat,
  ...alQaria,
  ...atTakathur,
  ...alAsr,
  ...alHumaza,
  ...alFil,
  ...quraysh,
  ...alMaun,
  ...alKawthar,
  ...alKafirun,
  ...anNasr,
  ...alMasad,
  ...alIkhlas,
  ...alFalaq,
  ...anNaas,
  ...anNaba,
  // Extended surahs from separate files
  ...YASEEN_VERSES,
  ...AR_RAHMAN_VERSES,
  ...AL_MULK_VERSES,
];

// Index for fast lookup
export const VERSE_INDEX: Map<string, VerseText> = new Map(
  VERSES.map((v) => [`${v.surahNumber}:${v.verseNumber}`, v])
);

export function getVerseText(surahNumber: number, verseNumber: number): VerseText | undefined {
  return VERSE_INDEX.get(`${surahNumber}:${verseNumber}`);
}
