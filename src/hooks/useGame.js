import { useCallback, useEffect, useState } from 'react'
import { SkorAPI, TiketAPI, GameAPI } from '../services/api'

const PROFIL_ID = 'siswa-1'
const GAME_ID = 'game-1'
export const STREAK_TIKET = 60 // harus streak 60 berturut tanpa mati dalam 1x main

function getLastSaturday00(now = new Date()) {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0 Sun .. 6 Sat
  const diff = (day - 6 + 7) % 7 // hari sejak Sabtu lalu
  d.setDate(d.getDate() - diff)
  return d
}

function shouldReset(lastUpdatedAt) {
  if (!lastUpdatedAt) return false
  const last = new Date(lastUpdatedAt)
  const sat = getLastSaturday00(new Date())
  return last < sat
}

export function useGame() {
  const [game, setGame] = useState(null)
  const [skor, setSkor] = useState(null) // {id, skorTertinggi, totalPoin, updatedAt}
  const [tiket, setTiket] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastScore, setLastScore] = useState(null) // skor terakhir 1x main (streak check)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [games, skorList, tiketList, allSkor] = await Promise.all([
        GameAPI.list().catch(() => [{ id: GAME_ID, nama: 'Flappy Bird' }]),
        SkorAPI.list(PROFIL_ID),
        TiketAPI.list(PROFIL_ID),
        SkorAPI.listAll(),
      ])
      setGame(games?.[0] || { id: GAME_ID, nama: 'Flappy Bird' })
      let mySkor = Array.isArray(skorList) ? skorList[0] : skorList
      if (!mySkor) {
        const created = await SkorAPI.create({ gameId: GAME_ID, profilId: PROFIL_ID, skorTertinggi: 0, totalPoin: 0, updatedAt: new Date().toISOString() })
        mySkor = created
      } else if (shouldReset(mySkor.updatedAt)) {
        // reset mingguan Sabtu 00:00
        console.log('Reset Sabtu: totalPoin di-reset 0')
        const reset = await SkorAPI.update(mySkor.id, { totalPoin: 0, updatedAt: new Date().toISOString() })
        mySkor = reset
      }
      setSkor(mySkor)
      setTiket(Array.isArray(tiketList) ? tiketList : [])
      const board = Array.isArray(allSkor) ? [...allSkor].sort((a, b) => b.totalPoin - a.totalPoin).slice(0, 5) : []
      setLeaderboard(board)
      setError(null)
    } catch (e) {
      console.warn('useGame load gagal:', e.message)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const onGameOver = useCallback(async (score) => {
    if (!skor) return { updated: false }
    setLastScore(score)
    // cek reset dulu sebelum update
    let base = skor
    if (shouldReset(skor.updatedAt)) {
      base = await SkorAPI.update(skor.id, { totalPoin: 0, updatedAt: new Date().toISOString() })
    }
    const nextTertinggi = Math.max(base.skorTertinggi || 0, score)
    const nextPoin = (base.totalPoin || 0) + score // unlimited, tidak ada batas
    const updated = await SkorAPI.update(base.id, { skorTertinggi: nextTertinggi, totalPoin: nextPoin, updatedAt: new Date().toISOString() })
    setSkor(updated)
    const all = await SkorAPI.listAll().catch(() => [])
    setLeaderboard([...all].sort((a, b) => b.totalPoin - a.totalPoin).slice(0, 5))
    return { updated, nextPoin, nextTertinggi, score }
  }, [skor])

  const tukarTiket = useCallback(async () => {
    if (lastScore === null || lastScore < STREAK_TIKET) throw new Error(`Butuh streak ${STREAK_TIKET} tanpa mati, skor terakhir kamu ${lastScore ?? 0}`)
    const kode = `KLK-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const newTiket = await TiketAPI.create({
      profilId: PROFIL_ID,
      poinDibutuhkan: STREAK_TIKET,
      status: 'tersedia',
      kode,
      tanggalTukar: new Date().toISOString().slice(0, 10),
    })
    // tidak potong totalPoin (unlimited) — cuma reset streak agar tidak double claim
    setTiket(prev => [...prev, newTiket])
    setLastScore(null) // harus main lagi streak 60 baru bisa tukar lagi
    // update updatedAt biar reset Sabtu tetap track
    const updated = await SkorAPI.update(skor.id, { updatedAt: new Date().toISOString() })
    setSkor(updated)
    return newTiket
  }, [skor, lastScore])

  const streakEligible = lastScore !== null && lastScore >= STREAK_TIKET
  const nextSaturday = getLastSaturday00(new Date())
  // hitung Sabtu depan untuk info
  const saturdayNext = new Date(nextSaturday); saturdayNext.setDate(saturdayNext.getDate() + 7)

  return { game, skor, tiket, leaderboard, loading, error, reload: load, onGameOver, tukarTiket, STREAK_TIKET, lastScore, streakEligible, setLastScore, saturdayNext }
}
