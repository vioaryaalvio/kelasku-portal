import { motion } from 'framer-motion'
import { Construction } from 'lucide-react'

export default function Placeholder({ title, desc }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white border border-[#E2E8F0] p-10 lg:p-12 text-center shadow-card">
      <div className="h-12 w-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] grid place-items-center mx-auto">
        <Construction size={20} strokeWidth={1.75} />
      </div>
      <h2 className="mt-4 text-[18px] font-semibold tracking-tight text-[#0F172A]">{title}</h2>
      <p className="text-[13px] leading-relaxed text-[#475569] mt-2 max-w-[480px] mx-auto">{desc}</p>
      <div className="mt-5 inline-flex text-[11px] font-medium tracking-[0.04em] bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] px-3 py-1.5 rounded-full">Segera hadir — fase berikutnya</div>
    </motion.div>
  )
}
