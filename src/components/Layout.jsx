import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X, Bell, Search } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute left-0 top-0 h-full shadow-xl">
            <Sidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar — clean, spacious */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0]">
          <div className="flex items-center gap-4 px-4 lg:px-8 py-3.5">
            <button
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              className="lg:hidden h-10 w-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F8FAFC] transition"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="hidden md:block">
              <div className="text-[11px] font-medium text-[#64748B] tracking-[0.06em] uppercase">Selamat datang kembali</div>
              <div className="text-[13px] font-medium text-[#334155] -mt-0.5">Rabu, 18 September 2026</div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2">
                <Search size={15} className="text-[#64748B] shrink-0" />
                <input
                  placeholder="Cari tugas, materi..."
                  className="bg-transparent outline-none text-[13px] w-44 placeholder:text-[#64748B]"
                  aria-label="Cari tugas atau materi"
                />
              </div>

              <button aria-label="Notifikasi" className="relative h-10 w-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F8FAFC] transition">
                <Bell size={18} className="text-[#334155]" strokeWidth={1.75} />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#DC2626] ring-2 ring-white" aria-hidden />
              </button>

              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-[#E2E8F0]">
                <img src="https://i.pravatar.cc/200?img=12" className="h-8 w-8 rounded-full object-cover" alt="Avatar Axell" />
                <div className="hidden lg:block text-left leading-tight">
                  <div className="text-[13px] font-semibold text-[#0F172A]">Axell</div>
                  <div className="text-[11px] text-[#475569]">XI IPA 2</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-8 lg:py-10 max-w-[1280px] w-full mx-auto">
          <Outlet />
        </main>

        <footer className="px-4 lg:px-8 py-6 text-center text-[11px] text-[#64748B] border-t border-[#E2E8F0] mt-8">
          © 2026 KelasKu — Portal Tugas Siswa • Data disimpan lokal di perangkat
        </footer>
      </div>
    </div>
  )
}
