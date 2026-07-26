---
# Sprint 8: Profil Pengguna & Pengaturan

## Goal
Mengimplementasikan halaman profil untuk Trader dan mengatur manajemen preferensi akun, termasuk pengaturan visibilitas (public/private).

## Tasks
- [ ] Task 1: UI Halaman Profil Pengguna
      - Deskripsi singkat: Membangun struktur layout `/profile` lengkap dengan "Account Information", "Summary Statistics", "Milestones", dan "Preferences" toggle.
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/profil_pengguna/code.html`
      - Acceptance criteria: Form pengaturan profil berhasil dirender dan stats terisi data statis/skeleton sebagai fondasi.
      - File/komponen yang terlibat: `app/profile/page.tsx`, `app/components/ProfileForm.tsx`

- [ ] Task 2: Update Preferensi & Profil Publik
      - Deskripsi singkat: Membangun API Endpoint `PATCH /api/users/preferences` untuk memperbarui pilihan user: menyalakan dark mode toggle, serta pengaturan privasi (public/private profile) untuk leaderboard.
      - Acuan desain: -
      - Acceptance criteria: Perubahan pada sakelar "Public Profile" akan disimpan di database, sehingga berefek pada visibilitas data trader di halaman Leaderboard sprint 7. 
      - File/komponen yang terlibat: `app/api/users/preferences/route.ts`

- [ ] Task 3: Integrasi Data Profil
      - Deskripsi singkat: Menghubungkan metrik performa seumur hidup trader (Total PnL, dll) ke dalam halaman profil dan memuat nilai profil asli dari session/server.
      - Acuan desain: -
      - Acceptance criteria: Data statistik dan form input pada halaman `/profile` akurat menampilkan data pemilik session aktif saat ini.
      - File/komponen yang terlibat: `app/profile/page.tsx`

## Dependencies
Sprint 1, Sprint 2, Sprint 4
---
