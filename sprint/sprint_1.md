---
# Sprint 1: Setup Project & Database

## Goal
Menginisialisasi proyek Next.js, mengatur database dengan Prisma, dan menerapkan konfigurasi design system dasar.

## Tasks
- [x] Task 1: Inisialisasi Proyek Next.js & Tailwind
      - Deskripsi singkat: Membuat proyek Next.js baru dengan App Router dan mengonfigurasi Tailwind CSS sesuai warna/tipografi proyek.
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/precision_ledger/DESIGN.md`
      - Acceptance criteria: Aplikasi bisa di-run lokal (npm run dev) tanpa error dan konfigurasi font serta warna kustom (dark mode "ink") sudah terbaca oleh Tailwind.
      - File/komponen yang terlibat: `package.json`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`

- [x] Task 2: Setup PostgreSQL & Skema Prisma
      - Deskripsi singkat: Melakukan inisialisasi Prisma, koneksi ke database PostgreSQL, dan membuat skema dasar (User, Role Enum, Trade).
      - Acuan desain: -
      - Acceptance criteria: Skema berhasil di-push ke database PostgreSQL lokal (`npx prisma db push`) dan Prisma Client ter-generate tanpa error.
      - File/komponen yang terlibat: `prisma/schema.prisma`, `.env`

- [x] Task 3: Pembuatan Layout Global & Navigasi
      - Deskripsi singkat: Membangun komponen Sidebar/Navbar yang akan digunakan di halaman internal aplikasi.
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/dashboard_utama_updated_navigation/code.html` (bagian navigasi)
      - Acceptance criteria: Ada komponen `<Layout>` atau layout App Router yang membungkus *children* dengan panel navigasi samping/atas sesuai desain.
      - File/komponen yang terlibat: `app/components/Layout.tsx`, `app/components/Sidebar.tsx`

- [x] Task 4: Dockerize PostgreSQL untuk Development
      - Deskripsi singkat: Membuat docker-compose.yml untuk menjalankan
        PostgreSQL secara lokal via container, menggantikan instalasi
        Postgres manual. Next.js tetap jalan native (bukan di container)
        untuk development.
      - Acuan desain: -
      - Acceptance criteria: `docker compose up -d` berhasil menjalankan
        container Postgres, dan `npx prisma db push` (dari Task 2) berhasil
        terkoneksi ke database tersebut via DATABASE_URL di .env.
      - File/komponen yang terlibat: `docker-compose.yml`, `.env`, `.gitignore`
        (pastikan .env tidak ter-commit)

## Dependencies
Tidak ada
---
