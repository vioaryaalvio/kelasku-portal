export function isToday(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export function isOverdue(dateStr) {
  return new Date(dateStr) < new Date() && !isToday(dateStr)
}

export function diffLabel(dateStr) {
  const now = new Date()
  const t = new Date(dateStr)
  const diffMs = t - now
  const diffH = Math.floor(diffMs / (1000*60*60))
  const diffD = Math.floor(diffMs / (1000*60*60*24))
  if (isOverdue(dateStr)) return { label: 'Terlambat', tone: 'danger' }
  if (isToday(dateStr)) {
    if (diffH <= 0) return { label: 'Hari ini • segera', tone: 'warning' }
    return { label: `Hari ini • ${diffH} jam lagi`, tone: 'warning' }
  }
  if (diffD === 1) return { label: 'Besok', tone: 'info' }
  if (diffD > 1) return { label: `${diffD} hari lagi`, tone: 'neutral' }
  return { label: `${Math.abs(diffH)} jam lalu`, tone: 'danger' }
}

export const prioritasStyle = {
  tinggi: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
  sedang: 'bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]',
  rendah: 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]',
}
