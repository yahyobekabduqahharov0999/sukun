# SUKUN — raqamli sokinlik makoni

SUKUN React, TypeScript, Vite, Three.js, Framer Motion va Tailwind CSS asosidagi immersiv, responsive frontend mahsulot prototipi. Barcha asosiy tajriba matnlari o‘zbek tilida.

## Mahalliy ishga tushirish

Talab: Node.js 20+ va npm.

```bash
npm install
npm run dev
```

Terminalda ko‘rsatilgan mahalliy URL’ni oching. Production build:

```bash
npm run build
npm run preview
```

Build `dist/` ichida yaratiladi. Loyihadagi Vite single-file sozlamasi sabab yakuniy `dist/index.html` mustaqil serve qilinishi mumkin. Google Fonts va tashqi manba havolalari uchun internet kerak; shriftlar yuklanmasa, tizim shriftlariga fallback mavjud.

## Sahifalar

Hash-marshrutlar brauzer Back/Forward tugmalari va chuqur havolalarni qo‘llaydi:

- `#/` — immersiv bosh sahifa va barcha asosiy bo‘limlar
- `#/quron` — kunlik oyat, tanlangan oyatlar, qidiruv, saqlash, nusxalash va sokin o‘qish
- `#/ilm` — olti yo‘nalish, 12 ta mustaqil matn, qidiruv va maqola reader
- `#/tafakkur` — shaxsiy tafakkur kundaligi
- `#/shukronalik` — uch ne’mat, kalendar va tarix
- `#/rivojlanish` — amaliyotlar, izohlar, maqsadlar va real progress grafik
- `#/kabinet` — profil, saqlanganlar, sozlamalar, maxfiylik, import/export

Maqolaga to‘g‘ridan-to‘g‘ri havola namunasi: `#/ilm?article=niyat-va-amal`.

## Ma’lumotlar va maxfiylik

- Shaxsiy yozuvlar `sukun.sanctuary.v1` kaliti bilan joriy brauzer `localStorage` xotirasida saqlanadi.
- Hech qanday kundalik, shukronalik, maqsad yoki tavsiya so‘rovi SUKUN serveriga yuborilmaydi.
- `localStorage` shifrlangan xavfsiz hisob emas. Umumiy qurilmada ehtiyot bo‘lish kerak.
- Kabinetdagi JSON eksport haqiqiy fayl yuklaydi; import SUKUN v1 formatini tekshiradi. Eksport fayli ham shifrlanmaydi.
- “Hisob va mahalliy ma’lumotlarni o‘chirish” barcha mahalliy yozuvlarni tasdiqdan keyin o‘chiradi.

## Ataylab ulanmagan funksiyalar

Telegram, email va telefon autentifikatsiyasi faqat **frontend prototip interfeysi**. Ular login yaratmaydi, token/parol/telefon qabul qilmaydi va saqlamaydi. Haqiqiy autentifikatsiya uchun backend, xavfsiz sessiya, identifikatsiya provayderi, server tomonidagi authorization va account deletion oqimi zarur.

“SUKUN yo‘riqchisi” masofaviy AI emas: so‘rovni qurilmada kalit mavzular bo‘yicha ballab, mahalliy kontentdan tavsiya tanlaydi. U diniy avtoritet, fatvo yoki tibbiy tashxis vositasi emas. Diniy hukm talab qiladigan so‘rovda o‘z chegarasini bildiradi.

## 3D va harakat

- Three.js sahna: custom extruded ravoqlar, crescent geometry, sukun orbital emblem, metallic/glass material, zarralar, mist, light shafts va desktop high-quality rejimda planar reflection.
- Kursor parallaxi va real scroll asosidagi kamera harakati.
- Mobil qurilmalarda pixel ratio, zarra soni va material/transmission sifati yengillashadi.
- `prefers-reduced-motion` qo‘llanadi. Kabinetda harakat va 3D sifatini qo‘lda sozlash mumkin.
- WebGL yaratib bo‘lmasa yoki 3D o‘chirilsa, CSS atmosphere fallback ko‘rsatiladi.

## Kontent manbalari

Har bir oyat yonida sura/oyat raqami va `quran.com` havolasi bor. 29:69 kartasidagi qisqa iqtibos “Oyatdan parcha” deb alohida belgilangan. Maqolalarning diniy yoki tarixiy manbalari reader oxirida ko‘rsatiladi; amaliy tafakkur matnlari klinik yoki diniy hukm sifatida taqdim etilmaydi.
