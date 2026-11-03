export type Verse = {
  id: string;
  surah: number;
  ayah: number;
  surahName: string;
  arabic: string;
  translation: string;
  excerpt?: boolean;
  themes: string[];
  reflection: string;
  source: string;
};

export const verses: Verse[] = [
  {
    id: "13-28",
    surah: 13,
    ayah: 28,
    surahName: "Ar-Ra’d surasi",
    arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُمْ بِذِكْرِ اللَّهِ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation: "Iymon keltirgan va qalblari Alloh zikri bilan orom topadigan kimsalar… Ogoh bo‘ling! Qalblar Allohni zikr qilish bilan orom topur.",
    themes: ["sokinlik", "tashvish", "zikr", "iymon"],
    reflection: "Bugun qalbingizni bir lahza shovqindan ajratib, zikrga qaytaring.",
    source: "https://quran.com/13/28",
  },
  {
    id: "2-152",
    surah: 2,
    ayah: 152,
    surahName: "Al-Baqarah surasi",
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "Bas, Meni eslangizki, Men ham sizni eslayman. Menga shukr qilingiz va noshukrlik qilmangiz.",
    themes: ["shukr", "zikr", "iymon"],
    reflection: "Eslash va shukr qilishni bugungi bitta kichik amal bilan bog‘lang.",
    source: "https://quran.com/2/152",
  },
  {
    id: "65-3",
    surah: 65,
    ayah: 3,
    surahName: "At-Taloq surasi",
    arabic: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا",
    translation: "Va unga o‘zi o‘ylamagan tomondan rizq berur. Kim Allohga tavakkal qilsa, U zot unga kifoya qilur. Albatta, Alloh o‘z ishini yetkazuvchidir. Alloh har bir narsaga o‘lchov belgilagandir.",
    themes: ["tavakkal", "tashvish", "sabr", "iymon"],
    reflection: "Harakat qilish va natijani Allohga topshirish orasidagi farqni o‘ylang.",
    source: "https://quran.com/65/3",
  },
  {
    id: "94-6",
    surah: 94,
    ayah: 6,
    surahName: "Ash-Sharh surasi",
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Albatta, qiyinchilik bilan birga osonlik ham bor.",
    themes: ["umid", "sabr", "qiyinchilik", "sokinlik"],
    reflection: "Qiyinchilik ichidagi kichik yengillikni bugun nomlab bering.",
    source: "https://quran.com/94/6",
  },
  {
    id: "14-7",
    surah: 14,
    ayah: 7,
    surahName: "Ibrohim surasi",
    arabic: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِنْ كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ",
    translation: "Eslingiz, Robbingiz: “Agar shukr qilsangiz, albatta, sizga ko‘proq berurman. Agar noshukrlik qilsangiz, albatta, azobim qattiqdir”, deb e’lon qilgan edi.",
    themes: ["shukr", "ne'mat", "baraka"],
    reflection: "Odatiy ko‘ringan bir ne’matga yangi nigoh bilan qarang.",
    source: "https://quran.com/14/7",
  },
  {
    id: "17-36",
    surah: 17,
    ayah: 36,
    surahName: "Al-Isro surasi",
    arabic: "وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِ عِلْمٌ إِنَّ السَّمْعَ وَالْبَصَرَ وَالْفُؤَادَ كُلُّ أُولَئِكَ كَانَ عَنْهُ مَسْئُولًا",
    translation: "Bilimingiz bo‘lmagan narsaning ortidan ergashmang. Albatta, quloq, ko‘z va qalb — bularning barchasi so‘roq qilinur.",
    themes: ["ilm", "ehtiyot", "mas'uliyat", "tafakkur"],
    reflection: "Bugun eshitgan bitta xabaringizni tekshirishga vaqt ajrating.",
    source: "https://quran.com/17/36",
  },
  {
    id: "29-69",
    surah: 29,
    ayah: 69,
    surahName: "Al-Ankabut surasi",
    arabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا",
    translation: "Bizning yo‘limizda intilganlarni albatta o‘z yo‘llarimizga yetaklaymiz.",
    excerpt: true,
    themes: ["maqsad", "harakat", "iymon", "rivojlanish"],
    reflection: "Yo‘l ochilishini kutishdan oldin qo‘lingizdan kelgan kichik qadamni tanlang.",
    source: "https://quran.com/29/69",
  },
  {
    id: "54-17",
    surah: 54,
    ayah: 17,
    surahName: "Al-Qamar surasi",
    arabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِنْ مُدَّكِرٍ",
    translation: "Biz Qur’onni ibrat olish uchun oson qildik. Unda, ibrat oluvchi bormi?",
    themes: ["qur'on", "ilm", "tafakkur", "ibrat"],
    reflection: "Bitta oyatni shoshilmasdan o‘qib, sizda uyg‘otgan savolni yozing.",
    source: "https://quran.com/54/17",
  },
];

export type KnowledgeCategory =
  | "Islomiy bilimlar"
  | "Qur’on va tafsir"
  | "Payg‘ambarlar qissalari"
  | "Tarix"
  | "Shaxsiy rivojlanish"
  | "Hayotiy hikmatlar";

export type Article = {
  id: string;
  category: KnowledgeCategory;
  title: string;
  excerpt: string;
  minutes: number;
  level: "Boshlang‘ich" | "Chuqurroq";
  themes: string[];
  sourceLabel: string;
  sourceUrl?: string;
  sections: { heading: string; body: string }[];
  question: string;
};

export const categories: { name: KnowledgeCategory; description: string; index: string }[] = [
  { name: "Islomiy bilimlar", description: "Iymon, ibodat va kundalik hayotning asosiy tushunchalari.", index: "01" },
  { name: "Qur’on va tafsir", description: "Oyatni konteksti bilan o‘qish va mas’uliyatli o‘rganish yo‘li.", index: "02" },
  { name: "Payg‘ambarlar qissalari", description: "Sabr, ishonch va insoniylikdan olinadigan ibratlar.", index: "03" },
  { name: "Tarix", description: "Ilm, madaniyat va musulmonlar merosidan tanlangan sahifalar.", index: "04" },
  { name: "Shaxsiy rivojlanish", description: "Maqsad, odat va diqqatni shafqatsiz bosimsiz shakllantirish.", index: "05" },
  { name: "Hayotiy hikmatlar", description: "Mehr, adolat, sabr va o‘zini anglash haqida mulohazalar.", index: "06" },
];

export const articles: Article[] = [
  {
    id: "niyat-va-amal",
    category: "Islomiy bilimlar",
    title: "Niyat: kichik amalga ma’no beruvchi ichki yo‘nalish",
    excerpt: "Niyatni bir martalik qaror emas, amal davomida yangilanadigan diqqat sifatida anglash.",
    minutes: 5,
    level: "Boshlang‘ich",
    themes: ["niyat", "iymon", "maqsad"],
    sourceLabel: "Sahih al-Buxoriy, 1-hadis — “Amallar niyatlarga bog‘liq”",
    sourceUrl: "https://sunnah.com/bukhari:1",
    sections: [
      { heading: "Ichki yo‘nalish", body: "Niyat amalning ko‘rinishidan oldin uning yo‘nalishini belgilaydi. Bir xil tashqi harakat turli ichki sabablar bilan bajarilishi mumkin. Shu bois niyat haqida o‘ylash — o‘zini ayblash emas, nima uchun shu qadamni qilayotganini rostgo‘ylik bilan ko‘rishdir." },
      { heading: "Mukammallik kutmaslik", body: "Sof niyatga erishish uchun barcha shubhalar yo‘qolishini kutish shart emas. Inson niyatini payqab, uni yangilab, amalni davom ettira oladi. Kichik, lekin ongli bajarilgan ish ba’zan katta, lekin ko‘rsatish uchun qilingan ishga qaraganda ko‘proq ichki iz qoldiradi." },
      { heading: "Bugungi amaliyot", body: "Bitta kundalik ishingizni tanlang: o‘qish, oilaga yordam yoki mehnat. Boshlashdan oldin besh soniya to‘xtab, “Bu amal kimlardir foydasiga va qanday yaxshilikka xizmat qiladi?” deb so‘rang. Javobni kundalikka bitta jumla bilan yozing." },
    ],
    question: "Bugun qaysi odatiy amalingizga yangi ma’no bera olasiz?",
  },
  {
    id: "tavakkal-harakat",
    category: "Islomiy bilimlar",
    title: "Tavakkal va harakat: ikki tushuncha, bir muvozanat",
    excerpt: "Tavakkalni passivlik bilan aralashtirmasdan, sabab va natijaga sog‘lom munosabat.",
    minutes: 6,
    level: "Boshlang‘ich",
    themes: ["tavakkal", "tashvish", "harakat"],
    sourceLabel: "At-Tirmiziy, 2517 — tavakkal haqidagi mashhur hadis",
    sourceUrl: "https://sunnah.com/tirmidhi:2517",
    sections: [
      { heading: "Harakatdan voz kechish emas", body: "Tavakkal o‘z ulushini bajarib, natijani mutlaq nazorat qila olmaslikni tan olishdir. Reja tuzish, maslahat so‘rash, mehnat qilish va xatodan o‘rganish bu ishonchga zid emas. Aksincha, ular insonning javobgar qismini ifodalaydi." },
      { heading: "Nazorat chegarasi", body: "Tashvish ko‘pincha natijani oldindan kafolatlash istagidan tug‘iladi. “Bugun mening qo‘limdan nima keladi?” va “Nima mening ixtiyorimda emas?” degan ikki savol chegarani aniqlashtiradi. Bu fikriy mashq diniy hukm emas, diqqatni amaliy qadamga qaytaruvchi vosita." },
      { heading: "Bir qadam", body: "Sizni band qilgan vaziyatni yozing. Yoniga bajarishingiz mumkin bo‘lgan eng kichik harakatni qo‘shing: xat yozish, vaqt belgilash yoki bilimli insondan so‘rash. Qolgan qismini esa sabr va dua bilan kuzating." },
    ],
    question: "Nazorat qila olmaydigan narsani qo‘yib yuborsangiz, qaysi foydali qadam ko‘rinadi?",
  },
  {
    id: "oyatni-kontekstda",
    category: "Qur’on va tafsir",
    title: "Bitta oyatni kontekstdan ajratmasdan o‘qish",
    excerpt: "Oldingi va keyingi oyatlar, suraning umumiy mavzusi hamda ishonchli tafsirga murojaat.",
    minutes: 8,
    level: "Boshlang‘ich",
    themes: ["qur'on", "ilm", "ehtiyot"],
    sourceLabel: "Qur’on 17:36 — bilmagan narsa ortidan ergashmaslik haqida",
    sourceUrl: "https://quran.com/17/36",
    sections: [
      { heading: "Matn yolg‘iz gapirmaydi", body: "Oyat suraning nutqi ichida joylashadi. Undan oldin va keyin nima aytilganini ko‘rish ma’noni aniqlashtirishga yordam beradi. Qisqa iqtibos ilhom berishi mumkin, ammo murakkab diniy xulosa chiqarish uchun yetarli asos bo‘la olmaydi." },
      { heading: "To‘rt ehtiyotkor qadam", body: "Avval arabcha matn va ishonchli tarjimani solishtiring. So‘ng atrofdagi oyatlarni o‘qing. Keyin tan olingan tafsir manbasiga murojaat qiling. Nihoyat, noaniq joyni savol sifatida saqlang; bilmaslikni tan olish bilimning bir qismidir." },
      { heading: "Amaliy chegara", body: "SUKUN ma’nolarni o‘rganishga ko‘maklashadi, lekin mustaqil tafsir yoki fatvo bermaydi. Ayniqsa oilaviy, moliyaviy va shariatga oid aniq masalalarda malakali, ishonchli ustozga murojaat qilish lozim." },
    ],
    question: "Keyingi o‘qishingizda qaysi bitta kontekst qadamini qo‘shasiz?",
  },
  {
    id: "sura-tuzilishi",
    category: "Qur’on va tafsir",
    title: "Surani o‘qishda takror, savol va ohangga e’tibor",
    excerpt: "Matndagi badiiy tuzilmani kuzatish diqqatni chuqurlashtiradi; bu tafsirning o‘rnini bosmaydi.",
    minutes: 7,
    level: "Chuqurroq",
    themes: ["qur'on", "tafakkur", "diqqat"],
    sourceLabel: "Ar-Rahmon surasi — takroriy savolga misol",
    sourceUrl: "https://quran.com/55",
    sections: [
      { heading: "Takror nima qiladi?", body: "Ba’zi suralarda ibora yoki savol qayta-qayta keladi. O‘qish paytida takror paydo bo‘ladigan joylarni belgilash matnning ritmini sezdiradi. Ar-Rahmon surasidagi ne’matlar haqidagi takroriy savol bunga yaqqol misoldir." },
      { heading: "Kuzatuv va xulosa farqi", body: "“Bu so‘z takrorlangan” — kuzatuv. “Bu takrorning yagona ma’nosi shu” — asos talab qiladigan xulosa. Birinchisini mustaqil qilish mumkin; ikkinchisi uchun arab tili, rivoyat va tafsir bilimi zarur. Farqni bilish o‘quvchini ehtiyotkor qiladi." },
      { heading: "Sokin o‘qish jadvali", body: "Qisqa parchani tanlang. Birinchi o‘qishda faqat tinglang, ikkinchisida takror va savollarni belgilang, uchinchisida tarjima bilan solishtiring. Yakunda bitta savol yozing; javob topishga shoshilmang." },
    ],
    question: "Matnda qaysi takror diqqatingizni o‘ziga qaytardi?",
  },
  {
    id: "ayyub-sabri",
    category: "Payg‘ambarlar qissalari",
    title: "Ayyub alayhissalom: sinov ichida yo‘qotilmagan munosabat",
    excerpt: "Qur’ondagi qisqa, ammo chuqur sahna orqali sabr va shikoyat haqida mulohaza.",
    minutes: 6,
    level: "Boshlang‘ich",
    themes: ["sabr", "qiyinchilik", "umid"],
    sourceLabel: "Qur’on 21:83–84 va 38:41–44",
    sourceUrl: "https://quran.com/21/83",
    sections: [
      { heading: "Qur’ondagi sahna", body: "Al-Anbiyo surasida Ayyub alayhissalomning og‘ir sinovda Rabbiga murojaat qilgani zikr etiladi. U og‘riqni inkor qilmaydi, lekin murojaatini Allohning rahmati bilan bog‘laydi. Bu sabrni his-tuyg‘usizlik emas, sinov ichidagi munosabat sifatida ko‘rsatadi." },
      { heading: "Sabr va yordam so‘rash", body: "Qissadan olinadigan ehtiyotkor ibrat — og‘riqli paytda ham yordamga ochiq qolish mumkin. Diniy dua, yaqin inson bilan suhbat va zarur bo‘lsa mutaxassis yordami bir-birini inkor etmaydi. Og‘ir ruhiy holatni faqat “sabr qil” degan so‘z bilan kichraytirish to‘g‘ri emas." },
      { heading: "Hikoya haqida chegara", body: "Qissalarni o‘qishda Qur’onda aytilmagan tafsilotlarni aniq voqea sifatida qo‘shmaslik kerak. Manbani ko‘rsatish va ibratni matndan ajratib ifodalash hikoyaga bo‘lgan hurmatdir." },
    ],
    question: "Bugun qanday yordamni qabul qilishga o‘zingizga ruxsat bera olasiz?",
  },
  {
    id: "yusuf-eyub",
    category: "Payg‘ambarlar qissalari",
    title: "Yusuf alayhissalom qissasida vaqt, ehtiyot va afv",
    excerpt: "Kutilmagan burilishlarda axloqni saqlash va kuch kelganda kechirish tanlovi.",
    minutes: 8,
    level: "Boshlang‘ich",
    themes: ["afv", "sabr", "ehtiyot", "umid"],
    sourceLabel: "Qur’on, Yusuf surasi — ayniqsa 12:90–92",
    sourceUrl: "https://quran.com/12/90",
    sections: [
      { heading: "Suraning yaxlitligi", body: "Yusuf surasi voqealarni alohida ibrat parchalari sifatida emas, bir-biri bilan bog‘langan uzoq hayot yo‘li sifatida bayon qiladi. Tush, sinov, qamoq, mas’uliyat va oilaviy uchrashuv bitta keng hikoyada joy oladi." },
      { heading: "Afv — zaiflik emas", body: "Sura oxiridagi uchrashuvda o‘tmishdagi jarohat oddiy gap bilan unutilmaydi; u kuch va imkoniyat paytidagi axloqiy tanlovga olib keladi. Afv haqidagi mulohaza har bir shaxsiy vaziyatga avtomatik hukm qo‘ymaydi: xavfsizlik va adolat ham muhim." },
      { heading: "Bugungi ibrat", body: "O‘tmishdagi bitta qiyin bosqichni yozing. Unda o‘rgangan bilimingizni va hali davolanmagan joyingizni alohida belgilang. O‘sish ham, yarali joyni tan olish ham bir vaqtda mavjud bo‘lishi mumkin." },
    ],
    question: "O‘tmishdagi qaysi sinov sizga ehtiyot yoki mehrni o‘rgatdi?",
  },
  {
    id: "baytul-hikma",
    category: "Tarix",
    title: "Baytul Hikma: tarjima orqali qurilgan bilim ko‘prigi",
    excerpt: "Bag‘doddagi ilmiy muhit, tarjima harakati va bilim merosining ko‘p qatlami.",
    minutes: 7,
    level: "Boshlang‘ich",
    themes: ["ilm", "tarix", "madaniyat"],
    sourceLabel: "Encyclopaedia Britannica — Bayt al-Hikmah haqida umumiy ma’lumot",
    sourceUrl: "https://www.britannica.com/place/Bayt-al-Hikmah",
    sections: [
      { heading: "Bir binodan ko‘ra kengroq", body: "Baytul Hikma odatda Abbosiylar davridagi Bag‘dod bilan bog‘lanadi. Uni faqat zamonaviy universitetga tenglashtirish aniq emas: kutubxona, tarjima va ilmiy muloqot bilan bog‘liq turli faoliyatlar turli davrlarda rivojlangan." },
      { heading: "Tarjimaning kuchi", body: "Yunon, fors va hind merosidan qilingan tarjimalar yangi savollar va izlanishlarga zamin yaratdi. Muhim jihat — bilim bir tomonga nusxa ko‘chirish bilangina cheklanmadi; sharh, tanqid va yangi tadqiqotlar ham paydo bo‘ldi." },
      { heading: "Tarixni romantiklashtirmaslik", body: "O‘tmishni faqat “oltin davr” deb yodlash murakkab ijtimoiy hayotni yashiradi. Aniq shaxs, asar, sana va manbani ko‘rsatish tarixga halol yondashuvdir. Ilhom va ilmiy aniqlik bir-biriga xalaqit bermasligi kerak." },
    ],
    question: "Boshqa madaniyatdan o‘rgangan qaysi bilim bugungi hayotingizga kirib kelgan?",
  },
  {
    id: "qayravon-ilm",
    category: "Tarix",
    title: "Qayravon va ilm yo‘llari: shahardan tashqariga chiqqan kitob",
    excerpt: "Shimoliy Afrikadagi ilm markazlari, sayohat va kitoblar orqali uzilgan vaqtni anglash.",
    minutes: 6,
    level: "Chuqurroq",
    themes: ["tarix", "ilm", "sayohat"],
    sourceLabel: "Encyclopaedia Britannica — Kairouan tarixi",
    sourceUrl: "https://www.britannica.com/place/Kairouan",
    sections: [
      { heading: "Shahar va maktab", body: "Qayravon Tunis hududidagi muhim tarixiy shaharlardan biri bo‘lib, uzoq vaqt diniy ilm va huquq an’analari bilan tanilgan. Ilm faqat bitta binoda emas, masjid, ustoz, talaba, nusxachi va savdogarlar harakati orqali yoyilgan." },
      { heading: "Bilim sayohat qiladi", body: "Kitobning nusxasi ko‘chirilib, boshqa shaharga olib ketilganda uning taqdiri ham o‘zgarardi. Sharhlar, savol-javoblar va darslar matnni yangi muhitda jonli tutardi. Bu jarayon ilmni yopiq meros emas, uzluksiz muloqot sifatida ko‘rsatadi." },
      { heading: "Manba izlash", body: "Tarixiy da’voni tekshirishda uning davri va joyi muhim. Keyingi asrlarda yozilgan qissa avvalgi voqeani qanday tasvirlashini ajratib ko‘rsatish zarur. “Aniq sanasi noma’lum” deyish taxminiy sana uydirishdan afzal." },
    ],
    question: "Sizga yetib kelgan qaysi kitob yoki ustoz yo‘lingizni o‘zgartirdi?",
  },
  {
    id: "kichik-odatlar",
    category: "Shaxsiy rivojlanish",
    title: "Kichik odat: iradani emas, muhitni loyihalash",
    excerpt: "Har kuni katta intizom talab qilmaydigan, bajarilishi oson boshlanish nuqtasi yaratish.",
    minutes: 5,
    level: "Boshlang‘ich",
    themes: ["odat", "rivojlanish", "maqsad"],
    sourceLabel: "Amaliy o‘zini o‘rganish vositasi — klinik yoki diniy tavsiya emas",
    sections: [
      { heading: "Boshlanish ishqibozligi", body: "Yangi odat ko‘pincha kuchli ilhom bilan boshlanib, kundalik sharoit o‘zgarganda uziladi. “Har kuni bir soat” o‘rniga “ikki daqiqa boshlash” kabi aniq kirish nuqtasi tanlash ishonchli yo‘l bo‘lishi mumkin. Maqsad kichraytirish emas, takrorlanishni osonlashtirish." },
      { heading: "Ko‘rinadigan signal", body: "Kitobni stol ustiga qo‘yish, kundalikni ochiq saqlash yoki telefonni boshqa xonada qoldirish kabi muhitdagi kichik o‘zgarish eslatma vazifasini bajaradi. Signal bitta va tabiiy bo‘lsa, u bosim emas, yo‘l ko‘rsatuvchiga aylanadi." },
      { heading: "Uzilishdan keyin", body: "Bir kun o‘tkazib yuborish muvaffaqiyatsizlik haqida hukm emas. Keyingi mavjud paytda eng kichik versiyaga qaytish kifoya. SUKUNdagi statistika o‘zingizni kuzatish uchun, o‘zingizni jazolash uchun emas." },
    ],
    question: "Qaysi foydali odatni ikki daqiqalik boshlanishga aylantira olasiz?",
  },
  {
    id: "chuqur-diqqat",
    category: "Shaxsiy rivojlanish",
    title: "Chuqur diqqat: shovqinli dunyoda bitta ish bilan qolish",
    excerpt: "Diqqatni majburlamasdan, qisqa va himoyalangan vaqt oraliqlarini sinab ko‘rish.",
    minutes: 6,
    level: "Boshlang‘ich",
    themes: ["diqqat", "rivojlanish", "sokinlik"],
    sourceLabel: "Amaliy diqqat mashqi — individual samara har kishida turlicha",
    sections: [
      { heading: "Diqqat ham charchaydi", body: "Uzluksiz bildirishnomalar va ko‘p vazifali ish fikrning tez-tez almashishiga olib keladi. Bunga qarshi yechim o‘zini ayblash emas, oldindan qisqa himoyalangan vaqt yaratishdir. Boshlanish uchun o‘n daqiqa yetarli bo‘lishi mumkin." },
      { heading: "Bitta aniq vazifa", body: "“Ishlash” juda keng; “bitta paragrafni o‘qib, uchta savol yozish” aniq. Vaqt boshlanishida faqat shu vazifani ko‘rsatadigan qog‘oz qoldiring. Chalg‘ituvchi fikr kelganda uni qisqa yozib, ishga qayting." },
      { heading: "Dam ham rejaning qismi", body: "Chuqur ishni uzunlik bilan o‘lchash shart emas. Yakunda to‘xtash, nima bajarilganini belgilash va keyingi kirish nuqtasini yozish miyaga tanaffus beradi. Maqsad ko‘proq siqilish emas, mazmunli ishtirok etishdir." },
    ],
    question: "Bugun qaysi o‘n daqiqani bitta muhim ishga himoya qilasiz?",
  },
  {
    id: "afv-va-chegara",
    category: "Hayotiy hikmatlar",
    title: "Afv va shaxsiy chegara: mehribonlikning sog‘lom shakli",
    excerpt: "Ichki yukni yengillashtirish bilan zararli munosabatga qaytish bir narsa emasligi haqida.",
    minutes: 6,
    level: "Chuqurroq",
    themes: ["afv", "mehr", "mas'uliyat"],
    sourceLabel: "Axloqiy tafakkur materiali; individual psixologik yoki diniy hukm emas",
    sections: [
      { heading: "Ikki xil jarayon", body: "Afv haqida gapirishda ichki munosabat va tashqi qarorni ajratish foydali. Inson g‘azabini tushunishga harakat qilishi mumkin, ammo bu zararli xatti-harakatni oqlandi degani emas. Chegara qo‘yish ba’zan mehr va adolatni birga himoya qiladi." },
      { heading: "Shoshilinch yarashuv shart emas", body: "Murakkab jarohatda tayyor javob berishga majburlanish qo‘shimcha bosim tug‘diradi. Xavfsiz masofa, ishonchli inson bilan suhbat yoki mutaxassis yordami zarur bo‘lishi mumkin. Bu umumiy tafakkur matni, shaxsiy vaziyat uchun tayyor retsept emas." },
      { heading: "O‘zingizga ham adolat", body: "Yaxshilik qilish o‘z ehtiyojlaringizni doim inkor etish degani emas. “Menga nima zarar qilmoqda?”, “Qanday chegara xavfsizlik beradi?” savollariga yozma javob berish keyingi suhbatga tayyorgarlik bo‘lishi mumkin." },
    ],
    question: "Mehr va xavfsizlikni birga saqlaydigan qanday chegara kerak?",
  },
  {
    id: "yetarlik-tuygusi",
    category: "Hayotiy hikmatlar",
    title: "“Yetarli”ni ko‘rish: shukr va o‘sish o‘rtasidagi tinchlik",
    excerpt: "Mavjud ne’matni tan olish istak va maqsaddan voz kechishni anglatmaydi.",
    minutes: 5,
    level: "Boshlang‘ich",
    themes: ["shukr", "sokinlik", "maqsad"],
    sourceLabel: "Qur’on 14:7 mazmunidan ilhomlangan shaxsiy tafakkur",
    sourceUrl: "https://quran.com/14/7",
    sections: [
      { heading: "Taqqoslash shovqini", body: "Doimiy taqqoslash mavjud yaxshilikni ko‘rinishini qiyinlashtiradi. Shukr mashqi muammoni inkor qilmaydi; u diqqatga yana bir qatlam qo‘shadi. Bir vaqtda ham qiyinchilik, ham ne’mat borligini aytish mumkin." },
      { heading: "Shukr — majburiy ijobiylik emas", body: "Og‘ir kunda uchta katta sabab topa olmaslik normal. Bir piyola suv, xavfsiz turar joy yoki kimningdir qisqa xabari kabi kichik va aniq narsani yozish kifoya. Yozuv samimiy bo‘lishi uchun uzun bo‘lishi shart emas." },
      { heading: "O‘sishga ochiq joy", body: "“Hozir mendagi bu ne’mat yetarli” deyish bilan “men yanada o‘rganmoqchiman” fikri zid emas. Avvalgisi ichki tayanch, ikkinchisi yo‘nalish bo‘lishi mumkin. Ikki jumlani kundalikka ketma-ket yozib ko‘ring." },
    ],
    question: "Bugungi hayotingizda allaqachon mavjud bo‘lgan “yetarli” nima?",
  },
];

export const reflectionPrompts = [
  { id: "p1", text: "Bugun qalbingizga nima xotirjamlik berdi?", theme: "sokinlik" },
  { id: "p2", text: "Bugun nimani anglab yetdingiz?", theme: "tafakkur" },
  { id: "p3", text: "Qaysi ne’mat uchun shukr qilyapsiz?", theme: "shukr" },
  { id: "p4", text: "Ertaga qanday inson bo‘lishni istaysiz?", theme: "maqsad" },
  { id: "p5", text: "Hozir sizga ko‘proq nima kerak: sabr, harakat yoki dam olish?", theme: "sabr" },
  { id: "p6", text: "Nazorat qila olmaydigan qaysi narsani qo‘yib yuborishingiz mumkin?", theme: "tavakkal" },
  { id: "p7", text: "Bu hafta kimning yaxshiligini ko‘proq payqadingiz?", theme: "mehr" },
  { id: "p8", text: "Qaysi savolga javobni shoshiltirmasdan qidirayapsiz?", theme: "ilm" },
  { id: "p9", text: "Bugungi qiyinchilik sizga qanday chegara yoki ehtiyojni ko‘rsatdi?", theme: "qiyinchilik" },
  { id: "p10", text: "Qaysi kichik qadam sizni qiymatli deb bilgan yo‘lingizga yaqinlashtiradi?", theme: "rivojlanish" },
  { id: "p11", text: "O‘zingiz bilan gaplashayotganda qanday ohangni o‘zgartirmoqchisiz?", theme: "ehtiyot" },
  { id: "p12", text: "Bugun shoshilmasdan qayta ko‘rmoqchi bo‘lgan lahzangiz qaysi?", theme: "diqqat" },
];

export type Practice = {
  id: string;
  title: string;
  description: string;
  minutes: number;
  category: "Sokinlik" | "Ilm" | "Tafakkur" | "Shukr" | "Mehr";
  themes: string[];
};

export const practices: Practice[] = [
  { id: "nafas", title: "Ikki daqiqalik sokin nafas", description: "Telefondan uzoqlashib, nafasingizni o‘zgartirmasdan kuzating. Fikr chalg‘isa, uni ayblamasdan qayta diqqatni nafasga olib keling.", minutes: 2, category: "Sokinlik", themes: ["sokinlik", "tashvish", "diqqat"] },
  { id: "oyat", title: "Bitta oyat bilan sokin suhbat", description: "Bugungi oyatni va atrofidagi ikki oyatni o‘qing. Bitta tushunmagan so‘zingizni savol sifatida yozing.", minutes: 7, category: "Ilm", themes: ["qur'on", "ilm", "iymon"] },
  { id: "uch-ne'mat", title: "Uchta aniq ne’mat", description: "Umumiy so‘zlar o‘rniga bugun yuz bergan uchta kichik, aniq ne’matni yozing. Har biri uchun bitta sabab qo‘shing.", minutes: 4, category: "Shukr", themes: ["shukr", "ne'mat", "sokinlik"] },
  { id: "bir-lahza-yozuv", title: "Bir lahzalik yozuv", description: "Hozirgi hissiyotingizni hukm qilmasdan uch jumlada yozing: nima his qilyapman, menga nima kerak, qaysi kichik qadam mumkin.", minutes: 5, category: "Tafakkur", themes: ["tafakkur", "tashvish", "ehtiyot"] },
  { id: "yaxshi-xabar", title: "Samimiy bir xabar", description: "Yaqiningizga javob talab qilmaydigan, samimiy minnatdorlik xabarini yuboring. Aniq bir yaxshiligini eslang.", minutes: 3, category: "Mehr", themes: ["mehr", "shukr", "afv"] },
  { id: "raqamli-tanaffus", title: "Yigirma daqiqalik raqamli tanaffus", description: "Bildirishnomalarni o‘chirib, oddiy bir ishni tanlang: piyoda yurish, choy ichish yoki xonani jamlash. Maqsad — ekransiz bo‘shliqni sezish.", minutes: 20, category: "Sokinlik", themes: ["diqqat", "sokinlik", "rivojlanish"] },
  { id: "manba-tekshirish", title: "Bitta manbani tekshirish", description: "Bugun sizga ta’sir qilgan bir ma’lumotning birinchi manbasini toping. Isbotsiz qismini alohida belgilang.", minutes: 10, category: "Ilm", themes: ["ilm", "ehtiyot", "mas'uliyat"] },
];

export const journey = [
  { id: "quron", number: "01", title: "Qalbga sokinlik", subtitle: "Oyat va zikr bilan bir lahza", route: "/quron", symbol: "orbit" },
  { id: "ilm", number: "02", title: "Ilm sari", subtitle: "Savol bering, manbani kashf eting", route: "/ilm", symbol: "prism" },
  { id: "tafakkur", number: "03", title: "Tafakkur", subtitle: "Ichki ovozingizni tinglang", route: "/tafakkur", symbol: "arch" },
  { id: "shukronalik", number: "04", title: "Shukronalik", subtitle: "Kundagi ne’matlarni nomlang", route: "/shukronalik", symbol: "seed" },
];

export function getDailyVerse(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return verses[((day % verses.length) + verses.length) % verses.length];
}

export function getDailyPrompt(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return reflectionPrompts[((day % reflectionPrompts.length) + reflectionPrompts.length) % reflectionPrompts.length];
}
