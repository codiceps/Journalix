---
# Sprint 9: Panel Admin Dasar

## Goal
Membangun dasbor kendali khusus untuk Admin guna mengelola hak akses akun pengguna (berdasarkan konfirmasi dari PRD) dan visibilitas kesehatan komunitas.

## Tasks
- [ ] Task 1: Konfirmasi Finalisasi UI Admin dengan Product Owner
      - Deskripsi singkat: Memastikan desain Panel Admin dan fungsionalitas pastinya telah disetujui (sesuai bagian di PRD yang tidak memiliki referensi mockup).
      - Acuan desain: Tidak ada; harus diputuskan bersama PO dengan merujuk ke pola dari `precision_ledger/DESIGN.md`
      - Acceptance criteria: Adanya sketsa/wireframe/dokumen yang disetujui PO terkait tata letak panel Admin sebelum lanjut ke Task 2.
      - File/komponen yang terlibat: -

- [ ] Task 2: Layout & Proteksi Halaman Admin
      - Deskripsi singkat: Membangun layout root tersendiri `/admin` dan menerapkan pengecekan middleware ekstra kuat bahwa `session.role === 'ADMIN'`. Jika bukan, tendang ke login / halaman unauthorized.
      - Acuan desain: -
      - Acceptance criteria: Rute `/admin` sangat mustahil dimasuki akun berstatus Trader atau Guest.
      - File/komponen yang terlibat: `app/admin/layout.tsx`, `middleware.ts`

- [ ] Task 3: Tabel Manajemen Anggota Komunitas
      - Deskripsi singkat: Membangun halaman `/admin/members` menampilkan tabel selayaknya `Recent Executions` (Sprint 4) namun mengelola daftar trader terdaftar dengan fitur status Approval (Pending/Active/Banned).
      - Acuan desain: Mengadaptasi pola tabel dari `precision_ledger/DESIGN.md`
      - Acceptance criteria: Admin dapat melihat seluruh trader di platform, mengganti status akses mereka (contoh: Approve pendatang baru) lewat API endpoint khusus Admin `PATCH /api/admin/users/[id]`.
      - File/komponen yang terlibat: `app/admin/page.tsx`, `app/components/AdminMemberTable.tsx`, `app/api/admin/users/[id]/route.ts`

## Dependencies
Sprint 1, Sprint 2
---
