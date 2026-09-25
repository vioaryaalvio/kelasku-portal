import { motion } from 'framer-motion'
import { CheckCircle2, Timer, AlertTriangle } from 'lucide-react'

export default function RingkasanProgres({ total = 0, selesai = 0, belum = 0, pct = 0, terlambat = 0 }) {
  const allDone = belum === 0 && total > 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-card flex flex-col"
    >
      <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.06em] text-[#64748B] uppercase">
        Ringkasan Progres
      </div>

      <div className="mt-5 flex items-center gap-6">
        <div className="relative h-[104px] w-[104px] shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="44" fill="none" stroke={allDone ? '#16A34A' : '#1E40AF'} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 44}
              initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - pct / 100) }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-[24px] font-semibold leading-none tracking-tight text-[#0F172A]">{pct}%</div>
              <div className="text-[11px] text-[#64748b]">selesai</div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="text-[13px] font-medium text-[#0F172A]">{selesai} dari {total} tugas beres</div>
          <div className="text-[12px] leading-relaxed text-[#475569]">
            {allDone ? 'Semua tugas kelar — pertahankan.' : `Sisa ${belum} tugas lagi.`}
          </div>
          <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} className={`h-full ${allDone ? 'bg-[#16A34A]' : 'bg-[#1E40AF]'}`} />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#166534] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 rounded-full">
              <CheckCircle2 size={12} strokeWidth={1.75} />{selesai} selesai
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-full">
              <Timer size={12} strokeWidth={1.75} />{belum} belum
            </span>
          </div>
        </div>
      </div>

      {terlambat > 0 ? (
        <div className="mt-5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] px-3.5 py-2.5 flex items-center gap-2.5 text-[12px] leading-relaxed text-[#991B1B]">
          <AlertTriangle size={15} className="shrink-0" strokeWidth={1.75} /> Ada {terlambat} tugas terlambat — cek daftar di bawah.
        </div>
      ) : (
        total > 0 && !allDone && (
          <div className="mt-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-2.5 text-[11px] leading-relaxed text-[#475569] flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-[#16A34A] text-white grid place-items-center text-[10px]">✓</span>
            Tidak ada yang terlambat — pertahankan ritmenya.
          </div>
        )
      )}
      {allDone && (
        <div className="mt-5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] px-3.5 py-2.5 text-[12px] font-medium text-[#166534]">Semua beres — kamu bisa cicil materi berikutnya.</div>
      )}
    </motion.div>
  )
}
