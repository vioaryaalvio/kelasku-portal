import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-card border ${type === 'success' ? 'bg-[#0F172A] text-white border-[#1E293B]' : 'bg-white text-[#0F172A] border-[#E2E8F0]'}`}>
            <span className={`h-7 w-7 rounded-lg grid place-items-center shrink-0 ${type === 'success' ? 'bg-white text-[#0F172A]' : 'bg-[#F8FAFC] border border-[#E2E8F0]'}`}>
              <CheckCircle2 size={14} strokeWidth={1.75} />
            </span>
            <span className="text-[13px] leading-snug font-medium pr-2 max-w-[320px]">{message}</span>
            <button onClick={onClose} aria-label="Tutup" className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center shrink-0 transition">
              <X size={12} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
