import { useEffect, useState, useMemo, useCallback } from 'react'
import { getStorage, setStorage, KEYS, ensureInitialData } from '../utils/storage'
import { mockMapel, mockProfile, mockTugas, mockMateri } from '../data/mock'
import { TugasAPI, MapelAPI, ProfilAPI } from '../services/api'

export function useTugas() {
  const [tugas, setTugas] = useState([])
  const [mapel, setMapel] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [tugasData, mapelData, profilData] = await Promise.all([
        TugasAPI.list(),
        MapelAPI.list().catch(() => mockMapel),
        ProfilAPI.list().catch(() => [mockProfile]),
      ])
      setTugas(tugasData)
      setMapel(mapelData)
      setProfile(Array.isArray(profilData) ? profilData[0] : profilData)
      setUsingFallback(false)
      // sync to localStorage as cache
      setStorage(KEYS.TUGAS, tugasData)
      setStorage(KEYS.MAPEL, mapelData)
      setStorage(KEYS.PROFILE, Array.isArray(profilData) ? profilData[0] : profilData)
    } catch (e) {
      console.warn('API gagal, fallback ke localStorage:', e.message)
      setUsingFallback(true)
      setError(e.message)
      ensureInitialData({ mapel: mockMapel, tugas: mockTugas, materi: mockMateri, profile: mockProfile })
      setTugas(getStorage(KEYS.TUGAS, mockTugas))
      setMapel(getStorage(KEYS.MAPEL, mockMapel))
      setProfile(getStorage(KEYS.PROFILE, mockProfile))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const toggleSelesai = useCallback(async (id) => {
    const target = tugas.find(t => t.id === id)
    if (!target) return
    const nextVal = !target.selesai

    // optimistic
    setTugas(prev => {
      const next = prev.map(t => t.id === id ? { ...t, selesai: nextVal } : t)
      setStorage(KEYS.TUGAS, next)
      return next
    })

    if (usingFallback) return // already saved locally

    try {
      await TugasAPI.toggle(id, nextVal)
    } catch (e) {
      console.error('PATCH gagal, rollback:', e)
      setTugas(prev => {
        const rollback = prev.map(t => t.id === id ? { ...t, selesai: !nextVal } : t)
        setStorage(KEYS.TUGAS, rollback)
        return rollback
      })
      setError(e.message)
      throw e
    }
  }, [tugas, usingFallback])

  const mapelMap = useMemo(() => {
    const m = {}
    mapel.forEach(x => m[x.id] = x.namaMapel)
    return m
  }, [mapel])

  const stats = useMemo(() => {
    const total = tugas.length
    const selesai = tugas.filter(t => t.selesai).length
    const belum = total - selesai
    const pct = total ? Math.round((selesai / total) * 100) : 0
    return { total, selesai, belum, pct }
  }, [tugas])

  return { tugas, mapel, mapelMap, profile, toggleSelesai, stats, setTugas, loading, error, usingFallback, reload: load }
}
