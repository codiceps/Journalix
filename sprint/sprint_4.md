---
# Sprint 4: Dashboard Utama

## Goal
Menampilkan rangkuman performa (metrik, tabel trade terbaru) di Dashboard Trader dengan mengambil data dari database.

## Tasks
- [x] Task 1: Komponen & API Metrik Performa (Summary Cards)
      - Deskripsi singkat: Membangun kartu metrik (Total Trades, Win Rate, Avg Risk/Reward, Net PnL) dan API endpoint `GET /api/dashboard/metrics` untuk mengkalkulasi agregat dari tabel `Trade` milik user bersangkutan.
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/dashboard_utama_updated_navigation/code.html` (bagian atas, 4 kartu ringkasan)
      - Acceptance criteria: Kartu metrik di `/dashboard` merender angka yang secara dinamis berasal dari kalkulasi data trade di database. Kolom opsional stopLoss & takeProfit ditambahkan untuk R:R.
      - File/komponen yang terlibat: `app/dashboard/page.tsx`, `app/api/dashboard/metrics/route.ts`, `app/components/MetricCard.tsx`

- [x] Task 2: Tabel Recent Executions (Daftar Trade)
      - Deskripsi singkat: Membangun tabel untuk menampilkan daftar eksekusi terakhir dengan badge profit/loss (hijau/merah) sesuai margin. Membuat API `GET /api/trades?limit=5`.
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/dashboard_utama_updated_navigation/code.html` (bagian tabel bawah)
      - Acceptance criteria: Tabel di Dashboard menampilkan maksimal 5 trade terakhir dengan benar, format nilai mata uang dan warna PnL sesuai referensi desain. Endpoint khusus untuk equity curve (berdasarkan kalkulasi kronologis) juga diterapkan.
      - File/komponen yang terlibat: `app/components/RecentExecutionsTable.tsx`, `app/api/trades/route.ts` (GET handler)

- [x] Task 3: PnL Matrix (Mini Heatmap Kalender Harian)
      - Deskripsi singkat: Membuat bagian PnL Matrix berbentuk grid kotak kecil berwarna (intensitas hijau/pink sesuai besaran profit/loss) yang diagregasi per hari. Menyiapkan helper `getDailyPnlAggregates` di `lib/` agar logic bisa di-reuse di Sprint 6.
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/dashboard_utama_updated_navigation/code.html` (bagian PnL Matrix mini kalender)
      - Acceptance criteria: Dashboard memiliki visualisasi heatmap kalender harian berdasarkan data Net PnL per hari. Memiliki tooltip untuk melihat detail nilai harian.
      - File/komponen yang terlibat: `app/components/PnlMatrix.tsx`, `lib/tradeUtils.ts`, API endpoint.

## Dependencies
Sprint 1, Sprint 2, Sprint 3
---
