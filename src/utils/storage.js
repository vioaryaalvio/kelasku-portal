// Simple localStorage helpers for KelasKu
// All data is stored client-side per PRD

const KEYS = {
  PROFILE: 'kelasku_profile',
  TUGAS: 'kelasku_tugas',
  MAPEL: 'kelasku_mapel',
  MATERI: 'kelasku_materi',
  PENGUMPULAN: 'kelasku_pengumpulan',
  NILAI: 'kelasku_nilai',
  SKOR_GAME: 'kelasku_skor_game',
  TIKET: 'kelasku_tiket',
}

export function getStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function ensureInitialData({ mapel, tugas, materi, profile }) {
  if (!getStorage(KEYS.MAPEL)) setStorage(KEYS.MAPEL, mapel)
  if (!getStorage(KEYS.TUGAS)) setStorage(KEYS.TUGAS, tugas)
  if (!getStorage(KEYS.MATERI)) setStorage(KEYS.MATERI, materi)
  if (!getStorage(KEYS.PROFILE)) setStorage(KEYS.PROFILE, profile)
  if (!getStorage(KEYS.PENGUMPULAN)) setStorage(KEYS.PENGUMPULAN, [])
  if (!getStorage(KEYS.NILAI)) setStorage(KEYS.NILAI, [])
  if (!getStorage(KEYS.SKOR_GAME)) setStorage(KEYS.SKOR_GAME, [])
  if (!getStorage(KEYS.TIKET)) setStorage(KEYS.TIKET, [])
  // Migrasi satu-kali: profil lama masih tersimpan di browser pengguna,
  // timpa dengan profil baru agar nama & foto terbaru langsung tampil.
  const storedProfile = getStorage(KEYS.PROFILE)
  if (storedProfile?.nama === 'Aulia Putri' && profile) setStorage(KEYS.PROFILE, profile)
}

export { KEYS }
