---
# Sprint 5: Detail Jurnal Trade

## Goal
Menampilkan halaman review komprehensif untuk satu spesifik trade, mencakup metrik eksekusi, naratif trading, dan catatan psikologi.

## Tasks
- [x] Task 1: API Detail Trade
      - Deskripsi singkat: Membuat router API `GET /api/trades/[id]` untuk mengambil satu dokumen trade berdasarkan ID beserta status pemilikannya (memastikan user tidak bisa mengakses trade user lain).
      - Acuan desain: -
      - Acceptance criteria: Endpoint merespon dengan data lengkap trade (HTTP 200) atau error 404/403 jika trade tidak ditemukan atau bukan milik pengguna tersebut.
      - File/komponen yang terlibat: `app/api/trades/[id]/route.ts`

- [ ] Task 2: Halaman UI Detail Jurnal Trade
      - Deskripsi singkat: Mengimplementasikan halaman `/journal/[id]`. Bagian atas memuat badge WIN/LOSS besar dan execution metrics, sedangkan bagian bawah memuat deskripsi teks panjang (Trade Narrative & Psychology).
      - Acuan desain: `stitch_minimalist_trading_journal_dashboard/detail_jurnal_trade_updated_navigation/code.html`
      - Acceptance criteria: Halaman merender metrik dengan penataan layout grid yang presisi, dan teks naratif ter-render dengan baik (mendukung paragraf panjang/wrapping).
      - File/komponen yang terlibat: `app/journal/[id]/page.tsx`, `app/components/Badge.tsx`

- [ ] Task 3: Integrasi Data & Edge Cases
      - Deskripsi singkat: Menghubungkan halaman UI dengan endpoint API `GET /api/trades/[id]`. Menangani kondisi loading (skeleton loaders) dan error handling (mis. ID tidak ditemukan).
      - Acuan desain: -
      - Acceptance criteria: Mengklik trade pada tabel "Recent Executions" (dari sprint 4) sukses mengarahkan user ke halaman Detail Trade dan merender isinya dengan data akurat.
      - File/komponen yang terlibat: `app/journal/[id]/page.tsx`

## Dependencies
Sprint 1, Sprint 2, Sprint 3, Sprint 4
---
