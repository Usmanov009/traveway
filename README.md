# Travelway (TripCraft)

Zamonaviy sayohat va tur paketlarni qidirish platformasi (Kompas Tour jonli integratsiyasi bilan).

## Mahalliy ishga tushirish (Local Run)

1. Bog'liqliklarni o'rnatish:
```bash
npm install
```

2. Loyihani ishlab chiqish rejimida ishga tushirish:
```bash
npm run dev
```

3. Loyihani ishlab chiqarish (production) uchun yig'ish va tekshirish:
```bash
npm run build
npm start
```

## Render.com da joylash (Deploy to Render)

### 1-usul: Web Service (Tavsiya etiladi - Kompas Tour API CORS to'liq ishlaydi)
1. [Render.com](https://render.com) ga kiring va GitHub orqali ro'yxatdan o'ting.
2. **"New +"** -> **"Web Service"** tugmasini bosing.
3. GitHub repozitoriyangizni tanlang: `Usmanov009/traveway`.
4. Quyidagi parametrlarni kiriting:
   - **Name:** `travelway`
   - **Region:** Frankfurt (yoki yaqin hudud)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. **"Deploy Web Service"** tugmasini bosing.

---

### 2-usul: Render Blueprint (render.yaml orqali)
1. Render boshqaruv panelida **"New +"** -> **"Blueprint"** ni bosing.
2. Repozitoriyani tanlang (`Usmanov009/traveway`).
3. Render `render.yaml` faylini avtomatik o'qiydi va barcha sozlamalarni o'zi o'rnatadi.
4. **"Apply"** tugmasini bosing.
