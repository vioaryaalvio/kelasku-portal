import { motion } from 'framer-motion'
import { Timer, AlertTriangle, Check } from 'lucide-react'
import { diffLabel, prioritasStyle } from '../utils/date'

export default function TenggatTerdekat({ tasks = [], mapelMap = {}, onToggle, max = 4 }) {
  const list = tasks.slice(0, max)
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl bg-white border border-[#E2E8F0] shadow-card overflow-hidden"
    >
      <div className="px-6 lg:px-8 py-6 border-b border-[#E2E8F0]">
        <h2 className="text-[15px] font-semibold tracking-tight text-[#0F172A] flex items-center gap-2.5">
          <span className="h-7 w-7 rounded-lg bg-[#0F172A] text-white grid place-items-center">
            <Timer size={14} strokeWidth={1.75} />
          </span>
          Tenggat Terdekat
        </h2>
        <p className="text-[12px] leading-relaxed text-[#475569] mt-1">Diurut dari yang paling mepet — kerjakan nomor 1 dulu.</p>
      </div>

      <div className="p-4 lg:p-5 space-y-3">
        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-8 text-center">
            <div className="h-10 w-10 rounded-xl bg-white border border-[#E2E8F0] grid place-items-center mx-auto text-[#16A34A]">✓</div>
            <div className="mt-3 text-[13px] font-medium text-[#0F172A]">Semua aman</div>
            <div className="text-[12px] text-[#475569] mt-1">Tidak ada tenggat mendesak — tugas masih longgar.</div>
          </div>
        ) : (
          list.map((t, idx) => {
            const d = diffLabel(t.tenggat)
            const isTop = idx === 0
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * idx }}
                className={`rounded-xl border p-4 flex gap-3.5 ${isTop ? 'bg-white border-[#1E40AF]/20 shadow-sm' : 'bg-white border-[#E2E8F0]'}`}
              >
                <div
                  className={`shrink-0 h-8 w-8 rounded-lg grid place-items-center text-[12px] font-semibold ${isTop ? 'bg-[#1E40AF] text-white' : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569]'}`}
                  title={`Urutan ${idx + 1}`}
                  aria-label={`Urutan ${idx + 1}`}
                >
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="text-[13px] font-medium leading-snug text-[#0F172A] line-clamp-2">{t.judul}</div>
                  <div className="text-[11px] text-[#64748b]">
                    {mapelMap[t.mapelId]} • {new Date(t.tenggat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${prioritasStyle[t.prioritas]}`}>{t.prioritas}</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${d.tone === 'danger' ? 'bg-[#DC2626] text-white' : d.tone === 'warning' ? 'bg-[#1E40AF] text-white' : 'bg-[#0F172A] text-white'}`}>
                      {d.label}
                    </span>
                    {isTop && <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EFF6FF] border border-[#DBEAFE] text-[#1E40AF]">paling mepet</span>}
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggle?.(t.id)}
                  className="shrink-0 self-start h-8 w-8 rounded-full border border-[#E2E8F0] bg-white grid place-items-center hover:border-[#1E40AF] hover:text-[#1E40AF] transition text-[#475569]"
                  aria-label="Tandai selesai"
                  title="Tandai selesai"
                >
                  <Check size={13} strokeWidth={1.75} />
                </motion.button>
              </motion.div>
            )
          })
        )}
      </div>

      <div className="px-6 lg:px-8 pb-6">
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-2.5 flex items-start gap-2.5 text-[12px] leading-relaxed text-[#475569]">
          <AlertTriangle size={14} className="text-[#475569] mt-0.5 shrink-0" strokeWidth={1.75} />
          <span>Urutan menunjukkan urgensi. Selesaikan yang paling atas lebih dulu untuk menghindari terlambat.</span>
        </div>
      </div>
    </motion.div>
  )
}
