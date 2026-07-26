---
# Sprint 6: Kalender Profit/Loss

## Goal
Menyajikan visualisasi kalender bulanan interaktif untuk memantau intensitas profit & loss harian trader.

## Tasks
- [ ] Task 1: Algoritma Agregasi Data Kalender
      - Deskripsi singkat: Membuat router API `GET /api/calendar?year=YYYY&month=MM` yang merangkum data `Trade` dari satu user ke dalam rentang satu bulan penuh. Menggabungkan/menotalkan (sum) PnL per hari, sehingga API mengembalikan list harian (contoh: `[ { date: '2026-07-01', pnl: 150 }, { date: '2026-07-02', pnl: -50 } ...]`).
      - Acuan desain: -
      - Acceptance criteria: Endpoint API merespon dengan agregat harian bulanan dengan sangat cepat (menggunakan query SQL efisien/grouping Prisma).
      - File/komponen yang terlibat: `app/api/calendar/route.ts`

- [ ] Task 2: UI Komponen Kalender Grid
      - Deskripsi singkat: Membangun halaman `/calendar` yang terdiri dari grid kalender yang sel-selnya mewarnai sesuai intensitas (hijau tua/muda, merah tua/muda) bergantung pada agregat PnL hari itu.
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/kalender_profit_loss/code.html` (bagian tengah kalender grid)
      - Acceptance criteria: Kalender sukses dirender dan sel diwarnai proporsional terhadap besaran PnL (bisa dibantu package `date-fns` atau serupa untuk struktur kalender).
      - File/komponen yang terlibat: `app/calendar/page.tsx`, `app/components/CalendarGrid.tsx`

- [ ] Task 3: Panel Ringkasan Bulanan (Month Summary)
      - Deskripsi singkat: Menambahkan sidebar/panel metrik ringkasan untuk bulan yang sedang dilihat di kalender (mis. Best Day, Avg Day, Gross Profit, Month Win Rate).
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/kalender_profit_loss/code.html` (bagian metrik kanan)
      - Acceptance criteria: Angka "Month Summary" berubah otomatis setiap kali pengguna memilih bulan lain pada kalender, dengan nilai terintegrasi dari API Task 1.
      - File/komponen yang terlibat: `app/calendar/page.tsx`, `app/components/MonthSummarySidebar.tsx`

## Dependencies
Sprint 1, Sprint 2, Sprint 3
---
