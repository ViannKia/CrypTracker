# Implementation Plan: Crypto Tracker

## Overview

Implementasi dilakukan secara inkremental: mulai dari fondasi proyek (types, lib, layout), lalu fitur Dashboard (fetch data, CryptoCard, MiniChart, SearchBar), kemudian Dark Mode, dan terakhir Portfolio Simulator. Setiap tahap diakhiri dengan checkpoint untuk memastikan semua bagian terintegrasi dengan benar.

## Tasks

- [x] 1. Setup fondasi proyek — types, lib, dan konfigurasi
  - Buat file `lib/types.ts` dengan interface `CoinMarket`, `PortfolioEntry`, dan `PortfolioEntryWithPnL`
  - Buat file `lib/coingecko.ts` dengan fungsi `fetchTopCoins()` menggunakan `{ next: { revalidate: 60 } }` dan `fetchCoinPrices(coinIds)`
  - Buat file `lib/portfolio.ts` dengan fungsi `getPortfolioEntries()`, `savePortfolioEntries()`, `addPortfolioEntry()`, `removePortfolioEntry()`, dan `calculatePnL()`
  - Tambahkan fungsi `calculateTotalValue()` di `lib/portfolio.ts` untuk menjumlahkan semua `currentValue`
  - Tambahkan fungsi `filterCoins()` di `lib/coingecko.ts` atau file utilitas untuk filter case-insensitive berdasarkan nama/simbol
  - Pastikan semua localStorage helpers menggunakan `try/catch` dan fallback ke array kosong
  - _Requirements: 1.1, 5.2, 5.3, 5.4, 5.7, 5.8, 7.2_

  - [ ]* 1.1 Tulis property test untuk `calculatePnL()`
    - **Property 6: Kalkulasi P&L akurat untuk semua nilai input**
    - **Validates: Requirements 5.5**
    - Gunakan `fc.float({min: 0.001})` untuk `amount`, `buyPrice`, dan `currentPrice`

  - [ ]* 1.2 Tulis property test untuk `calculateTotalValue()`
    - **Property 7: Total portofolio adalah jumlah semua currentValue**
    - **Validates: Requirements 5.6**
    - Gunakan `fc.array(fc.record({...PortfolioEntryWithPnL}))`

  - [ ]* 1.3 Tulis property test untuk localStorage round-trip (`savePortfolioEntries` + `getPortfolioEntries`)
    - **Property 8: Portfolio entry localStorage round-trip**
    - **Validates: Requirements 5.2, 5.3**
    - Gunakan `fc.array(fc.record({...PortfolioEntry}))`

  - [ ]* 1.4 Tulis property test untuk `removePortfolioEntry()`
    - **Property 9: Delete entry menghapus tepat satu entri**
    - **Validates: Requirements 5.7**
    - Gunakan `fc.array(fc.record({...PortfolioEntry}), {minLength: 1})`

  - [ ]* 1.5 Tulis property test untuk `filterCoins()`
    - **Property 5: Filter search mengembalikan subset yang benar**
    - **Validates: Requirements 3.2, 3.4**
    - Gunakan `fc.array(fc.record({...CoinMarket}))` + `fc.string()`

- [-] 2. Setup layout, ThemeProvider, dan Navbar
  - Install dependency: `next-themes`, `shadcn/ui` (init), `recharts`
  - Buat `components/theme-provider.tsx` sebagai wrapper `next-themes`
  - Buat `app/layout.tsx` dengan `ThemeProvider` menggunakan `defaultTheme="system"` dan `enableSystem`
  - Buat `components/navbar.tsx` dengan nama aplikasi "Crypto Tracker", ikon, link ke `/` dan `/portfolio`, tombol toggle Dark Mode, dan penanda link aktif menggunakan `usePathname()`
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4_

  - [ ]* 2.1 Tulis unit test untuk Navbar
    - Verifikasi tombol toggle dark mode ada di Navbar (Req 4.1)
    - Verifikasi `ThemeProvider` menggunakan `defaultTheme="system"` (Req 4.5)
    - Verifikasi Navbar selalu dirender (Req 6.1)
    - Verifikasi link aktif ditandai secara visual (Req 6.3)

  - [ ]* 2.2 Tulis property test untuk theme persistence
    - **Property 10: Theme persistence round-trip**
    - **Validates: Requirements 4.4**
    - Gunakan `fc.constantFrom("light", "dark")`

- [ ] 3. Implementasi komponen Dashboard — CryptoCard dan MiniChart
  - Buat `components/mini-chart.tsx` sebagai Client Component menggunakan Recharts `LineChart` tanpa `XAxis`, `YAxis`, `CartesianGrid`, dan `Tooltip`; warna garis hijau/merah berdasarkan prop `isPositive`
  - Buat `components/skeleton-card.tsx` sebagai skeleton loading untuk CryptoCard
  - Buat `components/crypto-card.tsx` yang menampilkan nama, simbol, harga USD, persentase 24h (hijau/merah), dan `MiniChart`
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4_

  - [ ]* 3.1 Tulis property test untuk warna perubahan harga 24 jam di CryptoCard
    - **Property 1: Warna perubahan harga 24 jam sesuai tanda nilai**
    - **Validates: Requirements 1.3, 1.4**
    - Gunakan `fc.float()` untuk `price_change_percentage_24h`

  - [ ]* 3.2 Tulis property test untuk kelengkapan field CryptoCard
    - **Property 2: CryptoCard menampilkan semua field yang diperlukan**
    - **Validates: Requirements 1.2**
    - Gunakan `fc.record({...})` untuk objek `CoinMarket`

  - [ ]* 3.3 Tulis property test untuk warna MiniChart sesuai tren 7 hari
    - **Property 3: Warna MiniChart sesuai tren 7 hari**
    - **Validates: Requirements 2.2, 2.3**
    - Gunakan `fc.array(fc.float({min: 0}), {minLength: 2})`

  - [ ]* 3.4 Tulis property test untuk MiniChart tanpa axis/tooltip
    - **Property 4: MiniChart tidak memiliki axis atau tooltip**
    - **Validates: Requirements 2.4**
    - Gunakan `fc.array(fc.float({min: 0}), {minLength: 1})`

  - [ ]* 3.5 Tulis unit test untuk skeleton loading dan error state
    - Verifikasi skeleton loading ditampilkan saat data sedang diambil (Req 1.5)
    - Verifikasi pesan error ditampilkan saat API gagal (Req 1.6)

- [ ] 4. Implementasi CryptoCardGrid dengan SearchBar
  - Buat `components/crypto-card-grid.tsx` sebagai Client Component yang menerima `coins: CoinMarket[]`
  - Tambahkan `SearchBar` (input teks) di bagian atas grid yang memfilter koin secara real-time menggunakan `filterCoins()`
  - Tampilkan pesan "Tidak ada hasil untuk pencarian ini." ketika hasil filter kosong
  - Render `CryptoCard` untuk setiap koin yang lolos filter
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 4.1 Tulis unit test untuk SearchBar
    - Verifikasi SearchBar ada di halaman Dashboard (Req 3.1)
    - Verifikasi pesan "Tidak ada hasil" ditampilkan saat pencarian tidak cocok (Req 3.3)

- [ ] 5. Implementasi halaman Dashboard (Server Component)
  - Buat `app/page.tsx` sebagai Server Component (tanpa `"use client"`)
  - Panggil `fetchTopCoins()` di dalam komponen dan teruskan hasilnya ke `CryptoCardGrid`
  - Buat `app/error.tsx` sebagai error boundary untuk menangkap error dari Server Component
  - Gunakan `Suspense` dengan `SkeletonCard` sebagai fallback saat data sedang diambil
  - _Requirements: 1.1, 1.5, 1.6, 7.1, 7.2, 7.3_

  - [ ]* 5.1 Tulis smoke test untuk Dashboard
    - Verifikasi `app/page.tsx` tidak memiliki `"use client"` directive (Req 7.1)
    - Verifikasi `fetchTopCoins` menggunakan `{ next: { revalidate: 60 } }` (Req 7.2)

- [ ] 6. Checkpoint — Pastikan semua tests pass
  - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.

- [ ] 7. Implementasi Route Handler untuk harga portfolio
  - Buat `app/api/prices/route.ts` yang menerima query param `ids` dan memanggil `fetchCoinPrices()`
  - Kembalikan response JSON berupa `Record<string, number>` (coinId → harga USD)
  - Tangani error fetch dengan response HTTP yang sesuai
  - _Requirements: 5.4_

- [ ] 8. Implementasi halaman Portfolio Simulator
  - Buat `app/portfolio/page.tsx` sebagai Client Component
  - Saat mount, baca `portfolioEntries` dari localStorage menggunakan `getPortfolioEntries()`
  - Fetch harga terkini dari `/api/prices` untuk semua coinId di portofolio
  - Hitung P&L menggunakan `calculatePnL()` dan total menggunakan `calculateTotalValue()`
  - Tampilkan total nilai portofolio di bagian atas halaman
  - Tangani kasus localStorage tidak tersedia dengan pesan informatif (Req 5.8)
  - Tangani error fetch harga dengan state `priceError` (Req 5.4)
  - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.6, 5.8_

- [ ] 9. Implementasi komponen PortfolioTable dan AddEntryForm
  - Buat `components/portfolio-table.tsx` yang menerima `entries: PortfolioEntryWithPnL[]` dan `onDelete: (id: string) => void`; tampilkan nama koin, jumlah, harga beli, nilai saat ini, P&L USD, dan P&L persen dengan warna hijau/merah
  - Buat `components/add-entry-form.tsx` dengan field coinId, coinName, coinSymbol, amount, dan buyPrice; saat submit panggil `addPortfolioEntry()` dan perbarui state
  - Hubungkan `AddEntryForm` dan `PortfolioTable` ke halaman Portfolio
  - Implementasikan fungsi hapus entri yang memanggil `removePortfolioEntry()` dan memperbarui state
  - _Requirements: 5.2, 5.3, 5.5, 5.6, 5.7_

  - [ ]* 9.1 Tulis unit test untuk Portfolio page
    - Verifikasi halaman Portfolio dapat diakses (Req 5.1)
    - Verifikasi pesan error LocalStorage tidak tersedia (Req 5.8)

- [ ] 10. Responsivitas dan polish UI
  - Pastikan layout Dashboard menggunakan grid responsif: 1 kolom (mobile ≥320px), 2 kolom (tablet ≥768px), 4 kolom (desktop ≥1024px) dengan Tailwind CSS
  - Pastikan halaman Portfolio responsif di semua breakpoint
  - Pastikan Navbar responsif dan dapat digunakan di mobile
  - Terapkan dark mode variant (`dark:`) pada semua komponen menggunakan Tailwind CSS
  - _Requirements: 7.3, 4.2, 4.3_

- [ ] 11. Checkpoint akhir — Pastikan semua tests pass
  - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.

## Notes

- Task bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk keterlacakan
- Property tests memvalidasi properti kebenaran universal menggunakan `fast-check` (minimum 100 iterasi)
- Unit tests memvalidasi contoh spesifik dan edge case
- Semua property test harus diberi tag komentar: `// Feature: crypto-tracker, Property {N}: {property_text}`
