import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock3, CalendarDays, AlertTriangle, CheckCircle2, Timer, Filter, BookOpen } from 'lucide-react'
import { useTugas } from '../hooks/useTugas'
import { isToday, isOverdue, diffLabel, prioritasStyle } from '../utils/date'
import TugasHariIni from '../components/TugasHariIni'
import TenggatTerdekat from '../components/TenggatTerdekat'
import RingkasanProgres from '../components/RingkasanProgres'
import Toast from '../components/Toast'

export default function Dashboard() {
  const { tugas, mapelMap, profile, toggleSelesai, stats, loading, error, usingFallback } = useTugas()
  const [filter, setFilter] = useState('semua')
  const [q, setQ] = useState('')
  const [toast, setToast] = useState(null)

  const handleToggle = async (id) => {
    const t = tugas.find(x => x.id === id)
    const wasDone = t?.selesai
    try {
      await toggleSelesai(id)
      const msg = wasDone ? `“${t.judul}” dikembalikan jadi belum selesai` : `Selesai — “${t.judul}” ditandai beres`
      setToast(msg)
    } catch (e) {
      setToast(`Gagal simpan ke localhost:3001 — ${e.message}`)
    }
    setTimeout(() => setToast(null), 2200)
  }

  const hariIniList = useMemo(() => tugas.filter(t => isToday(t.tenggat)), [tugas])
  const tenggatTerdekat = useMemo(() => {
    return [...tugas]
      .filter(t => !t.selesai)
      .sort((a, b) => new Date(a.tenggat) - new Date(b.tenggat))
      .slice(0, 4)
  }, [tugas])
  const terlambat = useMemo(() => tugas.filter(t => isOverdue(t.tenggat) && !t.selesai), [tugas])

  const filtered = useMemo(() => {
    let arr = [...tugas]
    if (filter === 'belum') arr = arr.filter(t => !t.selesai)
    if (filter === 'selesai') arr = arr.filter(t => t.selesai)
    if (filter === 'hariIni') arr = arr.filter(t => isToday(t.tenggat))
    if (q) {
      const s = q.toLowerCase()
      arr = arr.filter(t => t.judul.toLowerCase().includes(s) || mapelMap[t.mapelId]?.toLowerCase().includes(s))
    }
    arr.sort((a, b) => {
      if (a.selesai !== b.selesai) return a.selesai ? 1 : -1
      return new Date(a.tenggat) - new Date(b.tenggat)
    })
    return arr
  }, [tugas, filter, q, mapelMap])

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 11) return 'Pagi'
    if (h < 15) return 'Siang'
    if (h < 18) return 'Sore'
    return 'Malam'
  }, [])

  if (loading) return <div className="rounded-2xl bg-white border border-[#E2E8F0] p-10 text-center text-sm text-[#64748B]">Memuat tugas dari localhost:3001...</div>

  return (
    <div className="space-y-8">
      {usingFallback && (
        <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] px-4 py-3 flex items-center gap-2 text-[12px] text-[#92400E]">
          <AlertTriangle size={14} /> Server localhost:3001 tidak terhubung — pakai data lokal (localStorage). Jalankan <code className="bg-white border border-[#FDE68A] px-1.5 py-0.5 rounded-md">npm run server</code> untuk persist ke db.json
        </div>
      )}
      {error && !usingFallback && (
        <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] px-4 py-3 text-[12px] text-[#991B1B]">{error}</div>
      )}
      {/* Helper — subtle, not dark AI slop */}
      <div className="rounded-xl bg-white border border-[#E2E8F0] px-4 py-3 flex items-start gap-3">
        <span className="shrink-0 h-8 w-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] grid place-items-center text-[#1E40AF]">
          <BookOpen size={15} strokeWidth={1.75} />
        </span>
        <div className="text-[13px] leading-[1.5] text-[#334155] min-w-0">
          <span className="font-semibold text-[#0F172A]">Cara pakai halaman ini:</span> centang tugas yang sudah selesai — progres otomatis ter-update. Fokus dulu ke tugas hari ini.
        </div>
      </div>

      {/* Header — generous whitespace, no dense badges */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[12px] text-[#475569]">
            <CalendarDays size={14} className="text-[#1E40AF]" strokeWidth={1.75} />
            <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="h-1 w-1 rounded-full bg-[#CBD5E1]" />
            <span className="font-medium text-[#0F172A]">{hariIniList.length} tugas hari ini</span>
          </div>
          <h1 className="text-[28px] lg:text-[30px] font-semibold tracking-tight leading-none text-[#0F172A]">
            Selamat {greeting}, {profile?.nama?.split(' ')[0] || 'Siswa'}
          </h1>
          <p className="text-[13px] leading-relaxed text-[#475569] max-w-[560px]">
            Semua tugas dan tenggat terdekat ada di satu tempat. Tandai yang sudah beres supaya tidak menumpuk.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[#475569] bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5">
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#16A34A]" />{stats.selesai} selesai</span>
          <span className="h-4 w-px bg-[#E2E8F0]" />
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#E2E8F0] border border-[#CBD5E1]" />{stats.belum} belum</span>
        </div>
      </div>

      {/* Progress + Stats — spacious, calm colors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <RingkasanProgres total={stats.total} selesai={stats.selesai} belum={stats.belum} pct={stats.pct} terlambat={terlambat.length} />
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} className="rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-card">
            <div className="h-9 w-9 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] grid place-items-center text-[#1E40AF]">
              <CalendarDays size={18} strokeWidth={1.75} />
            </div>
            <div className="mt-5 text-[11px] font-medium tracking-[0.06em] text-[#64748B] uppercase">Tugas Hari Ini</div>
            <div className="mt-1 text-[30px] font-semibold leading-none tracking-tight text-[#0F172A]">{hariIniList.length}</div>
            <div className="mt-1 text-[12px] text-[#475569]">{hariIniList.filter(t => !t.selesai).length} belum • {hariIniList.filter(t => t.selesai).length} selesai</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-card">
            <div className="h-9 w-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] grid place-items-center text-[#475569]">
              <Timer size={18} strokeWidth={1.75} />
            </div>
            <div className="mt-5 text-[11px] font-medium tracking-[0.06em] text-[#64748B] uppercase">Tenggat Terdekat</div>
            {tenggatTerdekat[0] ? (
              <>
                <div className="mt-1 text-[13px] font-semibold leading-snug line-clamp-2 text-[#0F172A]">{tenggatTerdekat[0].judul}</div>
                <div className="mt-1 text-[12px] text-[#475569]">{diffLabel(tenggatTerdekat[0].tenggat).label} • {mapelMap[tenggatTerdekat[0].mapelId]}</div>
              </>
            ) : (
              <div className="mt-2 text-[13px] text-[#475569]">Tidak ada tenggat mendesak.</div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-card">
            <div className="h-9 w-9 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] grid place-items-center text-[#16A34A]">
              <Check size={18} strokeWidth={1.75} />
            </div>
            <div className="mt-5 text-[11px] font-medium tracking-[0.06em] text-[#64748B] uppercase">Selesai</div>
            <div className="mt-1 text-[30px] font-semibold leading-none text-[#0F172A]">
              {stats.selesai}<span className="text-[16px] font-medium text-[#64748B]">/{stats.total}</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
              <div className="h-full bg-[#16A34A]" style={{ width: `${stats.pct}%` }} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Daftar Hari Ini + Tenggat — breathing room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <TugasHariIni tasks={hariIniList} mapelMap={mapelMap} onToggle={handleToggle} />
        </div>
        <div className="lg:col-span-5">
          <TenggatTerdekat tasks={tenggatTerdekat} mapelMap={mapelMap} onToggle={handleToggle} />
        </div>
      </div>

      {/* Semua Tugas — calmer table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl bg-white border border-[#E2E8F0] shadow-card overflow-hidden">
        <div className="px-6 lg:px-8 py-6 flex flex-col lg:flex-row lg:items-center gap-6 border-b border-[#E2E8F0]">
          <div className="space-y-1">
            <h2 className="text-[16px] font-semibold tracking-tight text-[#0F172A]">Semua Tugas</h2>
            <p className="text-[12px] text-[#475569]">Filter dan tandai selesai langsung di daftar ini.</p>
          </div>
          <div className="lg:ml-auto flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-1">
              {[
                { id: 'semua', label: `Semua (${tugas.length})` },
                { id: 'belum', label: `Belum (${tugas.filter(t => !t.selesai).length})` },
                { id: 'selesai', label: `Selesai (${tugas.filter(t => t.selesai).length})` },
                { id: 'hariIni', label: `Hari ini (${hariIniList.length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium min-h-[36px] transition ${filter === tab.id ? 'bg-[#0F172A] text-white shadow-sm' : 'text-[#475569] hover:text-[#0F172A] hover:bg-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 rounded-xl bg-white border border-[#E2E8F0] px-3 py-2 focus-within:ring-2 focus-within:ring-[#1E40AF]/20 focus-within:border-[#1E40AF]">
              <Filter size={14} className="text-[#64748B]" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari judul atau mapel" className="outline-none text-[13px] w-40 placeholder:text-[#64748B] bg-transparent" aria-label="Cari tugas" />
            </label>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F8FAFC] text-[11px] font-medium tracking-[0.06em] text-[#475569] uppercase">
                <tr>
                  <th className="px-5 py-3.5 w-12 font-medium"></th>
                  <th className="px-5 py-3.5 font-medium">Tugas</th>
                  <th className="px-5 py-3.5 hidden md:table-cell font-medium">Mapel</th>
                  <th className="px-5 py-3.5 hidden lg:table-cell font-medium">Tenggat</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 w-16 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                <AnimatePresence initial={false}>
                  {filtered.map(t => {
                    const d = diffLabel(t.tenggat)
                    const overdue = isOverdue(t.tenggat) && !t.selesai
                    return (
                      <motion.tr
                        key={t.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`${t.selesai ? 'bg-[#F0FDF4]/60' : overdue ? 'bg-[#FEF2F2]/60' : 'bg-white'} hover:bg-[#F8FAFC]`}
                      >
                        <td className="px-5 py-4">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggle(t.id)}
                            className={`h-7 w-7 rounded-full border-2 grid place-items-center transition ${t.selesai ? 'bg-[#1E40AF] border-[#1E40AF] text-white' : 'border-[#CBD5E1] bg-white hover:border-[#1E40AF] text-transparent hover:text-[#1E40AF]'}`}
                            aria-label={t.selesai ? 'Batalkan selesai' : 'Tandai selesai'}
                            title={t.selesai ? 'Batalkan selesai' : 'Tandai selesai'}
                          >
                            <Check size={11} strokeWidth={2.5} />
                          </motion.button>
                        </td>
                        <td className="px-5 py-4">
                          <div className={`font-medium leading-snug ${t.selesai ? 'line-through text-[#64748B]' : 'text-[#0F172A]'}`}>{t.judul}</div>
                          <div className="text-[11px] text-[#64748b] line-clamp-1 mt-0.5">{t.deskripsi}</div>
                          <div className="md:hidden mt-2 flex gap-1.5">
                            <span className="text-[11px] bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-md">{mapelMap[t.mapelId]}</span>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${prioritasStyle[t.prioritas]}`}>{t.prioritas}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className="inline-flex items-center gap-1.5 text-[12px] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-full text-[#334155]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#1E40AF]" />{mapelMap[t.mapelId]}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <div className="text-[12px] text-[#334155]">{new Date(t.tenggat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</div>
                          <span className={`mt-1 inline-flex text-[11px] font-medium px-2 py-0.5 rounded-md ${d.tone === 'danger' ? 'bg-[#DC2626] text-white' : d.tone === 'warning' ? 'bg-[#1E40AF] text-white' : d.tone === 'info' ? 'bg-[#334155] text-white' : 'bg-[#E2E8F0] text-[#475569]'}`}>{d.label}</span>
                        </td>
                        <td className="px-5 py-4">
                          {t.selesai ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#16A34A] text-white px-2.5 py-1 rounded-full"><CheckCircle2 size={11} strokeWidth={1.75} />Selesai</span>
                          ) : overdue ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#DC2626] text-white px-2.5 py-1 rounded-full"><AlertTriangle size={11} strokeWidth={1.75} />Terlambat</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-white border border-[#E2E8F0] text-[#475569] px-2.5 py-1 rounded-full"><Clock3 size={11} strokeWidth={1.75} />Belum</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`hidden lg:inline-flex text-[11px] font-medium px-2 py-1 rounded-md border ${prioritasStyle[t.prioritas]}`}>{t.prioritas}</span>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
            {filtered.length === 0 && <div className="p-10 text-center text-sm text-[#64748b]">Tidak ada tugas yang cocok dengan filter.</div>}
          </div>
          <div className="mt-4 text-[11px] leading-relaxed text-[#64748B]">Klik lingkaran di kiri untuk tandai selesai — tersimpan otomatis di perangkat.</div>
        </div>
      </motion.div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  )
}
