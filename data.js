// Data dummy (pengganti database) - format Array JSON
const dataKatalogBuku = [
  { kode: "BK001", judul: "Pemrograman Web Dasar", kategori: "Teknologi", harga: 85000, stok: 24, gambar: "buku1.png" },
  { kode: "BK002", judul: "Belajar JavaScript Modern", kategori: "Teknologi", harga: 98000, stok: 15, gambar: "buku2.png" },
  { kode: "BK003", judul: "Desain Antarmuka dengan CSS", kategori: "Desain", harga: 76000, stok: 9, gambar: "buku3.png" },
  { kode: "BK004", judul: "Algoritma dan Struktur Data", kategori: "Teknologi", harga: 110000, stok: 30, gambar: "buku4.png" },
  { kode: "BK005", judul: "Dasar-Dasar Basis Data", kategori: "Teknologi", harga: 89000, stok: 0, gambar: "buku5.png" },
  { kode: "BK006", judul: "Manajemen Proyek TI", kategori: "Bisnis", harga: 92000, stok: 12, gambar: "buku6.png" }
];

const dataUser = [
  { nama: "Admin Toko", email: "admin@tokobuku.com", password: "admin123" }
];

const dataTracking = [
  { no: "DO2026001", nama: "Budi Santoso", status: 4, ekspedisi: "JNE Reguler", tanggal: "2026-10-28", paket: "Paket Buku (2 item)", total: 183000 },
  { no: "DO2026002", nama: "Siti Aminah", status: 2, ekspedisi: "J&T Express", tanggal: "2026-11-05", paket: "Paket Buku (1 item)", total: 98000 },
  { no: "DO2026003", nama: "Rudi Hartono", status: 0, ekspedisi: "SiCepat", tanggal: "2026-11-07", paket: "Paket Buku (3 item)", total: 271000 }
];

const dataTransaksi = [
  { no: "DO2026001", tanggal: "2026-10-28", nama: "Budi Santoso", total: 183000, bayar: "Transfer Bank" },
  { no: "DO2026002", tanggal: "2026-11-05", nama: "Siti Aminah", total: 98000, bayar: "E-Wallet" },
  { no: "DO2026003", tanggal: "2026-11-07", nama: "Rudi Hartono", total: 271000, bayar: "COD" }
];

const tahapPengiriman = ["Pesanan diterima", "Dikemas", "Dikirim", "Dalam perjalanan", "Terkirim"];
