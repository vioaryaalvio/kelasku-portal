import { motion, AnimatePresence } from 'framer-motion'
import { Check, CalendarDays, CheckCircle2 } from 'lucide-react'
import { isOverdue, diffLabel, prioritasStyle } from '../utils/date'

export default function TugasHariIni({ tasks = [], mapelMap = {}, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-white border border-[#E2E8F0] shadow-card overflow-hidden"
    >
      <div className="px-6 lg:px-8 py-6 flex items-start justify-between gap-4 border-b border-[#E2E8F0]">
        <div className="space-y-1">
          <h2 className="text-[15px] font-semibold tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] grid place-items-center text-[#1E40AF]">
              <CalendarDays size={14} strokeWidth={1.75} />
            </span>
            Daftar Tugas Hari Ini
          </h2>
          <p className="text-[12px] leading-relaxed text-[#475569]">Fokus ke yang hari ini dulu — lebih ringan.</p>
        </div>
        <span className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#0F172A] text-white">{tasks.length} tugas</span>
      </div>

      <div className="p-4 lg:p-5 space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-8 text-center">
            <div className="h-10 w-10 rounded-xl bg-white border border-[#E2E8F0] grid place-items-center mx-auto text-[#16A34A]">
              <CheckCircle2 size={18} strokeWidth={1.75} />
            </div>
            <div className="mt-3 text-[13px] font-medium text-[#0F172A]">Tidak ada tugas hari ini</div>
            <div className="text-[12px] text-[#475569] mt-1 leading-relaxed">Waktu luang — cicil tugas besok atau baca materi.</div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {tasks.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <TaskRow t={t} mapel={mapelMap[t.mapelId]} onToggle={() => onToggle?.(t.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="px-6 lg:px-8 pb-6">
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-2.5 flex items-center gap-2.5 text-[11px] leading-relaxed text-[#475569]">
            <span className="h-7 w-7 rounded-full bg-white border border-[#E2E8F0] grid place-items-center text-[#1E40AF] text-[11px] font-medium">✓</span>
            Klik lingkaran di kiri untuk tandai selesai — langsung tersimpan.
          </div>
        </div>
      )}
    </motion.div>
  )
}

function TaskRow({ t, mapel, onToggle }) {
  const d = diffLabel(t.tenggat)
  const overdue = isOverdue(t.tenggat) && !t.selesai
  return (
    <div
      className={`group flex gap-4 rounded-xl border p-4 transition ${t.selesai ? 'bg-[#F0FDF4] border-[#BBF7D0]' : overdue ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-subtle'}`}
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={`shrink-0 h-7 w-7 rounded-full border-2 grid place-items-center transition mt-0.5 ${t.selesai ? 'bg-[#1E40AF] border-[#1E40AF] text-white' : 'bg-white border-[#CBD5E1] hover:border-[#1E40AF] text-transparent hover:text-[#1E40AF]'}`}
        aria-label={t.selesai ? 'Batalkan selesai' : 'Tandai selesai'}
        title={t.selesai ? 'Batalkan selesai' : 'Tandai selesai'}
      >
        <Check size={12} strokeWidth={2.5} />
      </motion.button>
      <div className="min-w-0 flex-1 space-y-1">
        <div className={`text-[13px] font-medium leading-snug ${t.selesai ? 'line-through text-[#64748B]' : 'text-[#0F172A]'}`}>{t.judul}</div>
        <div className="text-[12px] leading-relaxed text-[#475569] line-clamp-2">{t.deskripsi}</div>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-medium bg-[#0F172A] text-white px-2 py-0.5 rounded-md">{mapel}</span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${prioritasStyle[t.prioritas]}`}>{t.prioritas}</span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${d.tone === 'danger' ? 'bg-[#DC2626] text-white' : d.tone === 'warning' ? 'bg-[#1E40AF] text-white' : 'bg-[#E2E8F0] text-[#475569]'}`}>
            {d.label}
          </span>
        </div>
      </div>
      <div className="shrink-0 text-right hidden sm:block min-w-[56px]">
        <div className="text-[11px] font-medium text-[#0F172A]">{new Date(t.tenggat).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="text-[11px] text-[#64748B]">{new Date(t.tenggat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
      </div>
    </div>
  )
}
