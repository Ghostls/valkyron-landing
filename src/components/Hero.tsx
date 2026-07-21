import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const stats = [
  { num: '5', suffix: '+', label: 'Sistemas\ndesplegados' },
  { num: '4', suffix: '+', label: 'Sectores\natendidos' },
  { num: '1K', suffix: '+', label: 'Usuarios\nimpactados' },
  { num: '3', suffix: '', label: 'Años de\noperaciones' },
]

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sphereRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>(0)
  const particleFrameRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5, over: false, strength: 0 })

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Background particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.3, o: Math.random() * 0.3 + 0.05,
    }))
    const draw = () => {
      particleFrameRef.current = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167,139,250,${p.o})`; ctx.fill()
      })
      particles.forEach((a, i) => particles.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(124,58,237,${0.06 * (1 - dist / 100)})`
          ctx.lineWidth = 0.5; ctx.stroke()
        }
      }))
    }
    draw()
    return () => { cancelAnimationFrame(particleFrameRef.current); window.removeEventListener('resize', resize) }
  }, [])

  // Three.js MIA sphere on right side
  useEffect(() => {
    const canvas = sphereRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const S = 480
    canvas.width = S; canvas.height = S
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(S, S)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.z = 2.8
    const count = 3000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const radii = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1 + (Math.random() - 0.5) * 0.06
      radii[i] = r
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      const t = phi / Math.PI
      colors[i * 3] = 0.15 + t * 0.55
      colors[i * 3 + 1] = 0.05 + t * 0.08
      colors[i * 3 + 2] = 0.85 - t * 0.35
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const mat = new THREE.PointsMaterial({ size: 0.02, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true })
    const pts = new THREE.Points(geo, mat)
    scene.add(pts)
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
    const colAttr = geo.getAttribute('color') as THREE.BufferAttribute
    const origPos = new Float32Array(positions)
    const origCol = new Float32Array(colors)
    const auroraColors = [[0.0, 1.0, 0.7], [0.5, 0.0, 1.0], [0.0, 0.6, 1.0]]
    let tick = 0, auroraLerp = 0, auroraTarget = 0, lastSwitch = 0

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      tick += 0.004
      const m = mouseRef.current
      m.strength += ((m.over ? 1 : 0) - m.strength) * 0.03
      if (m.over && tick - lastSwitch > 5) { auroraTarget = (auroraTarget + 1) % auroraColors.length; lastSwitch = tick; auroraLerp = 0 }
      if (m.over) auroraLerp = Math.min(auroraLerp + 0.008, 1)
      else auroraLerp = Math.max(auroraLerp - 0.01, 0)
      const [ar, ag, ab] = auroraColors[auroraTarget]
      for (let i = 0; i < count; i++) {
        const ox = origPos[i * 3], oy = origPos[i * 3 + 1], oz = origPos[i * 3 + 2]
        const wave = Math.sin(ox * 2.5 + tick) * Math.cos(oy * 2.5 + tick * 0.7) * Math.sin(oz * 2 + tick * 0.5)
        let md = 0
        if (m.over) {
          const nx = m.x * 2 - 1, ny = -(m.y * 2 - 1)
          const dot = Math.max(0, ox * nx + oy * ny)
          md = dot * 0.18 * Math.sin(tick * 2 + dot * 5)
        }
        const r2 = radii[i] + 0.07 * wave + md * m.strength
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz)
        posAttr.array[i * 3] = (ox / len) * r2
        posAttr.array[i * 3 + 1] = (oy / len) * r2
        posAttr.array[i * 3 + 2] = (oz / len) * r2
        const shimmer = (Math.sin(tick * 2 + i * 0.01) * 0.5 + 0.5) * auroraLerp
        colAttr.array[i * 3] = origCol[i * 3] + (ar - origCol[i * 3]) * shimmer
        colAttr.array[i * 3 + 1] = origCol[i * 3 + 1] + (ag - origCol[i * 3 + 1]) * shimmer
        colAttr.array[i * 3 + 2] = origCol[i * 3 + 2] + (ab - origCol[i * 3 + 2]) * shimmer
      }
      posAttr.needsUpdate = true; colAttr.needsUpdate = true
      pts.rotation.y += 0.0008 + m.strength * 0.002
      pts.rotation.x += 0.0003
      renderer.render(scene, camera)
    }
    animate()

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - r.left) / r.width
      mouseRef.current.y = (e.clientY - r.top) / r.height
    }
    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseenter', () => { mouseRef.current.over = true })
    wrap.addEventListener('mouseleave', () => { mouseRef.current.over = false })

    return () => {
      cancelAnimationFrame(frameRef.current)
      renderer.dispose()
      wrap.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <section id="hero" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', position: 'relative', overflow: 'hidden',
      padding: '120px 5% 0',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px)',
        backgroundSize: '48px 48px', animation: 'gridpulse 10s ease-in-out infinite',
      }} />
      <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 65%)', pointerEvents: 'none' }} />

      {/* Two-column layout */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1400px',
      }}>

        {/* LEFT — text */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', border: '1px solid rgba(124,58,237,0.25)',
            background: 'rgba(124,58,237,0.06)', marginBottom: '2rem',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
          }}>
            <span style={{ width: '6px', height: '6px', background: '#22C55E', borderRadius: '50%', display: 'inline-block', animation: 'blink 2s infinite' }} />
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#A78BFA' }}>
              Sistema activo — Barquisimeto, Venezuela
            </span>
          </div>

          <div style={{
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s', marginBottom: '2rem',
          }}>
            <h1 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 'clamp(44px,5.5vw,86px)', fontWeight: 700,
              lineHeight: 0.92, letterSpacing: '-1px', textTransform: 'uppercase', margin: 0,
            }}>
              <span style={{ display: 'block', color: '#E2E8F0' }}>El futuro</span>
              <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '1px rgba(167,139,250,0.45)', lineHeight: 1.05 }}>no espera.</span>
              <span style={{ display: 'block', color: '#7C3AED' }}>Nosotros tampoco.</span>
            </h1>
          </div>

          <div style={{
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s',
          }}>
            <p style={{
              fontSize: 'clamp(13px,1.2vw,16px)', color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.8, marginBottom: '2rem', fontWeight: 300, maxWidth: '460px',
            }}>
              Desde drones autónomos con visión artificial hasta ERPs de manufactura —
              cada sistema está diseñado para operar donde otros fallan.
              <br /><br />
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                No vendemos software. Desplegamos infraestructura tecnológica de nivel estratégico.
              </span>
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#portafolio" style={{
                fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', letterSpacing: '3px',
                textTransform: 'uppercase', padding: '14px 36px', background: '#7C3AED',
                color: 'white', textDecoration: 'none', fontWeight: 600, transition: 'all .25s', display: 'inline-block',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.35)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >Ver portafolio</a>
              <a href="#contacto" style={{
                fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', letterSpacing: '3px',
                textTransform: 'uppercase', padding: '14px 36px', background: 'transparent',
                color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none', transition: 'all .25s', display: 'inline-block',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#A78BFA'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >Hablemos</a>
            </div>
          </div>
        </div>

        {/* RIGHT — MIA sphere */}
        <div ref={wrapRef} style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: mounted ? 1 : 0, transition: 'opacity 1.2s ease 0.5s',
        }}>
          {/* Outer glow */}
          <div style={{
            position: 'absolute', inset: '0',
            background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          {/* Orbit rings */}
          <div style={{
            position: 'absolute', width: '520px', height: '520px',
            border: '1px solid rgba(124,58,237,0.06)', borderRadius: '50%',
            animation: 'spin 20s linear infinite', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: '420px', height: '420px',
            border: '1px solid rgba(124,58,237,0.08)', borderRadius: '50%',
            animation: 'spin 14s linear infinite reverse', pointerEvents: 'none',
          }} />
          {/* MIA label */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase',
            color: 'rgba(124,58,237,0.25)', pointerEvents: 'none', userSelect: 'none',
            marginTop: '200px',
          }}>MIA — Valkyron</div>

          <canvas ref={sphereRef} style={{ width: '480px', height: '480px', display: 'block', position: 'relative', zIndex: 1 }} />
        </div>
      </div>

      {/* Scroll hint — centered bottom */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        paddingTop: '2.5rem', paddingBottom: '1.5rem',
        opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 1s',
      }}>
        <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, rgba(124,58,237,0.4), transparent)', animation: 'scrollpulse 2s ease-in-out infinite' }} />
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', letterSpacing: '4px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Scroll</span>
      </div>

      {/* Stats bar */}
      <div style={{
        position: 'relative', zIndex: 2,
        paddingTop: '2rem', paddingBottom: '2.5rem',
        borderTop: '1px solid rgba(124,58,237,0.12)',
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 0.7s',
      }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ padding: '0 2rem 0 0', borderRight: i < 3 ? '1px solid rgba(124,58,237,0.1)' : 'none' }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(28px,3vw,48px)', fontWeight: 700, lineHeight: 1, color: '#E2E8F0', marginBottom: '4px' }}>
              {s.num}<span style={{ color: '#7C3AED' }}>{s.suffix}</span>
            </div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        @keyframes gridpulse{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes scrollpulse{0%,100%{opacity:.4;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.15)}}
        @media(max-width:900px){
          #hero>div:nth-child(4){grid-template-columns:1fr!important}
          #hero>div:nth-child(4)>div:last-child{display:none!important}
          #hero>div:nth-child(6){grid-template-columns:repeat(2,1fr)!important}
        }
      `}</style>
    </section>
  )
}