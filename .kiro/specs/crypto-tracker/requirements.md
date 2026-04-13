# Requirements Document

## Introduction

Crypto Tracker adalah aplikasi web berbasis Next.js 14 (App Router) yang memungkinkan pengguna memantau harga cryptocurrency secara real-time, mencari aset kripto, beralih antara mode terang dan gelap, serta mensimulasikan portofolio investasi. Aplikasi ini dibangun sebagai proyek portofolio menggunakan Tailwind CSS, shadcn/ui, Recharts, dan data dari CoinGecko API.

## Glossary

- **App**: Aplikasi Crypto Tracker secara keseluruhan
- **Dashboard**: Halaman utama yang menampilkan daftar top 20 cryptocurrency
- **CoinGecko_API**: Layanan eksternal yang menyediakan data harga dan statistik cryptocurrency
- **Crypto_Card**: Komponen UI yang menampilkan informasi satu aset kripto (nama, harga, perubahan 24h, chart mini)
- **Search_Bar**: Komponen input teks untuk memfilter daftar cryptocurrency
- **Mini_Chart**: Grafik sparkline kecil yang menampilkan pergerakan harga 7 hari terakhir
- **Dark_Mode**: Tema tampilan gelap yang dapat diaktifkan pengguna
- **Portfolio_Simulator**: Fitur yang memungkinkan pengguna mencatat kepemilikan aset kripto secara simulasi
- **LocalStorage**: Mekanisme penyimpanan data di browser pengguna
- **Portfolio_Entry**: Satu catatan kepemilikan aset dalam Portfolio Simulator (nama koin, jumlah, harga beli)

---

## Requirements

### Requirement 1: Menampilkan Dashboard Top 20 Cryptocurrency

**User Story:** Sebagai pengguna, saya ingin melihat daftar 20 cryptocurrency teratas berdasarkan market cap, sehingga saya dapat memantau kondisi pasar kripto secara cepat.

#### Acceptance Criteria

1. WHEN halaman Dashboard dimuat, THE App SHALL mengambil data 20 cryptocurrency teratas dari CoinGecko_API berdasarkan market cap.
2. WHEN data berhasil diambil, THE Dashboard SHALL menampilkan setiap aset dalam Crypto_Card yang memuat nama koin, simbol, harga saat ini dalam USD, dan persentase perubahan harga dalam 24 jam terakhir.
3. WHEN persentase perubahan 24 jam bernilai positif, THE Crypto_Card SHALL menampilkan nilai tersebut dengan warna hijau.
4. WHEN persentase perubahan 24 jam bernilai negatif, THE Crypto_Card SHALL menampilkan nilai tersebut dengan warna merah.
5. WHEN data sedang diambil dari CoinGecko_API, THE Dashboard SHALL menampilkan skeleton loading pada posisi setiap Crypto_Card.
6. IF CoinGecko_API mengembalikan error atau tidak dapat dijangkau, THEN THE App SHALL menampilkan pesan error yang informatif kepada pengguna.

---

### Requirement 2: Mini Chart pada Setiap Crypto Card

**User Story:** Sebagai pengguna, saya ingin melihat grafik pergerakan harga 7 hari terakhir pada setiap kartu kripto, sehingga saya dapat menilai tren harga secara visual tanpa membuka halaman detail.

#### Acceptance Criteria

1. WHEN Crypto_Card dirender, THE Mini_Chart SHALL menampilkan grafik sparkline harga penutupan selama 7 hari terakhir menggunakan Recharts.
2. WHEN tren harga 7 hari bernilai positif (harga hari ini lebih tinggi dari 7 hari lalu), THE Mini_Chart SHALL menggunakan warna garis hijau.
3. WHEN tren harga 7 hari bernilai negatif, THE Mini_Chart SHALL menggunakan warna garis merah.
4. THE Mini_Chart SHALL dirender tanpa sumbu (axis) dan tanpa tooltip agar tampilan tetap ringkas.

---

### Requirement 3: Search Bar untuk Mencari Cryptocurrency

**User Story:** Sebagai pengguna, saya ingin mencari cryptocurrency berdasarkan nama atau simbol, sehingga saya dapat menemukan aset yang saya cari dengan cepat dari daftar yang tersedia.

#### Acceptance Criteria

1. THE Dashboard SHALL menampilkan Search_Bar di bagian atas daftar Crypto_Card.
2. WHEN pengguna mengetik teks pada Search_Bar, THE Dashboard SHALL memfilter daftar Crypto_Card secara real-time untuk menampilkan hanya aset yang nama atau simbolnya mengandung teks tersebut (case-insensitive).
3. WHEN hasil pencarian tidak menemukan aset yang cocok, THE Dashboard SHALL menampilkan pesan "Tidak ada hasil untuk pencarian ini."
4. WHEN Search_Bar dikosongkan, THE Dashboard SHALL menampilkan kembali seluruh 20 Crypto_Card.

---

### Requirement 4: Dark Mode

**User Story:** Sebagai pengguna, saya ingin dapat beralih antara mode terang dan mode gelap, sehingga saya dapat menyesuaikan tampilan aplikasi dengan preferensi atau kondisi pencahayaan saya.

#### Acceptance Criteria

1. THE App SHALL menyediakan tombol toggle Dark_Mode yang dapat diakses dari semua halaman melalui navigasi utama.
2. WHEN pengguna mengaktifkan Dark_Mode, THE App SHALL menerapkan tema gelap pada seluruh komponen UI secara konsisten.
3. WHEN pengguna menonaktifkan Dark_Mode, THE App SHALL menerapkan tema terang pada seluruh komponen UI secara konsisten.
4. WHEN pengguna memuat ulang halaman, THE App SHALL mempertahankan preferensi Dark_Mode yang terakhir dipilih menggunakan LocalStorage.
5. WHEN sistem operasi pengguna menggunakan preferensi dark mode, THE App SHALL menerapkan Dark_Mode secara otomatis pada kunjungan pertama.

---

### Requirement 5: Portfolio Simulator

**User Story:** Sebagai pengguna, saya ingin mensimulasikan portofolio investasi kripto saya, sehingga saya dapat melihat estimasi nilai total kepemilikan berdasarkan harga pasar saat ini.

#### Acceptance Criteria

1. THE App SHALL menyediakan halaman Portfolio yang dapat diakses melalui navigasi utama.
2. WHEN pengguna menambahkan Portfolio_Entry, THE Portfolio_Simulator SHALL menyimpan data nama koin, jumlah kepemilikan, dan harga beli per unit ke LocalStorage.
3. WHEN halaman Portfolio dimuat, THE Portfolio_Simulator SHALL membaca seluruh Portfolio_Entry dari LocalStorage dan menampilkannya dalam bentuk tabel.
4. WHEN halaman Portfolio dimuat, THE Portfolio_Simulator SHALL mengambil harga terkini dari CoinGecko_API untuk setiap koin yang ada dalam portofolio.
5. WHEN harga terkini berhasil diambil, THE Portfolio_Simulator SHALL menghitung dan menampilkan nilai saat ini, profit/loss dalam USD, dan persentase profit/loss untuk setiap Portfolio_Entry.
6. THE Portfolio_Simulator SHALL menampilkan total nilai portofolio dalam USD sebagai ringkasan di bagian atas halaman.
7. WHEN pengguna menghapus Portfolio_Entry, THE Portfolio_Simulator SHALL menghapus entri tersebut dari LocalStorage dan memperbarui tampilan secara langsung.
8. IF LocalStorage tidak tersedia di browser pengguna, THEN THE Portfolio_Simulator SHALL menampilkan pesan bahwa fitur ini memerlukan LocalStorage.

---

### Requirement 6: Navigasi dan Struktur Aplikasi

**User Story:** Sebagai pengguna, saya ingin dapat berpindah antar halaman dengan mudah, sehingga saya dapat mengakses semua fitur aplikasi secara intuitif.

#### Acceptance Criteria

1. THE App SHALL menyediakan navigasi utama (navbar) yang selalu terlihat di bagian atas setiap halaman.
2. THE App SHALL memiliki rute `/` untuk halaman Dashboard dan rute `/portfolio` untuk halaman Portfolio Simulator.
3. WHEN pengguna berada di halaman aktif, THE App SHALL menandai tautan navigasi yang sesuai sebagai aktif secara visual.
4. THE App SHALL menampilkan nama aplikasi "Crypto Tracker" beserta ikon pada navbar.

---

### Requirement 7: Performa dan Pengambilan Data

**User Story:** Sebagai pengguna, saya ingin data cryptocurrency dimuat dengan cepat dan efisien, sehingga pengalaman menggunakan aplikasi terasa responsif.

#### Acceptance Criteria

1. THE App SHALL menggunakan Next.js Server Components untuk pengambilan data awal di Dashboard agar halaman dapat dirender di sisi server.
2. WHEN data Dashboard telah diambil, THE App SHALL menyimpan cache respons CoinGecko_API selama 60 detik untuk mengurangi jumlah permintaan ke API.
3. THE App SHALL menampilkan antarmuka yang responsif pada lebar layar mobile (≥ 320px), tablet (≥ 768px), dan desktop (≥ 1024px).
