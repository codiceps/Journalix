# PRD — Journalix (Trading Journal untuk Komunitas Trader)

**Versi:** 2.0 (menggantikan PRD AlphaJournal v1.0 — rebrand + perubahan alur login)
**Tanggal:** 18 Juli 2026
**Status:** Draft — disusun berdasarkan mockup UI lengkap terbaru ("Precision Ledger" design system)
**Author:** Hasan

---

## 0. Catatan Perubahan dari Versi Sebelumnya

Mockup ini adalah iterasi baru dari project yang sebelumnya bernama **AlphaJournal**. Berdasarkan perbandingan langsung dengan mockup versi 1:

- **Rebrand nama produk** → **Journalix**. Seluruh halaman lain (Dashboard, Kalender, Leaderboard, Detail Jurnal, Tambah Trade, Profil) **identik secara struktur dan fitur** dengan versi sebelumnya — hanya nama brand yang berubah.
- **Perubahan besar ada di halaman Login**:
  - Gaya visual berubah dari latar belakang candlestick chart menjadi **glassmorphism** (kartu transparan blur di atas latar gelap)
  - Form login sekarang berbahasa Indonesia (Alamat Email, Kata Sandi, Masuk)
  - Ada **tab pemilihan peran: Trader vs Admin** sebelum login
  - Ada opsi **"Ingat saya"** (remember me)
  - Ada link **"Daftar sekarang"** (register) — mengindikasikan pendaftaran akun kini lebih terbuka, berbeda dari versi sebelumnya yang hanya "Apply for access" (berbasis approval tertutup)

Perubahan ini berdampak pada model akses aplikasi, sehingga bagian **Autentikasi & Role** di PRD ini ditulis ulang. Bagian lain diadaptasi dari PRD v1.0 karena mockup-nya tidak berubah.

## 1. Ringkasan Produk

Journalix adalah aplikasi web jurnal trading untuk komunitas kecil trader, yang memungkinkan pencatatan PnL harian secara manual, analisis performa, dan refleksi psikologi trading. Produk memposisikan diri sebagai *tool* analitis untuk trader disiplin — bukan aplikasi sosial atau gamifikasi — dengan antarmuka dark mode yang padat informasi namun tetap rapi.

Berbeda dari versi sebelumnya, akses kini mendukung **dua peran (role): Trader dan Admin**, dengan alur pendaftaran yang lebih terbuka (self-register), bukan lagi murni berbasis undangan.

## 2. Latar Belakang & Tujuan

Trader retail sering kesulitan menjaga konsistensi karena tidak mencatat trade secara terstruktur, sehingga sulit melihat pola kesalahan atau kekuatan mereka. Journalix menjawab ini dengan:

- Mencatat setiap trade beserta konteks psikologis di baliknya (bukan cuma angka)
- Memvisualisasikan performa dari waktu ke waktu (equity curve, kalender PnL)
- Mendorong akuntabilitas lewat komunitas kecil (leaderboard berbasis konsistensi, bukan cuma profit)
- Memberi **Admin** kemampuan mengelola komunitas (moderasi anggota, pengawasan data agregat)

**Tujuan produk:**
1. Trader mencatat trade harian dalam < 1 menit per entry
2. Trader bisa melihat pola performa mingguan/bulanan tanpa perlu Excel manual
3. Komunitas saling memberi akuntabilitas lewat leaderboard & profil publik
4. Admin bisa mengelola keanggotaan komunitas tanpa perlu akses database manual

## 3. Target Pengguna

- **Trader** — anggota komunitas yang mencatat & meninjau trade harian mereka sendiri
- **Admin** — pengelola komunitas (bisa jadi founder komunitas/leader) yang mengawasi keanggotaan dan kesehatan komunitas secara keseluruhan
- Skala komunitas kecil (10–50 orang), bukan publik umum

## 4. Ruang Lingkup

### Termasuk (v1)
- Autentikasi dengan pemilihan role (Trader/Admin) + pendaftaran akun mandiri
- Input trade manual dengan catatan psikologi
- Dashboard ringkasan performa (Trader)
- Kalender profit/loss harian
- Detail jurnal per trade
- Leaderboard komunitas
- Profil pengguna & pengaturan akun

### Perlu klarifikasi lebih lanjut (belum ada mockup-nya)
- **Halaman/dashboard khusus Admin** — mockup baru menunjukkan role Admin dipilih saat login, tapi belum ada wireframe halaman yang admin lihat setelah masuk. Perlu didefinisikan: apakah Admin melihat dashboard Trader biasa + panel tambahan, atau dashboard yang sepenuhnya berbeda?
- **Alur approval pendaftaran** — apakah "Daftar sekarang" langsung aktif begitu daftar, atau tetap perlu persetujuan Admin sebelum bisa login?

### Tidak termasuk (v1)
- Sinkronisasi otomatis/API ke broker
- Aplikasi mobile native
- Notifikasi real-time / alert harga
- Multi-currency portfolio tracking otomatis

## 5. Fitur per Halaman

### 5.1 Login / Registrasi
- Kartu login bergaya glassmorphism di atas latar gelap
- Tab pemilihan peran: **Trader** atau **Admin** — menentukan tujuan redirect setelah login
- Field: Alamat Email, Kata Sandi
- Opsi "Ingat saya" (remember me / persistent session)
- Link "Daftar sekarang" untuk akun baru

**User story:** Sebagai calon pengguna, saya ingin memilih peran saya (Trader/Admin) saat login supaya saya diarahkan ke tampilan yang sesuai dengan tanggung jawab saya di komunitas.

**Catatan terbuka:** perlu didefinisikan apakah role dipilih user sendiri saat registrasi (rawan disalahgunakan — user asal pilih "Admin") atau role di-assign oleh sistem/Admin lain saat approval. Rekomendasi: role **tidak** boleh self-select bebas saat register; tab di login hanya menentukan tampilan, bukan penentu hak akses — hak akses sebenarnya tetap divalidasi dari database.

### 5.2 Dashboard Utama (Trader)
Ringkasan performa trader yang login, terdiri dari:
- Kartu metrik: **Total Trades**, **Win Rate**, **Avg Risk/Reward**, **Net PnL**
- Grafik **Cumulative Equity** (equity curve) dengan perbandingan periode (mis. "vs last mo")
- **PnL Matrix** — breakdown performa per instrumen (BTC/USDT, ETH/USDT, SOL/USDT, LINK/USDT, dll.)
- Tabel **Recent Executions** — daftar trade terbaru (pair, type/direction, entry, exit, PnL, hasil profit/loss)
- Tombol tambah trade cepat
- Indikator status keanggotaan ("Pro Tier")

**User story:** Sebagai trader, saya ingin melihat ringkasan performa saya begitu login, supaya saya langsung tahu kondisi bulan ini tanpa harus scroll manual.

### 5.3 Tambah Trade Baru
Form input manual dengan field:
- Instrument/Pair (contoh: BTC/USD, AAPL, EUR/USD)
- Direction — toggle Buy/Sell
- Position Size (lots/units)
- Entry Price & Exit Price
- Date & Time (local)
- Catatan psikologi (textarea) — prompt: *"What was your mental state? Did you follow your rules? Describe the setup..."*

**User story:** Sebagai trader, saya ingin mencatat trade beserta kondisi mental saya saat itu, supaya saya bisa melihat pola emosi yang mempengaruhi keputusan trading saya.

### 5.4 Detail Jurnal Trade
Halaman review satu trade, berisi:
- Header hasil trade (contoh: "BTC/USD Long" + tag **WIN**/LOSS)
- **Execution Metrics**: Entry Price, Exit Price, Position Size, Risk/Reward, Net PnL
- **Trade Narrative** — catatan naratif panjang tentang alasan & jalannya trade
- **Psychology** — refleksi kondisi emosi terkait trade tersebut

**User story:** Sebagai trader, saya ingin membuka kembali detail satu trade lama untuk belajar dari pola kesalahan atau keberhasilan saya.

### 5.5 Kalender Profit/Loss
- Kalender bulanan dengan sel harian yang menunjukkan intensitas profit (hijau) atau loss (merah) berdasarkan besaran PnL hari itu
- Ringkasan bulan: **Best Day**, **Avg Day**, **Gross Profit**, **Gross Loss**, **Win Rate**, **Month Summary**

**User story:** Sebagai trader, saya ingin melihat pola profit/loss harian dalam format kalender, supaya saya bisa mengenali hari-hari mana yang paling konsisten menguntungkan.

### 5.6 Leaderboard Komunitas
- Tab **Global** vs **Following**
- Kolom: Rank, Trader (nama), Win Rate, Profit Factor
- Badge pencapaian, mis. **"Top Consistency"**, **"Top 15%"**
- Indikator **Your Rank** untuk posisi pengguna saat ini

**User story:** Sebagai anggota komunitas, saya ingin melihat peringkat berdasarkan konsistensi (bukan cuma total profit), supaya saya termotivasi menjaga disiplin, bukan sekadar mengejar profit besar.

### 5.7 Profil Pengguna
- **Account Information**: Name, Email, Password
- Statistik ringkas: Total PnL, Win Rate, Total Trades, Profit Factor
- **Milestones** — pencapaian (contoh: "Achieved consecutive profitable days")
- **Preferences**: Dark Mode (system default theme), Notifications (trade alerts & updates)
- Toggle **Public Profile** — visibilitas profil ke komunitas

**User story:** Sebagai pengguna, saya ingin mengatur visibilitas profil saya ke komunitas dan melihat pencapaian saya, supaya saya punya kontrol atas privasi sekaligus motivasi tambahan.

### 5.8 Panel Admin *(belum ada mockup — perlu didesain)*
Berdasarkan munculnya role Admin di login, area ini perlu didefinisikan sebelum development, minimal mencakup:
- Daftar anggota komunitas & status akun (aktif/nonaktif/pending approval)
- Kemampuan approve/reject pendaftaran baru (jika alur approval tetap dipakai)
- Kemungkinan melihat agregat performa komunitas (bukan detail trade personal, demi privasi)

## 6. Desain Sistem (ringkasan dari mockup — tidak berubah dari v1)

| Aspek | Ketentuan |
|---|---|
| Tema | Dark mode "ink" — latar utama sangat gelap, kontainer sedikit lebih terang |
| Warna fungsional | Hijau & merah **hanya** dipakai untuk indikator profit/loss |
| Tipografi | Inter untuk teks umum; **JetBrains Mono** khusus untuk angka |
| Border & elevasi | Tanpa shadow — tonal layering + border tipis 1px |
| Bentuk | Radius kecil (4px) elemen standar, radius lebih besar (8px) widget besar |
| Densitas | Tinggi — padding tabel diminimalkan |
| Login (baru) | Glassmorphism — kartu blur transparan, bukan solid seperti halaman lain |

## 7. Kebutuhan Non-Fungsional

- **Keamanan**: isolasi data antar trader; hak akses Admin divalidasi di server, bukan hanya dari pilihan tab di UI login
- **Performa**: dashboard & kalender tetap responsif meski riwayat trade sudah ratusan entry
- **Privasi**: profil bisa disembunyikan dari komunitas (toggle Public Profile)
- **Lokalisasi**: halaman login sudah berbahasa Indonesia — perlu diputuskan apakah seluruh aplikasi akan konsisten Bahasa Indonesia atau tetap campuran seperti mockup saat ini (halaman lain masih berbahasa Inggris)

## 8. Metrik Kesuksesan (v1)

- % anggota komunitas yang mencatat trade minimal 3x/minggu
- Rata-rata waktu input 1 trade (target < 1 menit)
- Retensi mingguan anggota komunitas (return ke dashboard)
- Jumlah entry dengan catatan psikologi terisi
- Waktu rata-rata Admin memproses approval pendaftaran baru (jika alur approval dipertahankan)

## 9. Prioritas Rilis (MoSCoW)

**Must have**
- Autentikasi dua-role (Trader/Admin), dashboard, tambah trade manual, detail jurnal, kalender PnL

**Should have**
- Leaderboard komunitas, profil & preferences, panel Admin dasar (kelola anggota)

**Could have**
- Badge/milestone otomatis, filter lanjutan di Recent Executions

**Won't have (v1)**
- Integrasi API broker, aplikasi mobile native, alert real-time

## 10. Asumsi & Batasan

- Semua input data trade dilakukan manual oleh user (tidak ada sinkronisasi broker di v1)
- Skala pengguna kecil (komunitas, bukan publik)
- Desain final mengacu pada mockup "Precision Ledger" (Journalix) yang sudah dibuat — dokumen ini menstandardisasi fitur & lingkup, bukan mengubah desain visual
- Panel Admin didefinisikan secara fungsional minimal di PRD ini karena belum ada mockup visualnya — **wajib direview bersama sebelum development dimulai**
