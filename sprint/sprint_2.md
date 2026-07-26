---
# Sprint 2: Autentikasi & Proteksi Rute

## Goal
Mengimplementasikan autentikasi NextAuth, mengamankan halaman internal, dan memastikan alur registrasi divalidasi oleh Product Owner.

## Tasks
- [x] Task 1: Konfirmasi Keputusan dengan Product Owner (Alur Approval)
      - Deskripsi singkat: Klarifikasi apakah pendaftaran user langsung aktif (self-register) atau memerlukan persetujuan Admin sebelum bisa login.
      - Acuan desain: -
      - Acceptance criteria: Ada keputusan tertulis dari PO mengenai status default user baru. Task selanjutnya bergantung pada keputusan ini.
      - File/komponen yang terlibat: Catatan PRD/Project Management

- [x] Task 2: Setup NextAuth API
      - Deskripsi singkat: Konfigurasi `next-auth` menggunakan Credentials Provider, verifikasi password dengan bcrypt, dan pastikan role pengguna di-embed dalam JWT/Session.
      - Acuan desain: -
      - Acceptance criteria: Endpoint `/api/auth/[...nextauth]` berjalan. Payload session berisi ID, email, dan role user (TRADER/ADMIN) dari database.
      - File/komponen yang terlibat: `app/api/auth/[...nextauth]/route.ts`, `lib/auth.ts`

- [x] Task 3: Halaman Login & UI Registrasi
      - Deskripsi singkat: Membangun halaman login dan registrasi bergaya glassmorphism sesuai mockup, termasuk fungsionalitas tab role (hanya untuk tampilan/redirect) dan fitur "Ingat Saya".
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/login_akun_glassmorphism/code.html`
      - Acceptance criteria: User bisa login dan mendapatkan session. Role sebenarnya diverifikasi dari database server, bukan dari klik tab di form.
      - File/komponen yang terlibat: `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`, komponen form form/input

- [x] Task 4: Middleware Proteksi Rute
      - Deskripsi singkat: Membuat middleware untuk melindungi halaman dashboard dan jurnal dari user yang belum login.
      - Acuan desain: -
      - Acceptance criteria: Akses ke `/dashboard` atau `/journal` tanpa sesi login akan di-redirect kembali ke halaman `/login`.
      - File/komponen yang terlibat: `middleware.ts`

## Dependencies
Sprint 1
---
