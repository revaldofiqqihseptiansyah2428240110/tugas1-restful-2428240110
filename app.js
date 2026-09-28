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



module.exports = app;