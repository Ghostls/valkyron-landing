import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import Logo1 from '../assets/Logo1.png'
import LogoMIA from '../assets/LogoMIA.png'

interface MIAIntroProps {
  onEnter: () => void
}

export default function MIAIntro({ onEnter }: MIAIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0, over: false, strength: 0 })
  const colorsOrigRef = useRef<Float32Array | null>(null)

  const [phase, setPhase] = useState<'idle' | 'activating' | 'exiting'>('idle')
  const [listening, setListening] = useState(false)
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  const greeting = 'Hola. Soy M.I.A., la inteligencia artificial de Valkyron Group. Bienvenido. Puedes hablarme o hacer clic para iniciar.'

  // Speech synthesis — natural female voice
  useEffect(() => {
    const speak = () => {
      if (!window.speechSynthesis) return
      window.speechSynthesis.cancel()
      const utt = new SpeechSynthesisUtterance(greeting)
      utt.lang = 'es-ES'
      utt.rate = 0.78
      utt.pitch = 1.4
      utt.volume = 1

      const voices = window.speechSynthesis.getVoices()
      // Female voice detection: known names + exclude known male names
      const femaleNames = /sabina|helena|laura|paulina|mónica|monica|luciana|maria|sofía|sofia|isabella|camila|valentina|female|femenin/i
      const maleNames = /diego|jorge|carlos|pablo|miguel|male|masculin/i
      const femaleVoice =
        voices.find(v => femaleNames.test(v.name) && v.lang.startsWith('es')) ||
        voices.find(v => v.lang === 'es-ES' && !maleNames.test(v.name)) ||
        voices.find(v => v.lang.startsWith('es') && !maleNames.test(v.name)) ||
        voices.find(v => v.lang.startsWith('es'))
      if (femaleVoice) utt.voice = femaleVoice
      window.speechSynthesis.speak(utt)
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      setTimeout(speak, 800)
    } else {
      window.speechSynthesis.onvoiceschanged = () => setTimeout(speak, 400)
    }
    return () => window.speechSynthesis.cancel()
  }, [])

  // Speech recognition
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const recog = new SR()
    recog.lang = 'es-ES'
    recog.continuous = true
    recog.interimResults = false
    recog.onstart = () => setListening(true)
    recog.onend = () => {
      setListening(false)
      if (phaseRef.current === 'idle') recog.start()
    }
    recog.onerror = () => setListening(false)
    recog.onresult = (e: any) => {
      const txt: string = e.results[e.results.length - 1][0].transcript.toLowerCase()
      if (/inici|valkyron|mia|entrar|comenzar/.test(txt)) handleActivate()
    }
    const t = setTimeout(() => recog.start(), 1200)
    return () => { clearTimeout(t); recog.abort() }
  }, [])

  // Three.js — aurora mouse reaction
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const W = 340, H = 340
    canvas.width = W
    canvas.height = H

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.z = 2.8

    const count = 3200
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const radii = new Float32Array(count)
    const thetas = new Float32Array(count)
    const phis = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      thetas[i] = theta
      phis[i] = phi
      const r = 1 + (Math.random() - 0.5) * 0.06
      radii[i] = r
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Base colors: deep blue → violet → indigo
      const t = phi / Math.PI
      colors[i * 3]     = 0.15 + t * 0.55   // R
      colors[i * 3 + 1] = 0.05 + t * 0.08   // G
      colors[i * 3 + 2] = 0.85 - t * 0.35   // B
    }

    colorsOrigRef.current = new Float32Array(colors)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      sizeAttenuation: true,
    })

    const pts = new THREE.Points(geo, mat)
    scene.add(pts)

    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
    const colAttr = geo.getAttribute('color') as THREE.BufferAttribute
    const origPos = new Float32Array(positions)

    // Aurora color palettes triggered by mouse zones
    const auroraColors = [
      [0.0, 1.0, 0.7],   // teal-green
      [0.5, 0.0, 1.0],   // violet
      [0.0, 0.6, 1.0],   // cyan-blue
      [1.0, 0.3, 0.6],   // pink-magenta
      [0.3, 1.0, 0.4],   // green
    ]

    let tick = 0
    let auroraTarget = 0
    let auroraLerp = 0
    let lastAuroraSwitch = 0

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      tick += 0.004

      const m = mouseRef.current
      // Smooth strength
      m.strength += ((m.over ? 1 : 0) - m.strength) * 0.03

      // Cycle aurora color every ~3s when hovering
      if (m.over && tick - lastAuroraSwitch > 5.0) {
        auroraTarget = (auroraTarget + 1) % auroraColors.length
        lastAuroraSwitch = tick
        auroraLerp = 0
      }
      if (m.over) auroraLerp = Math.min(auroraLerp + 0.008, 1)
      else auroraLerp = Math.max(auroraLerp - 0.01, 0)

      const [ar, ag, ab] = auroraColors[auroraTarget]
      const orig = colorsOrigRef.current!

      for (let i = 0; i < count; i++) {
        const ox = origPos[i * 3]
        const oy = origPos[i * 3 + 1]
        const oz = origPos[i * 3 + 2]

        // Wave deformation
        const wave = Math.sin(ox * 2.5 + tick) * Math.cos(oy * 2.5 + tick * 0.7) * Math.sin(oz * 2 + tick * 0.5)

        // Mouse influence — aurora ripple
        let mouseDisplace = 0
        if (m.over) {
          // Map mouse to sphere surface normal
          const nx = m.x * 2 - 1   // -1..1
          const ny = -(m.y * 2 - 1)
          const dot = ox * nx + oy * ny  // proximity to mouse direction
          const proximity = Math.max(0, dot)
          mouseDisplace = proximity * 0.18 * Math.sin(tick * 2 + proximity * 5)
        }

        const displacement = 0.07 * wave + mouseDisplace * m.strength
        const r = radii[i] + displacement
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz)
        posAttr.array[i * 3]     = (ox / len) * r
        posAttr.array[i * 3 + 1] = (oy / len) * r
        posAttr.array[i * 3 + 2] = (oz / len) * r

        // Color shift toward aurora on hover
        const baseR = orig[i * 3], baseG = orig[i * 3 + 1], baseB = orig[i * 3 + 2]

        // Per-point phase offset for shimmer
        const shimmer = Math.sin(tick * 2 + i * 0.01) * 0.5 + 0.5
        const influence = auroraLerp * shimmer

        colAttr.array[i * 3]     = baseR + (ar - baseR) * influence
        colAttr.array[i * 3 + 1] = baseG + (ag - baseG) * influence
        colAttr.array[i * 3 + 2] = baseB + (ab - baseB) * influence
      }

      posAttr.needsUpdate = true
      colAttr.needsUpdate = true

      pts.rotation.y += 0.0008 + m.strength * 0.002
      pts.rotation.x += 0.0003

      renderer.render(scene, camera)
    }
    animate()

    // Mouse tracking relative to canvas center
    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left) / rect.width
      mouseRef.current.y = (e.clientY - rect.top) / rect.height
    }
    const onEnterWrap = () => { mouseRef.current.over = true }
    const onLeaveWrap = () => { mouseRef.current.over = false }

    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseenter', onEnterWrap)
    wrap.addEventListener('mouseleave', onLeaveWrap)

    return () => {
      cancelAnimationFrame(frameRef.current)
      renderer.dispose()
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseenter', onEnterWrap)
      wrap.removeEventListener('mouseleave', onLeaveWrap)
    }
  }, [])

  const handleActivate = () => {
    if (phaseRef.current !== 'idle') return
    setPhase('activating')
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance('Iniciando Valkyron. Bienvenido.')
    utt.lang = 'es-ES'
    utt.rate = 0.78
    utt.pitch = 1.4
    const voices2 = window.speechSynthesis.getVoices()
    const femaleNames2 = /sabina|helena|laura|paulina|mónica|monica|luciana|female/i
    const maleNames2 = /diego|jorge|carlos|pablo|miguel|male/i
    const v = voices2.find(v => femaleNames2.test(v.name) && v.lang.startsWith('es'))
      || voices2.find(v => v.lang === 'es-ES' && !maleNames2.test(v.name))
      || voices2.find(v => v.lang.startsWith('es'))
    if (v) utt.voice = v
    window.speechSynthesis.speak(utt)
    setTimeout(() => {
      setPhase('exiting')
      setTimeout(onEnter, 900)
    }, 1400)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: '#040408',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        opacity: phase === 'exiting' ? 0 : 1,
        transition: phase === 'exiting' ? 'opacity 0.9s ease-in' : 'none',
      }}
    >
      <StarField />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent,transparent 3px,rgba(124,58,237,.012) 3px,rgba(124,58,237,.012) 4px)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Logo */}
        <img src={Logo1} alt="Valkyron Group" style={{ width: '120px', marginBottom: '1.5rem', opacity: 0.9 }} />

        {/* Sphere wrap — mouse events here */}
        <div
          ref={wrapRef}
          style={{ position: 'relative', width: '340px', height: '340px', cursor: 'pointer', marginBottom: '2rem' }}
          onClick={handleActivate}
        >
          <canvas ref={canvasRef} style={{ width: '340px', height: '340px', display: 'block' }} />

          {/* Outer glow ring */}
          <div style={{
            position: 'absolute', inset: '-10px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 68%)',
            pointerEvents: 'none', transition: 'opacity .4s',
          }} />

          {phase === 'activating' && (
            <>
              {[0, 150, 300].map(d => (
                <div key={d} style={{
                  position: 'absolute', inset: '15%', borderRadius: '50%',
                  border: '1px solid rgba(196,181,253,0.7)',
                  animation: `burst 1.2s ease-out forwards ${d}ms`,
                }} />
              ))}
            </>
          )}
        </div>

        {/* MIA Logo */}
        <img src={LogoMIA} alt="M.I.A." style={{ height: '36px', marginBottom: '1.5rem', opacity: 0.85 }} />


        {listening && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'blink 1s infinite' }} />
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '3px', color: '#22C55E', textTransform: 'uppercase' }}>Escuchando...</span>
          </div>
        )}

        {phase === 'idle' && (
          <button
            onClick={handleActivate}
            style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '13px', letterSpacing: '5px', textTransform: 'uppercase', padding: '13px 44px', background: 'transparent', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.5)', cursor: 'pointer', transition: 'all .3s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,.15)'; e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.boxShadow = '0 0 18px rgba(124,58,237,.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(124,58,237,.5)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            INICIAR
          </button>
        )}

        {phase === 'activating' && (
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', letterSpacing: '4px', color: '#7C3AED', textTransform: 'uppercase' }}>
            Inicializando sistemas...
          </div>
        )}

        <div style={{ marginTop: '1.5rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '2px', color: '#1E1B2E', textTransform: 'uppercase', textAlign: 'center' }}>
          Habla con MIA o haz click para continuar
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes burst { 0%{transform:scale(1);opacity:.9} 100%{transform:scale(3.5);opacity:0} }
        @keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:.7} }
      `}</style>
    </div>
  )
}

function StarField() {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.4 + 0.4,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    })), [])

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: `${s.size}px`, height: `${s.size}px`, borderRadius: '50%',
          background: '#A78BFA', animation: `twinkle ${s.duration}s ease-in-out infinite ${s.delay}s`,
        }} />
      ))}
    </div>
  )
}