# KelasKu — Backend Localhost + Game Flappy Bird — Design Spec
**Date:** 2026-09-18
**Status:** Draft → awaiting user review
**Stack:** Vite + React 18 + Tailwind 3 (Inter) + Framer Motion + json-server :3001 + jsPDF

---

## 1. Overview & Goals

**Problem:** PRD awal menyimpan semua data di `localStorage` (tanpa server). User minta backend benar-benar jalan di `localhost` + modul game Flappy Bird yang terhubung ke sistem poin → tiket. Semua data harus pindah ke `db.json` dan tiket bisa download PDF + print.

**Goals:**
- 1 command jalan: frontend di `:5173` + JSON Server di `:3001`, data persist di file `db.json`.
- Semua 9 collections PRD tersedia via REST.
- Flappy Bird playable (Spasi/Tap/Klik) di dalam React, skor → poin, 120 poin = 1 tiket, PDF minimal, printable.
- Fallback ke `localStorage` jika server mati, jadi demo tetap jalan.
- YAGNI: tanpa auth, tanpa DB beneran, tanpa multiplayer.

**Non-Goals:** pagination, auth, validasi kompleks, deployment backend, 2+ game.

---

## 2. Architecture

```
┌─────────────────────────────┐      fetch (http://localhost:3001)      ┌──────────────────────┐
│ React Vite (5173)           │ ─────────────────────────────────────▶ │ JSON Server (3001)   │
│  src/services/api.js        │ ◀───────────────────────────────────── │  db.json (9 tables)  │
│  src/hooks/useTugas.js      │                                         │  REST auto-generated │
│  src/hooks/useGame.js       │                                         └──────────────────────┘
│  src/games/FlappyBird.jsx   │
│  src/utils/pdfTicket.js     │  fallback if fetch fails
│  src/data/mock.js (seed)    │ ─────▶ localStorage
└─────────────────────────────┘
```

- **Isolation:** `api.js` satu pintu keluar. `FlappyBird.jsx` pure canvas (tidak tahu soal tiket). `pdfTicket.js` pure `jsPDF` (tidak tahu soal API).
- **Scripts:** `npm run dev` (Vite only), `npm run server` (json-server), `npm run dev:all` (concurrently Vite + server). `npm run build` tetap client-only.
- **CORS:** json-server default `*`, no auth.
- **Prefers-reduced-motion:** canvas kurangi particle, CSS `* { animation-duration: 0.01ms }`.

---

## 3. Data Model & API Contract

**File `db.json` (root, committed):**
```json
{
  "profil": [{ "id": "siswa-1", "nama": "Axell", "kelas": "XI IPA 2", "foto": "https://i.pravatar.cc/200?img=32", "statusMasuk": true }],
  "mapel": [{ "id": "mapel-1", "namaMapel": "Matematika" }, { "id": "mapel-2", "namaMapel": "Bahasa Indonesia" }, ... 6 ],
  "tugas": [{ "id": "tugas-1", "mapelId": "mapel-1", "judul": "Latihan Soal Matriks", "deskripsi": "...", "tenggat": "2026-09-19T23:59:59.000Z", "selesai": false, "prioritas": "tinggi" }, ... 8 ],
  "materi": [{ "id": "materi-1", "mapelId": "mapel-1", "judul": "Matriks & Operasi", "tautan": "#", "sudahDibaca": false }, ... 3 ],
  "pengumpulan": [],
  "nilai": [],
  "game": [{ "id": "game-1", "nama": "Flappy Bird" }],
  "skor_game": [{ "id": "sg-1", "gameId": "game-1", "profilId": "siswa-1", "skorTertinggi": 0, "totalPoin": 0 }],
  "tiket": []
}
```

**Auto endpoints (json-server):**
- `GET /tugas`, `GET /tugas/:id`, `PATCH /tugas/:id` Body `{selesai: boolean}`
- `GET /profil`, `GET /mapel`, `GET /materi`, `GET /nilai`, `GET /pengumpulan` (CRUD penuh tersedia tapi fokus ke `tugas`)
- `GET /skor_game?profilId=siswa-1`, `POST /skor_game`, `PATCH /skor_game/:id` Body `{skorTertinggi, totalPoin}`
- `GET /game`, `GET /tiket?profilId=siswa-1`, `POST /tiket` Body `{id, profilId, poinDibutuhkan:120, status:"tersedia", kode:"KLK-2026-XXXX", tanggalTukar:"2026-09-18"}`
- Sorting: `GET /skor_game?_sort=totalPoin&_order=desc` untuk papan peringkat.

**Rules:**
- Poin: `totalPoin += skor` tiap `gameOver`. Tidak ada pembagi.
- Tiket: hanya jika `totalPoin >=120`. Frontend lakukan `POST /tiket` + `PATCH /skor_game` (`totalPoin -=120`) atomik berurutan. Kode `KLK-YYYY-` + 4 char `Math.random().toString(36).slice(2,6).toUpperCase()`.
- `skorTertinggi` update hanya jika `score > skorTertinggi`.

---

## 4. Frontend Service Layer

**`src/services/api.js`:**
```js
const BASE = 'http://localhost:3001'
export async function api(path, {method='GET', body, signal}={}) {
  const res = await fetch(BASE+path, {method, headers:{'Content-Type':'application/json'}, body: body?JSON.stringify(body):undefined, signal: AbortSignal.timeout(5000)})
  if(!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.status===204? null : res.json()
}
export const TugasAPI = { list:()=>api('/tugas'), toggle:(id,v)=>api(`/tugas/${id}`,{method:'PATCH',body:{selesai:v}}) }
export const SkorAPI = { get:(pid)=>api(`/skor_game?profilId=${pid}`), update:(id,data)=>api(`/skor_game/${id}`,{method:'PATCH',body:data}), create:(data)=>api('/skor_game',{method:'POST',body:data}) }
export const TiketAPI = { list:(pid)=>api(`/tiket?profilId=${pid}`), create:(data)=>api('/tiket',{method:'POST',body:data}) }
```

**Hooks refactor:**
- `src/hooks/useTugas.js`: `useEffect` → `TugasAPI.list()`; `toggleSelesai` → optimistic `setTugas` + `await tugasAPI.toggle`; on catch rollback + toast.
- `src/hooks/useGame.js` (baru): `skor, tiket, totalPoin, highScore`; `load()` fetch skor_game + tiket; `onScore(score)` handle `skorTertinggi` + `totalPoin`; `tukarTiket()` handle 120 check.
- `src/data/mock.js` tetap ada sebagai seed awal `db.json` dan fallback data jika fetch gagal.

**Fallback:** `try { api } catch { setToast('Server localhost mati, pakai data lokal'); setTugas(getStorage(...)) }`.

**Dependencies baru:** `json-server`, `concurrently`, `jspdf`. Scripts update di `package.json`.

---

## 5. Game Module

**Files:** `src/games/FlappyBird.jsx`, `src/pages/Games.jsx`

**FlappyBird.jsx (canvas 360x640):**
- Physics: gravity `0.52`, flap `-8`, pipe `speed 2.4`, `gap 140`, bird `26x18`, pipe `width 52`, spawn every `110` frames.
- Render: `fillRect` pipes `#334155`, bird `#1E40AF` + eye white, bg `#EFF6FF`, ground `#E2E8F0`. No external images.
- Loop: `requestAnimationFrame`, `count` frame, `pipes[]`, collision `AABB` + ground/ceiling.
- Controls: `keydown Space / ArrowUp`, `click`, `touchstart` → `flap()`. `P` pause, `R` restart. Canvas `tabIndex=0` + `aria-label`.
- States: `idle` (tekan Spasi untuk mulai), `playing`, `gameOver` (show score, highScore, button Main Lagi).
- Props: `onGameOver(score)` callback ke parent.

**Games.jsx:**
- Layout: header poin `totalPoin` + `highScore`, card game (canvas centered), panel kanan: cara main, tombol `Tukar Tiket (120 poin)` disabled jika belum cukup, list papan peringkat Top5 (`_sort` desc), list tiket milik siswa.
- Styling: `rounded-2xl border #E2E8F0 bg-white shadow-card`, `p-6 gap-6` (spacious, no AI slop).
- Accessibility: canvas focus ring, keyboard handlers, `prefers-reduced-motion` kurangi animasi pipe.

---

## 6. Tiket PDF & Print

**File:** `src/utils/pdfTicket.js`
```js
import jsPDF from 'jspdf'
export function downloadTiketPDF(tiket, profil) {
  const doc = new jsPDF({orientation:'portrait', unit:'mm', format:'A5'})
  doc.setDrawColor(226,232,240); doc.rect(10,10,128,85)
  doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.text('KELASKU — TIKET DISKON KAFE',15,20)
  doc.setFontSize(10); doc.setFont('helvetica','normal')
  doc.text(`Nama: ${profil.nama} (${profil.kelas})`,15,30)
  doc.text(`Kode: ${tiket.kode}`,15,37); doc.text(`Tanggal Tukar: ${tiket.tanggalTukar}`,15,44); doc.text('Syarat: Tunjukkan ke kasir kafe',15,52)
  doc.setFontSize(8); doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`,15,80)
  doc.rect(95,28,30,30); doc.setFontSize(7); doc.text(tiket.kode,100,43,{align:'center'})
  doc.save(`tiket-${tiket.kode}.pdf`)
}
export function printTiket(tiket, profil) {
  const html = `<html><body style="font-family:Inter,sans-serif;padding:24px"><h2>KELASKU — TIKET</h2><p>${profil.nama} — ${tiket.kode}</p><p>${tiket.tanggalTukar}</p><script>window.print()</script></body></html>`
  const w = window.open('', '_blank'); w.document.write(html); w.document.close()
}
```
- **Trigger:** tombol `Download PDF` → `downloadTiketPDF`, `Print` → `printTiket`.
- **History:** `GET /tiket` list di `Games.jsx` bawah + card tiket dengan 2 tombol.

---

## 7. Error Handling & Edge Cases

- API timeout 5s → throw → toast `Gagal terhubung ke localhost:3001, cek npm run server`.
- PATCH tugas gagal → rollback optimistic state.
- Skor negatif / NaN → clamp 0.
- Tiket double-click → disable button saat `isTukarLoading`.
- Server mati: dashboard & game tetap render dari `localStorage` mock, tapi perubahan tidak persist ke `db.json` (toast warning).
- PDF fail: catch → toast `Gagal membuat PDF`.

---

## 8. Testing & Verification

Manual (tanpa unit test berat):
1. `npm run server` → `curl http://localhost:3001/tugas` 200 & 8 items.
2. Dashboard toggle → Network PATCH 200, reload tetap.
3. Flappy main 3x → totalPoin akumulasi, highScore update.
4. Tukar tiket saat 120 → POST /tiket 201, totalPoin berkurang 120, PDF ter-download, Print buka tab.
5. Matikan server → app toast fallback, tetap bisa lihat tugas.
6. `npm run build` lolos, `design-system` contrast 4.5:1, `prefers-reduced-motion` ok.

---

## 9. Out of Scope

- Auth, multi-user real-time, pagination, image upload.
- Game kedua, leaderboard global cross-user (hanya Top5 dari `skor_game`).
- Deployment backend (hanya localhost).

---

## 10. File Changes

- Baru: `db.json`, `src/services/api.js`, `src/hooks/useGame.js`, `src/games/FlappyBird.jsx`, `src/utils/pdfTicket.js`, `docs/superpowers/specs/2026-09-18-kelasku-backend-game-design.md`
- Ubah: `package.json` (scripts + deps), `src/hooks/useTugas.js`, `src/pages/Games.jsx`, `src/App.jsx` (route /games real), `src/components/Layout.jsx` (hapus placeholder)

---

## 11. Next Step

Setelah spec ini approved → invoke `writing-plans` skill untuk breakdown jadi task terurut (backend setup → service layer → game canvas → tiket PDF).
