import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Gamepad2, Ticket, Download, Printer, Crown, Medal, Star, AlertCircle, Sparkles, Zap, Clock } from 'lucide-react'
import FlappyBird from '../games/FlappyBird'
import { useGame } from '../hooks/useGame'
import { useTugas } from '../hooks/useTugas'
import { downloadTiketPDF, printTiket } from '../utils/pdfTicket'
import Toast from '../components/Toast'

export default function Games() {
  const { profile } = useTugas()
  const { skor, tiket, leaderboard, loading, error, onGameOver, tukarTiket, STREAK_TIKET, lastScore, streakEligible, saturdayNext, reload } = useGame()
  const [toast, setToast] = useState(null)
  const [tukarLoading, setTukarLoading] = useState(false)

  const handleGameOver = async (score) => {
    try {
      await onGameOver(score)
      if (score >= STREAK_TIKET) {
        setToast(`Keren! Streak ${score} — kamu bisa tukar tiket sekarang!`)
      } else {
        setToast(`Skor ${score} — butuh ${STREAK_TIKET - score} lagi untuk streak ${STREAK_TIKET}`)
      }
      setTimeout(() => setToast(null), 2800)
    } catch (e) {
      setToast(`Gagal simpan: ${e.message}`)
      setTimeout(() => setToast(null), 2400)
    }
  }

  const handleTukar = async () => {
    setTukarLoading(true)
    try {
      const newTiket = await tukarTiket()
      setToast(`Tiket ${newTiket.kode} berhasil — tunjukkan PDF di kafe`)
      setTimeout(() => setToast(null), 3000)
    } catch (e) {
      setToast(e.message)
      setTimeout(() => setToast(null), 2600)
    } finally { setTukarLoading(false) }
  }

  const totalPoin = skor?.totalPoin || 0
  const high = skor?.skorTertinggi || 0

  if (loading) {
    return <div className="rounded-2xl bg-white border border-[#E2E8F0] p-8 text-center text-sm text-[#64748B]">Memuat game & poin...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.06em] text-[#64748B] uppercase">
          <Gamepad2 size={14} strokeWidth={1.75} className="text-[#1E40AF]" /> Games & Poin
        </div>
        <h1 className="text-[26px] lg:text-[28px] font-semibold tracking-tight text-[#0F172A]">Main, streak 60, tukar tiket</h1>
        <p className="text-[13px] leading-relaxed text-[#475569] max-w-[620px]">
          Skor unlimited tersimpan. Tapi untuk <b className="text-[#0F172A]">tiket harus streak {STREAK_TIKET} tanpa mati dalam 1x main</b> — tidak boleh dicicil. Total poin direset tiap <b>Sabtu 00:00</b> (mingguan) biar adil, jaga toko tidak rugi.
        </p>
        <div className="inline-flex items-center gap-2 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] px-3 py-2 text-[11px] text-[#92400E]">
          <Clock size={12} /> Reset berikutnya: Sabtu, {saturdayNext?.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} 00:00
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-card">
          <div className="h-9 w-9 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] grid place-items-center text-[#1E40AF]"><Star size={18} strokeWidth={1.75} /></div>
          <div className="mt-4 text-[11px] font-medium tracking-[0.06em] text-[#64748B] uppercase">Total Poin (unlimited)</div>
          <div className="text-[28px] font-semibold tracking-tight text-[#0F172A]">{totalPoin}</div>
          <div className="text-[11px] text-[#475569]">Reset tiap Sabtu 00:00</div>
        </div>
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-card">
          <div className="h-9 w-9 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] grid place-items-center text-[#16A34A]"><Trophy size={18} strokeWidth={1.75} /></div>
          <div className="mt-4 text-[11px] font-medium tracking-[0.06em] text-[#64748B] uppercase">Skor Tertinggi</div>
          <div className="text-[28px] font-semibold tracking-tight text-[#0F172A]">{high}</div>
          <div className="text-[11px] text-[#475569]">Rekor pribadimu</div>
        </div>
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-card">
          <div className="h-9 w-9 rounded-xl bg-[#FEF2F2] border border-[#FECACA] grid place-items-center text-[#DC2626]"><Zap size={18} strokeWidth={1.75} /></div>
          <div className="mt-4 text-[11px] font-medium tracking-[0.06em] text-[#64748B] uppercase">Streak Terakhir</div>
          <div className="text-[28px] font-semibold tracking-tight text-[#0F172A]">{lastScore ?? '-'}</div>
          <div className="text-[11px] text-[#475569]">{lastScore === null ? 'Belum main' : lastScore >= STREAK_TIKET ? 'Siap tukar tiket!' : `Butuh ${STREAK_TIKET - lastScore} lagi`}</div>
          {lastScore !== null && (
            <div className="mt-3 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full bg-[#DC2626]" style={{ width: `${Math.min(100, (lastScore / STREAK_TIKET) * 100)}%` }} /></div>
          )}
        </div>
      </div>

      {error && <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] px-4 py-3 text-[12px] text-[#991B1B] flex items-center gap-2"><AlertCircle size={14} /> {error} — cek `npm run server` di :3001</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Game Canvas */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-card p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-7 w-7 rounded-lg bg-[#0F172A] text-white grid place-items-center"><Gamepad2 size={14} /></span>
            <h2 className="text-[15px] font-semibold tracking-tight text-[#0F172A]">Flappy Bird</h2>
            <span className="ml-auto text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]">Streak {STREAK_TIKET} untuk tiket</span>
          </div>
          <FlappyBird onGameOver={handleGameOver} />
        </div>

        {/* Tukar & Leaderboard */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white border border-[#E2E8F0] shadow-card p-6">
            <h3 className="text-[14px] font-semibold text-[#0F172A] flex items-center gap-2"><Ticket size={16} /> Tukar Tiket Diskon</h3>
            <p className="text-[12px] leading-relaxed text-[#475569] mt-1">Syarat: <b>streak {STREAK_TIKET} tanpa mati</b> dalam 1x main. Poin tetap kesimpen unlimited, tapi tiket hanya keluar kalau streak tercapai.</p>
            <div className="mt-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
              <div className="text-[11px] font-medium tracking-[0.06em] text-[#64748B] uppercase">Skor streak terakhir</div>
              <div className="text-[22px] font-semibold text-[#0F172A]">{lastScore ?? '-'} <span className="text-[12px] font-normal text-[#64748B]">/ {STREAK_TIKET}</span></div>
              {lastScore !== null && (
                <div className="mt-2 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden"><div className={`h-full ${streakEligible ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}`} style={{ width: `${Math.min(100, (lastScore / STREAK_TIKET) * 100)}%` }} /></div>
              )}
              <div className="mt-2 text-[11px] text-[#475569]">{streakEligible ? 'Streak terpenuhi — bisa tukar sekarang' : lastScore === null ? 'Main dulu untuk dapat streak' : `Kurang ${STREAK_TIKET - lastScore} poin lagi`}</div>
            </div>
            <button
              disabled={!streakEligible || tukarLoading}
              onClick={handleTukar}
              className={`mt-4 w-full rounded-xl py-3 text-[13px] font-semibold min-h-[44px] transition flex items-center justify-center gap-2 ${streakEligible ? 'bg-[#1E40AF] text-white hover:bg-[#1E3A8A] shadow-sm' : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'}`}
            >
              {tukarLoading ? 'Menukar...' : streakEligible ? <><Sparkles size={14} /> Tukar Streak {STREAK_TIKET} jadi Tiket</> : 'Butuh Streak 60 dulu'}
            </button>
            <div className="mt-3 text-[11px] leading-relaxed text-[#64748B]">Setelah tukar, streak di-reset — harus main lagi {STREAK_TIKET} untuk tiket berikutnya. Total poin tidak terpotong (unlimited).</div>
          </div>

          <div className="rounded-2xl bg-white border border-[#E2E8F0] shadow-card p-6">
            <h3 className="text-[14px] font-semibold text-[#0F172A] flex items-center gap-2"><Crown size={16} className="text-[#D97706]" /> Papan Peringkat</h3>
            <p className="text-[11px] text-[#64748B] mt-1">Top 5 total poin (reset Sabtu)</p>
            <div className="mt-4 space-y-2">
              {leaderboard.length === 0 ? <div className="text-[12px] text-[#64748B]">Belum ada data.</div> : leaderboard.map((r, i) => (
                <div key={r.id} className={`flex items-center gap-3 rounded-xl border p-3 ${i === 0 ? 'bg-[#FFFBEB] border-[#FDE68A]' : 'bg-white border-[#E2E8F0]'}`}>
                  <span className={`h-7 w-7 rounded-lg grid place-items-center text-[11px] font-bold ${i === 0 ? 'bg-[#D97706] text-white' : i === 1 ? 'bg-[#64748B] text-white' : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569]'}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-[#0F172A] truncate">{r.profilId === 'siswa-1' ? 'Kamu — Aulia' : r.profilId} {r.profilId === 'siswa-1' && <span className="text-[10px] bg-[#1E40AF] text-white px-1.5 py-0.5 rounded-md ml-1">kamu</span>}</div>
                    <div className="text-[11px] text-[#64748B]">High {r.skorTertinggi} • Poin {r.totalPoin}</div>
                  </div>
                  {i === 0 && <Medal size={14} className="text-[#D97706]" />}
                </div>
              ))}
            </div>
            <button onClick={reload} className="mt-3 w-full rounded-xl border border-[#E2E8F0] py-2 text-[12px] font-medium hover:bg-[#F8FAFC]">Muat ulang</button>
          </div>
        </div>
      </div>

      {/* Daftar Tiket */}
      <div className="rounded-2xl bg-white border border-[#E2E8F0] shadow-card overflow-hidden">
        <div className="px-6 lg:px-8 py-6 border-b border-[#E2E8F0] flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-[#0F172A] flex items-center gap-2"><Ticket size={16} /> Tiket Kamu</h3>
            <p className="text-[12px] text-[#475569] mt-1">Setiap tiket butuh streak 60 — download PDF & print untuk kasir.</p>
          </div>
          <span className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#0F172A] text-white">{tiket.length} tiket</span>
        </div>
        <div className="p-4 lg:p-6">
          {tiket.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-8 text-center">
              <div className="h-10 w-10 rounded-xl bg-white border border-[#E2E8F0] grid place-items-center mx-auto text-[#475569]"><Ticket size={18} /></div>
              <div className="mt-3 text-[13px] font-medium text-[#0F172A]">Belum ada tiket</div>
              <div className="text-[12px] text-[#475569]">Capai streak {STREAK_TIKET} tanpa mati untuk dapat tiket pertama.</div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tiket.map(t => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-white grid place-items-center"><Ticket size={14} /></div>
                    <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534]">{t.status}</span>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium tracking-[0.06em] text-[#64748B] uppercase">Kode Tiket</div>
                    <div className="text-[15px] font-semibold tracking-tight text-[#0F172A] font-mono">{t.kode}</div>
                    <div className="text-[11px] text-[#475569] mt-1">Tukar: {t.tanggalTukar} • streak {t.poinDibutuhkan}</div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => downloadTiketPDF(t, profile)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1E40AF] text-white py-2.5 text-[12px] font-medium min-h-[40px] hover:bg-[#1E3A8A]"><Download size={14} /> Download PDF</button>
                    <button onClick={() => printTiket(t, profile)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-[#E2E8F0] py-2.5 text-[12px] font-medium min-h-[40px] hover:bg-[#F8FAFC]"><Printer size={14} /> Print</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  )
}
