import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Games from './pages/Games'
import Placeholder from './components/Placeholder'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="materi" element={<Placeholder title="Materi Pelajaran" desc="Daftar materi per mapel, baca & unduh, pencarian, dan tanda sudah dibaca — akan hadir di Fase 2." />} />
          <Route path="kumpul" element={<Placeholder title="Kumpul Tugas" desc="Unggah file/link, catatan pengumpulan, status terkirim/dinilai/revisi & kirim ulang — akan hadir di Fase 2." />} />
          <Route path="nilai" element={<Placeholder title="Riwayat Nilai" desc="Daftar nilai, grafik perkembangan & umpan balik guru — akan hadir di Fase 3." />} />
          <Route path="games" element={<Games />} />
          <Route path="panduan" element={<Placeholder title="Panduan Pemakaian" desc="Panduan singkat per halaman, cara kumpul tugas & cara dapat tiket — akan hadir di Fase 4." />} />
          <Route path="profil" element={<Placeholder title="Profil Siswa" desc="Daftar akun, masuk & keluar, atur profil — akan hadir di Fase 4." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
