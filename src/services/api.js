const BASE = 'http://localhost:3001'

async function api(path, { method = 'GET', body, signal } = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: signal || controller.signal,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`${res.status} ${res.statusText} ${text}`.trim())
    }
    if (res.status === 204) return null
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) return res.json()
    return res.text()
  } finally {
    clearTimeout(timeout)
  }
}

export const TugasAPI = {
  list: () => api('/tugas'),
  get: (id) => api(`/tugas/${id}`),
  toggle: (id, selesai) => api(`/tugas/${id}`, { method: 'PATCH', body: { selesai } }),
  update: (id, data) => api(`/tugas/${id}`, { method: 'PATCH', body: data }),
}

export const MapelAPI = { list: () => api('/mapel') }
export const MateriAPI = { list: () => api('/materi') }
export const ProfilAPI = { list: () => api('/profil'), get: (id) => api(`/profil/${id}`) }
export const SkorAPI = {
  list: (profilId) => api(`/skor_game?profilId=${profilId}`),
  listAll: () => api('/skor_game'),
  get: (id) => api(`/skor_game/${id}`),
  create: (data) => api('/skor_game', { method: 'POST', body: data }),
  update: (id, data) => api(`/skor_game/${id}`, { method: 'PATCH', body: data }),
}
export const TiketAPI = {
  list: (profilId) => api(`/tiket?profilId=${profilId}`),
  listAll: () => api('/tiket'),
  create: (data) => api('/tiket', { method: 'POST', body: data }),
}
export const GameAPI = { list: () => api('/game') }

export default api
