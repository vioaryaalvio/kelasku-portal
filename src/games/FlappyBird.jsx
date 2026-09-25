import { useEffect, useRef, useState, useCallback } from 'react'

const W = 360
const H = 640
const GRAVITY = 0.52
const FLAP = -8
const PIPE_GAP = 140
const PIPE_W = 52
const PIPE_SPEED = 2.4
const BIRD_W = 26
const BIRD_H = 18
const GROUND_H = 64

export default function FlappyBird({ onGameOver }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef({ birdY: H / 2, birdVy: 0, pipes: [], frame: 0, score: 0, status: 'idle' }) // idle | playing | gameOver
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState('idle')

  const spawnPipe = useCallback(() => {
    const topH = 60 + Math.random() * (H - GROUND_H - PIPE_GAP - 120)
    stateRef.current.pipes.push({ x: W + 20, topH, scored: false })
  }, [])

  const reset = useCallback(() => {
    stateRef.current = { birdY: H / 2, birdVy: 0, pipes: [], frame: 0, score: 0, status: 'idle' }
    setScore(0)
    setStatus('idle')
  }, [])

  const flap = useCallback(() => {
    const s = stateRef.current
    if (s.status === 'gameOver') { reset(); return }
    if (s.status === 'idle') s.status = 'playing'
    if (s.status === 'playing') s.birdVy = FLAP
    setStatus(s.status)
  }, [reset])

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); flap() }
      if (e.code === 'KeyP' && stateRef.current.status === 'playing') stateRef.current.status = 'paused'
      if (e.code === 'KeyR') reset()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flap, reset])

  // game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let last = performance.now()

    const draw = () => {
      const s = stateRef.current
      // bg
      ctx.fillStyle = '#EFF6FF'
      ctx.fillRect(0, 0, W, H)
      // pipes
      ctx.fillStyle = '#334155'
      s.pipes.forEach(p => {
        ctx.fillRect(p.x, 0, PIPE_W, p.topH)
        ctx.fillRect(p.x, p.topH + PIPE_GAP, PIPE_W, H - GROUND_H - p.topH - PIPE_GAP)
        // cap
        ctx.fillStyle = '#1E293B'
        ctx.fillRect(p.x - 2, p.topH - 10, PIPE_W + 4, 10)
        ctx.fillRect(p.x - 2, p.topH + PIPE_GAP, PIPE_W + 4, 10)
        ctx.fillStyle = '#334155'
      })
      // bird
      const birdX = 72
      ctx.save()
      ctx.translate(birdX + BIRD_W / 2, s.birdY + BIRD_H / 2)
      const rot = Math.max(-0.6, Math.min(1.0, s.birdVy * 0.06))
      ctx.rotate(rot)
      ctx.fillStyle = s.status === 'gameOver' ? '#DC2626' : '#1E40AF'
      ctx.beginPath()
      ctx.roundRect(-BIRD_W / 2, -BIRD_H / 2, BIRD_W, BIRD_H, 6)
      ctx.fill()
      // eye
      ctx.fillStyle = 'white'
      ctx.beginPath(); ctx.arc(6, -3, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#0F172A'; ctx.beginPath(); ctx.arc(7, -3, 2, 0, Math.PI * 2); ctx.fill()
      // beak
      ctx.fillStyle = '#F59E0B'
      ctx.beginPath(); ctx.moveTo(BIRD_W / 2, -2); ctx.lineTo(BIRD_W / 2 + 8, 0); ctx.lineTo(BIRD_W / 2, 4); ctx.fill()
      ctx.restore()

      // ground
      ctx.fillStyle = '#E2E8F0'
      ctx.fillRect(0, H - GROUND_H, W, GROUND_H)
      ctx.fillStyle = '#CBD5E1'
      ctx.fillRect(0, H - GROUND_H, W, 4)

      // score
      ctx.fillStyle = '#0F172A'
      ctx.font = '700 22px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(String(s.score), W / 2, 44)
      if (s.status === 'idle') {
        ctx.font = '500 12px Inter, sans-serif'
        ctx.fillStyle = '#475569'
        ctx.fillText('Tekan Spasi / Tap untuk mulai', W / 2, 64)
      }
      if (s.status === 'gameOver') {
        ctx.fillStyle = 'rgba(15,23,42,0.06)'
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#0F172A'
        ctx.font = '600 18px Inter, sans-serif'
        ctx.fillText('Game Over', W / 2, H / 2 - 10)
        ctx.font = '400 12px Inter, sans-serif'
        ctx.fillStyle = '#475569'
        ctx.fillText('Tap / Spasi untuk Main Lagi', W / 2, H / 2 + 12)
      }
    }

    const update = () => {
      const s = stateRef.current
      if (s.status !== 'playing') return
      s.frame++
      s.birdVy += GRAVITY
      s.birdY += s.birdVy

      if (s.frame % 110 === 0) spawnPipe()
      s.pipes.forEach(p => p.x -= PIPE_SPEED)
      // remove offscreen & score
      s.pipes = s.pipes.filter(p => {
        if (!p.scored && p.x + PIPE_W < 72) { p.scored = true; s.score++; setScore(s.score) }
        return p.x + PIPE_W > -20
      })

      const birdX = 72
      const birdRect = { x: birdX, y: s.birdY, w: BIRD_W, h: BIRD_H }
      // collision with pipes
      for (const p of s.pipes) {
        const topRect = { x: p.x, y: 0, w: PIPE_W, h: p.topH }
        const botRect = { x: p.x, y: p.topH + PIPE_GAP, w: PIPE_W, h: H }
        if (rectHit(birdRect, topRect) || rectHit(birdRect, botRect)) {
          s.status = 'gameOver'; setStatus('gameOver'); onGameOver?.(s.score); return
        }
      }
      if (s.birdY < -10 || s.birdY + BIRD_H > H - GROUND_H) {
        s.status = 'gameOver'; setStatus('gameOver'); onGameOver?.(s.score)
      }
    }

    const loop = () => {
      const now = performance.now()
      if (now - last >= 16) { update(); draw(); last = now }
      rafRef.current = requestAnimationFrame(loop)
    }
    draw()
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onGameOver, spawnPipe])

  const handlePointer = (e) => {
    e.preventDefault()
    flap()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-card bg-white">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          tabIndex={0}
          aria-label="Flappy Bird — tekan Spasi untuk terbang"
          onClick={handlePointer}
          onTouchStart={handlePointer}
          className="block max-w-[360px] w-[min(360px,86vw)] h-auto outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] cursor-pointer"
        />
        {/* HUD */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#334155] shadow-sm">{status === 'playing' ? 'Main...' : status === 'idle' ? 'Siap' : 'Selesai'} • {score}</span>
          <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-[#0F172A] text-white">Tap / Spasi</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={flap} className="px-4 py-2 rounded-xl bg-[#1E40AF] text-white text-[13px] font-medium min-h-[40px] hover:bg-[#1E3A8A] transition">
          {status === 'gameOver' ? 'Main Lagi' : status === 'idle' ? 'Mulai' : 'Flap!'}
        </button>
        <button onClick={reset} className="px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-[13px] font-medium min-h-[40px] hover:bg-[#F8FAFC]">Reset</button>
      </div>
      <p className="text-[11px] text-[#64748B] text-center max-w-[360px] leading-relaxed">Kontrol: Spasi / Tap / Klik untuk terbang. R untuk reset. P untuk pause. Skor kamu = poin.</p>
    </div>
  )
}

function rectHit(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}
