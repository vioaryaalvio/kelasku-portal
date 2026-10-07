// Mock data awal sesuai schema PRD
// Disimpan ke localStorage, jadi data tiruan untuk frontend phase

export const mockMapel = [
  { id: 'mapel-1', namaMapel: 'Matematika' },
  { id: 'mapel-2', namaMapel: 'Bahasa Indonesia' },
  { id: 'mapel-3', namaMapel: 'IPA' },
  { id: 'mapel-4', namaMapel: 'IPS' },
  { id: 'mapel-5', namaMapel: 'Bahasa Inggris' },
  { id: 'mapel-6', namaMapel: 'Seni Budaya' },
]

export const mockProfile = {
  id: 'siswa-1',
  nama: 'Axell',
  kelas: 'XI IPA 2',
  foto: 'https://i.pravatar.cc/200?img=32',
  statusMasuk: true,
}

function daysFromNow(days) {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function hoursFromNow(hours) {
  const d = new Date()
  d.setHours(d.getHours() + hours)
  return d.toISOString()
}

export const mockTugas = [
  {
    id: 'tugas-1',
    mapelId: 'mapel-1',
    judul: 'Latihan Soal Matriks & Determinan',
    deskripsi: 'Kerjakan 10 soal matriks halaman 42-43 buku paket. Foto jawaban tulis tangan.',
    tenggat: hoursFromNow(6), // hari ini
    selesai: false,
    prioritas: 'tinggi',
  },
  {
    id: 'tugas-2',
    mapelId: 'mapel-3',
    judul: 'Laporan Praktikum Fotosintesis',
    deskripsi: 'Buat laporan praktikum fotosintesis daun hydrilla. Upload PDF max 5MB.',
    tenggat: daysFromNow(0), // hari ini
    selesai: false,
    prioritas: 'tinggi',
  },
  {
    id: 'tugas-3',
    mapelId: 'mapel-2',
    judul: 'Resensi Novel Laskar Pelangi',
    deskripsi: 'Resensi 500 kata, struktur orientasi - sinopsis - analisis - evaluasi.',
    tenggat: daysFromNow(1), // besok
    selesai: false,
    prioritas: 'sedang',
  },
  {
    id: 'tugas-4',
    mapelId: 'mapel-5',
    judul: 'Video Speaking: My Daily Routine',
    deskripsi: 'Rekam video 1-2 menit, upload link Drive/YouTube unlisted.',
    tenggat: daysFromNow(2),
    selesai: true,
    prioritas: 'sedang',
  },
  {
    id: 'tugas-5',
    mapelId: 'mapel-4',
    judul: 'Peta Konsep Perdagangan Internasional',
    deskripsi: 'Buat peta konsep di kertas A3, foto dengan jelas.',
    tenggat: daysFromNow(3),
    selesai: false,
    prioritas: 'rendah',
  },
  {
    id: 'tugas-6',
    mapelId: 'mapel-6',
    judul: 'Poster Digital Hari Batik Nasional',
    deskripsi: 'Desain poster A3, upload PNG/JPG. Kriteria: orisinal & tema batik.',
    tenggat: daysFromNow(-1), // lewat 1 hari -> terlambat tapi belum selesai
    selesai: false,
    prioritas: 'tinggi',
  },
  {
    id: 'tugas-7',
    mapelId: 'mapel-3',
    judul: 'Rangkuman Sistem Reproduksi',
    deskripsi: 'Rangkuman bab 7, tulis tangan rapi 2 halaman.',
    tenggat: daysFromNow(5),
    selesai: false,
    prioritas: 'rendah',
  },
  {
    id: 'tugas-8',
    mapelId: 'mapel-1',
    judul: 'Project Kelompok: Statistika Data Kelas',
    deskripsi: 'Kumpulkan data tinggi badan kelas, buat diagram & analisis.',
    tenggat: daysFromNow(7),
    selesai: false,
    prioritas: 'sedang',
  },
]

export const mockMateri = [
  { id: 'materi-1', mapelId: 'mapel-1', judul: 'Matriks & Operasinya', tautan: '#', sudahDibaca: false },
  { id: 'materi-2', mapelId: 'mapel-3', judul: 'Fotosintesis & Respirasi', tautan: '#', sudahDibaca: true },
  { id: 'materi-3', mapelId: 'mapel-2', judul: 'Teks Resensi Struktur & Contoh', tautan: '#', sudahDibaca: false },
]
