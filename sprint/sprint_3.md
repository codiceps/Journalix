---
# Sprint 3: CRUD Trade Dasar

## Goal
Memungkinkan Trader untuk mencatat hasil trade mereka secara manual (beserta metrik eksekusi dan catatan psikologi) lalu menyimpannya ke database.

## Tasks
- [x] Task 1: API Endpoint Trade
      - Deskripsi singkat: Membuat router API untuk `POST /api/trades` yang menerima data dari form input trade dan memvalidasi payload sebelum masuk ke database.
      - Acuan desain: -
      - Acceptance criteria: Endpoint API bisa merespon HTTP 201 dengan payload trade tersimpan ketika diberikan data dummy yang valid (termasuk referensi ID user terkait).
      - File/komponen yang terlibat: `app/api/trades/route.ts`, file validasi (mis. Zod schema)

- [x] Task 2: Komponen Form UI "Tambah Trade"
      - Deskripsi singkat: Membangun elemen form kompleks yang menampung input pasangan instrumen, ukuran posisi, harga entry/exit, tombol direction (Buy/Sell), dan textarea untuk catatan naratif/psikologi.
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/tambah_trade_baru_updated_navigation/code.html`
      - Acceptance criteria: Halaman merender semua field secara proporsional sesuai gaya "ink" dark mode.
      - File/komponen yang terlibat: `app/journal/new/page.tsx`, UI components (Input, Textarea, Select, Button)

- [x] Task 3: Integrasi Frontend-Backend Tambah Trade
      - Deskripsi singkat: Menghubungkan form UI di `/journal/new` dengan endpoint `POST /api/trades`. Termasuk *error handling* dari respons API jika validasi Zod gagal, dan transisi UX sederhana (indikator _loading_ dan pesan sukses).
      - Acceptance criteria: 
        1. Form dapat disubmit dengan data *dummy* yang valid dan mengembalikan respons sukses serta notifikasi.
        2. Menyisipkan input yang cacat (misal harga negatif) akan memantulkan pesan *error* langsung ke pengguna tanpa me- *refresh* halaman.
      - File/komponen yang terlibat: `app/journal/new/page.tsx` (ditambahkan *state management* dan *fetch logic*)

## Dependencies
Sprint 1, Sprint 2
---
