import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, UploadCloud, BarChart3, Gamepad2, HelpCircle, User, LogOut } from 'lucide-react'

const menu = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/materi', label: 'Materi', icon: BookOpen },
  { to: '/kumpul', label: 'Kumpul Tugas', icon: UploadCloud },
  { to: '/nilai', label: 'Riwayat Nilai', icon: BarChart3 },
  { to: '/games', label: 'Games Poin', icon: Gamepad2 },
  { to: '/panduan', label: 'Panduan', icon: HelpCircle },
]

export default function Sidebar({ onClose }) {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col bg-white border-r border-[#E2E8F0]">
      {/* Brand — clean, no blob */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#1E40AF] flex items-center justify-center text-white font-semibold text-[15px]">K</div>
          <div>
            <div className="font-semibold text-[16px] leading-none tracking-tight text-[#0F172A]">KelasKu</div>
            <div className="text-[11px] text-[#475569] mt-0.5">Portal Tugas Siswa</div>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2.5">
          <div className="text-[11px] font-medium text-[#334155] leading-snug">Hemat waktu, anti lupa</div>
          <div className="text-[11px] text-[#64748b]">Semua tugas dalam satu tempat.</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-medium tracking-[0.08em] text-[#64748B] uppercase">Menu</div>
        {menu.map(m => (
          <NavLink
            key={m.to}
            to={m.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors min-h-[44px] ${
                isActive ? 'bg-[#1E40AF] text-white' : 'text-[#334155] hover:bg-[#EFF6FF] hover:text-[#0F172A]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <m.icon size={18} strokeWidth={1.75} className={isActive ? 'text-white' : 'text-[#64748B]'} />
                <span className="flex-1">{m.label}</span>
                {m.label === 'Games Poin' && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-[#E8ECF1] text-[#475569]'}`}>
                    + poin
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/200?img=32" alt="Aulia Putri" className="h-9 w-9 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold leading-none text-[#0F172A] truncate">Aulia Putri</div>
            <div className="text-[11px] text-[#475569]">XI IPA 2</div>
          </div>
          <button aria-label="Keluar" className="h-8 w-8 rounded-lg hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] grid place-items-center text-[#64748b] transition">
            <LogOut size={14} />
          </button>
        </div>
        <NavLink
          to="/profil"
          onClick={onClose}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white py-2 text-[12px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] transition min-h-[40px]"
        >
          <User size={14} /> Atur Profil
        </NavLink>
        <div className="mt-3 text-center text-[10px] leading-relaxed text-[#64748B]">Data tersimpan di browser<br/>localStorage • tanpa server</div>
      </div>
    </aside>
  )
}
