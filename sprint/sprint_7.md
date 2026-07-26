---
# Sprint 7: Leaderboard Komunitas

## Goal
Mengembangkan sistem papan peringkat yang menampilkan anggota komunitas berdasarkan konsistensi (Win Rate & Profit Factor).

## Tasks
- [ ] Task 1: API Leaderboard & Ranking Engine
      - Deskripsi singkat: Membuat endpoint API `GET /api/community/leaderboard` yang melakukan query ke seluruh akun `User` aktif (yang toggle `Public Profile`-nya true). Menghitung Win Rate dan Profit Factor tiap trader, lalu diurutkan.
      - Acuan desain: -
      - Acceptance criteria: API mampu mengembalikan array daftar trader berperingkat beserta properti statistik mereka secara agregat, plus posisi (rank) user yang saat ini sedang login.
      - File/komponen yang terlibat: `app/api/community/leaderboard/route.ts`

- [ ] Task 2: Halaman Leaderboard
      - Deskripsi singkat: Membangun halaman `/community` yang menampilkan tabel peringkat dengan porsi tab navigasi "Global" dan "Following" (bisa diabaikan dulu 'following' untuk v1 MVP jika backend terlalu kompleks, pastikan kesepakatan v1 ini dengan tab "Global" utama).
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/leaderboard_komunitas_updated_navigation/code.html`
      - Acceptance criteria: Tabel leaderboard tampil sempurna sesuai mockup dengan indikator urutan, badge prestasi, dan nama trader.
      - File/komponen yang terlibat: `app/community/page.tsx`, `app/components/LeaderboardTable.tsx`

- [ ] Task 3: UI Indikator "Your Rank"
      - Deskripsi singkat: Menambahkan sebuah pin/baris sticky atau panel di atas leaderboard yang menyoroti peringkat pengguna login saat ini, menumbuhkan motivasi akuntabilitas.
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/leaderboard_komunitas_updated_navigation/code.html` (bagian bar biru/highlight 'Your Rank')
      - Acceptance criteria: Panel highlight user memunculkan peringat aktual dan tersinkronisasi dengan posisi user yang masuk dalam daftar di Task 1.
      - File/komponen yang terlibat: `app/community/page.tsx`, `app/components/YourRankHighlight.tsx`

## Dependencies
Sprint 1, Sprint 2, Sprint 3
---
