import jsPDF from 'jspdf'

export function downloadTiketPDF(tiket, profil) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'A5' })
  const W = 148, H = 210
  // border
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.4)
  doc.rect(8, 8, W - 16, H - 16, 'S')
  // header bar
  doc.setFillColor(15, 23, 42)
  doc.rect(8, 8, W - 16, 14, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('KELASKU — TIKET DISKON KAFE', W / 2, 17, { align: 'center' })
  // body
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Detail Tiket', 14, 30)
  doc.setDrawColor(226, 232, 240)
  doc.line(14, 31, W - 14, 31)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  let y = 38
  const line = (label, value) => { doc.setFont('helvetica', 'bold'); doc.text(`${label}:`, 14, y); doc.setFont('helvetica', 'normal'); doc.text(String(value), 38, y); y += 7 }
  line('Nama', profil?.nama || 'Siswa')
  line('Kelas', profil?.kelas || '-')
  line('Kode', tiket.kode)
  line('Tanggal Tukar', tiket.tanggalTukar)
  line('Poin', `${tiket.poinDibutuhkan} poin`)
  line('Status', tiket.status)

  // QR placeholder box
  const qrX = W - 44, qrY = 36, qrS = 28
  doc.setDrawColor(30, 64, 175)
  doc.setLineWidth(0.6)
  doc.rect(qrX, qrY, qrS, qrS)
  doc.setFontSize(6)
  doc.setTextColor(30, 64, 175)
  doc.text('QR', qrX + qrS / 2, qrY + qrS / 2, { align: 'center' })
  doc.setFontSize(5)
  doc.setTextColor(71, 85, 105)
  doc.text(tiket.kode, qrX + qrS / 2, qrY + qrS + 4, { align: 'center' })

  // syarat
  y += 4
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(71,85,105); doc.text('Syarat:', 14, y); y+=4
  doc.setFont('helvetica','normal'); doc.setFontSize(7)
  doc.text('• Tunjukkan tiket ini ke kasir kafe', 14, y); y+=4
  doc.text('• Berlaku 1x pakai, tidak dapat digabung promo lain', 14, y); y+=4
  doc.text('• Kode unik, jangan bagikan', 14, y)

  // footer
  doc.setFontSize(6); doc.setTextColor(148,163,184)
  doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')} • Simpan PDF ini atau print`, 14, H - 12)
  doc.text('KelasKu Portal Tugas Siswa • Data: localhost:3001', 14, H - 8)

  doc.save(`tiket-${tiket.kode}.pdf`)
}

export function printTiket(tiket, profil) {
  const html = `
  <html><head><meta charset="utf-8"><title>Tiket ${tiket.kode}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    body{font-family:Inter,sans-serif;padding:24px;color:#0F172A;max-width:520px;margin:auto}
    .card{border:1px solid #E2E8F0;border-radius:12px;overflow:hidden}
    .head{background:#0F172A;color:white;padding:14px 20px;font-weight:700;text-align:center;letter-spacing:0.04em;font-size:13px}
    .body{padding:20px;line-height:1.6;font-size:13px}
    .row{display:flex;gap:8px;margin:6px 0}.label{font-weight:600;min-width:90px}
    .qr{border:1.5px solid #1E40AF;width:100px;height:100px;display:grid;place-items:center;margin:16px auto;font-size:11px;color:#1E40AF;border-radius:8px}
    .foot{font-size:10px;color:#94A3B8;text-align:center;margin-top:16px}
    @media print{button{display:none}}
  </style></head><body>
  <div class="card">
    <div class="head">KELASKU — TIKET DISKON KAFE</div>
    <div class="body">
      <div class="row"><span class="label">Nama:</span><span>${profil?.nama || 'Siswa'} (${profil?.kelas || '-'})</span></div>
      <div class="row"><span class="label">Kode:</span><strong>${tiket.kode}</strong></div>
      <div class="row"><span class="label">Tanggal:</span><span>${tiket.tanggalTukar}</span></div>
      <div class="row"><span class="label">Poin:</span><span>${tiket.poinDibutuhkan} poin</span></div>
      <div class="qr">${tiket.kode}</div>
      <div style="font-size:11px;color:#475569">Tunjukkan ke kasir kafe. Berlaku 1x pakai.</div>
      <div class="foot">Dicetak ${new Date().toLocaleString('id-ID')} • KelasKu • localhost:3001</div>
      <div style="text-align:center;margin-top:14px"><button onclick="window.print()" style="padding:8px 16px;border-radius:8px;border:1px solid #E2E8F0;background:white;cursor:pointer">Print</button></div>
    </div>
  </div>
  <script>window.onload=()=>setTimeout(()=>window.print(),300)</script>
  </body></html>`
  const w = window.open('', '_blank')
  if (!w) { alert('Pop-up diblokir, aktifkan pop-up untuk print'); return }
  w.document.write(html)
  w.document.close()
}
