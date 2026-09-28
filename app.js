// Tugas 1 - RESTful API Express.js
// Topik 8: Hotel - Kamar (/rooms)
// Nama  : Revaldo Fiqqih Septiansyah
// NPM   : 2428240110

// impor express
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// middleware untuk membaca body berformat JSON
app.use(express.json());

// ============================================
// DATA: array kamar di memori (min. 3 data awal)
// ============================================
let rooms = [
  {
    id: 1,
    nomorKamar: "101",
    tipe: "standar",
    hargaPerMalam: 350000,
    kapasitas: 2,
    tersedia: true,
  },
  {
    id: 2,
    nomorKamar: "305",
    tipe: "deluxe",
    hargaPerMalam: 850000,
    kapasitas: 2,
    tersedia: true,
  },
  {
    id: 3,
    nomorKamar: "401",
    tipe: "suite",
    hargaPerMalam: 1500000,
    kapasitas: 4,
    tersedia: false,
  },
];

// id berikutnya dibuat otomatis oleh server
let nextId = 4;

// tipe kamar yang valid (sesuai enum topik 8)
const TIPE_VALID = ["standar", "deluxe", "suite"];

// ============================================
// GET /
// Info API: nama, NIM, nomor topik, daftar endpoint
// ============================================
app.get("/", (req, res) => {
  res.json({
    nama: "Revaldo Fiqqih Septiansyah",
    npm: "2428240110",
    topik: "8 - Hotel: Kamar",
    resource: "/rooms",
    filter: "GET /rooms?tipe=standar|deluxe|suite",
    endpoints: [
      "GET /rooms",
      "GET /rooms/:id",
      "POST /rooms",
      "PUT /rooms/:id",
      "DELETE /rooms/:id",
    ],
  });
});

// ============================================
// GET /rooms
// Ambil semua kamar, atau filter dengan query string
// Contoh: GET /rooms?tipe=deluxe
// ============================================
app.get("/rooms", (req, res) => {
  const { tipe } = req.query;

  // jika ada query tipe, kembalikan hasil filter (array, boleh kosong)
  if (tipe) {
    const hasil = rooms.filter((r) => r.tipe === tipe);
    return res.status(200).json(hasil);
  }

  // tanpa filter: kembalikan semua data
  res.status(200).json(rooms);
});

// ============================================
// GET /rooms/:id
// Ambil satu kamar berdasarkan id
// ============================================
app.get("/rooms/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const room = rooms.find((r) => r.id === id);

  // data tidak ditemukan -> 404
  if (!room) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  res.status(200).json(room);
});

// ============================================
// POST /rooms
// Tambah kamar baru
// Body: {"nomorKamar":"102","tipe":"standar","hargaPerMalam":350000,"kapasitas":2,"tersedia":true}
// ============================================
app.post("/rooms", (req, res) => {
  const { nomorKamar, tipe, hargaPerMalam, kapasitas, tersedia } = req.body;

  // validasi: semua field wajib (*) harus diisi -> 400 jika kosong
  if (!nomorKamar || !tipe || hargaPerMalam === undefined || !kapasitas) {
    return res.status(400).json({
      status: "error",
      message:
        "Field nomorKamar, tipe, hargaPerMalam, dan kapasitas wajib diisi",
      data: null,
    });
  }

  // validasi: nilai tipe harus sesuai enum
  if (!TIPE_VALID.includes(tipe)) {
    return res.status(400).json({
      status: "error",
      message: "Field tipe harus berupa standar, deluxe, atau suite",
      data: null,
    });
  }

  // buat data baru; id dibuat otomatis oleh server
  const baru = {
    id: nextId++,
    nomorKamar,
    tipe,
    hargaPerMalam,
    kapasitas,
    tersedia: tersedia !== undefined ? tersedia : true,
  };
  rooms.push(baru);

  // berhasil -> 201 + data yang baru dibuat
  res.status(201).json({
    status: "success",
    message: "Data berhasil ditambahkan",
    data: baru,
  });
});

// ============================================
// PUT /rooms/:id
// Ubah seluruh field kamar (penggantian penuh)
// Body: {"nomorKamar":"306","tipe":"deluxe","hargaPerMalam":900000,"kapasitas":3,"tersedia":true}
// ============================================
app.put("/rooms/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = rooms.findIndex((r) => r.id === id);

  // data tidak ditemukan -> 404
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  const { nomorKamar, tipe, hargaPerMalam, kapasitas, tersedia } = req.body;

  // validasi: semua field wajib (*) harus diisi -> 400 jika kosong
  if (!nomorKamar || !tipe || hargaPerMalam === undefined || !kapasitas) {
    return res.status(400).json({
      status: "error",
      message:
        "Field nomorKamar, tipe, hargaPerMalam, dan kapasitas wajib diisi",
      data: null,
    });
  }

  // validasi: nilai tipe harus sesuai enum
  if (!TIPE_VALID.includes(tipe)) {
    return res.status(400).json({
      status: "error",
      message: "Field tipe harus berupa standar, deluxe, atau suite",
      data: null,
    });
  }

  // ganti seluruh field data
  rooms[index] = {
    id,
    nomorKamar,
    tipe,
    hargaPerMalam,
    kapasitas,
    tersedia: tersedia !== undefined ? tersedia : true,
  };

  res.status(200).json({
    status: "success",
    message: "Data berhasil diubah",
    data: rooms[index],
  });
});

