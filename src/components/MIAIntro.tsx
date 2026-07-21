import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import Logo1 from '../assets/Logo1.png'
import LogoMIA from '../assets/LogoMIA.png'

interface MIAIntroProps {
  onEnter: () => void
}

/* ── Voz natural: prioriza voces neurales, evita robóticas ── */
function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  // Voces neurales/naturales conocidas (Google y Microsoft Natural son las mejores)
  const premium = /google.*español|microsoft.*(natural|online)|helena|elvira|dalia|paloma|sabina|laura|ximena/i
  const female = /helena|elvira|dalia|paloma|sabina|laura|ximena|mónica|monica|luciana|female|femenin/i
  const male = /diego|jorge|carlos|pablo|miguel|raúl|raul|male|masculin/i

  return (
    voices.find(v => premium.test(v.name) && v.lang.startsWith('es')) ||
    voices.find(v => female.test(v.name) && v.lang.startsWith('es')) ||
    voices.find(v => v.lang === 'es-ES' && !male.test(v.name)) ||
    voices.find(v => v.lang === 'es-MX' && !male.test(v.name)) ||
    voices.find(v => v.lang.startsWith('es') && !male.test(v.name)) ||
    voices.find(v => v.lang.startsWith('es')) ||
    null
  )
}

/* Parámetros de habla ajustados para sonar humana, no robótica */
function configureUtterance(utt: SpeechSynthesisUtterance) {
  utt.lang = 'es-ES'
  utt.rate = 0.92   // cercano a natural (1.4/0.78 sonaba forzado)
  utt.pitch = 1.05  // 1.4 era demasiado agudo/robótico
  utt.volume = 1
  const v = pickVoice()
  if (v) utt.voice = v
}

export default function MIAIntro({ onEnter }: MIAIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0, over: false, strength: 0 })
  const colorsOrigRef = useRef<Float32Array | null>(null)
  const audioLevelRef = useRef(0)          // energía de la voz de MIA (0..1)
  const speakingRef = useRef(false)

  const [phase, setPhase] = useState<'idle' | 'activating' | 'exiting'>('idle')
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  // Se escribe "Mía" (no "M.I.A.") para que el TTS lo pronuncie, no lo deletree
  const greeting =
    'Hola, soy Mía, la inteligencia artificial de Valkyron Group. Bienvenido. Puedes hablarme, o hacer clic para iniciar.'

  /* ── Síntesis de voz + análisis de energía para animar la esfera ── */
  useEffect(() => {
    let raf = 0

    // Pulso de "voz" simulado por sílabas mientras habla (los eventos onboundary
    // no dan amplitud, así que generamos un envelope suave y realista)
    const startEnvelope = () => {
      speakingRef.current = true
      setSpeaking(true)
      const loop = () => {
        if (!speakingRef.current) return
        const t = performance.now() * 0.001
        // superposición de ondas => cadencia orgánica del habla
        const env =
          0.55 +
          0.25 * Math.sin(t * 11) +
          0.15 * Math.sin(t * 23 + 1.3) +
          0.05 * Math.sin(t * 37)
        audioLevelRef.current = Math.max(0, Math.min(1, env))
        raf = requestAnimationFrame(loop)
      }
      loop()
    }
    const stopEnvelope = () => {
      speakingRef.current = false
      setSpeaking(false)
      audioLevelRef.current = 0
      cancelAnimationFrame(raf)
    }

    const speak = () => {
      if (!window.speechSynthesis) return
      window.speechSynthesis.cancel()
      const utt = new SpeechSynthesisUtterance(greeting)
      configureUtterance(utt)
      utt.onstart = startEnvelope
      utt.onend = stopEnvelope
      utt.onerror = stopEnvelope
      window.speechSynthesis.speak(utt)
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      setTimeout(speak, 700)
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null
        setTimeout(speak, 300)
      }
    }
    return () => {
      window.speechSynthesis.cancel()
      stopEnvelope()
    }
  }, [])

  /* ── Reconocimiento de voz ── */
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
      if (phaseRef.current === 'idle') {
        try { recog.start() } catch { /* ya activo */ }
      }
    }
    recog.onerror = () => setListening(false)
    recog.onresult = (e: any) => {
      const txt: string = e.results[e.results.length - 1][0].transcript.toLowerCase()
      if (/inici|valkyron|\bmía\b|\bmia\b|entrar|comenzar|adelante/.test(txt)) handleActivate()
    }
    const t = setTimeout(() => { try { recog.start() } catch { /* noop */ } }, 1200)
    return () => { clearTimeout(t); try { recog.abort() } catch { /* noop */ } }
  }, [])

  /* ── Three.js — núcleo neural reactivo a voz y mouse ── */
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const W = 360, H = 360
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.z = 2.8

    const group = new THREE.Group()
    scene.add(group)

    /* --- Capa 1: esfera de partículas principal --- */
    const count = 3600
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const radii = new Float32Array(count)
    const origPos = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1 + (Math.random() - 0.5) * 0.06
      radii[i] = r
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      positions[i * 3] = origPos[i * 3] = x
      positions[i * 3 + 1] = origPos[i * 3 + 1] = y
      positions[i * 3 + 2] = origPos[i * 3 + 2] = z

      const t = phi / Math.PI
      colors[i * 3]     = 0.15 + t * 0.55
      colors[i * 3 + 1] = 0.05 + t * 0.10
      colors[i * 3 + 2] = 0.85 - t * 0.30
    }
    colorsOrigRef.current = new Float32Array(colors)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const mat = new THREE.PointsMaterial({
      size: 0.021, vertexColors: true, transparent: true,
      opacity: 0.9, sizeAttenuation: true, blending: THREE.AdditiveBlending,
    })
    const pts = new THREE.Points(geo, mat)
    group.add(pts)

    /* --- Capa 2: núcleo interno brillante (glow del "cerebro") --- */
    const coreGeo = new THREE.SphereGeometry(0.42, 32, 32)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x7C3AED, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    group.add(core)

    /* --- Capa 3: partículas orbitales (anillo de energía) --- */
    const orbCount = 500
    const orbPos = new Float32Array(orbCount * 3)
    const orbCol = new Float32Array(orbCount * 3)
    const orbData: { a: number; rad: number; tilt: number; speed: number }[] = []
    for (let i = 0; i < orbCount; i++) {
      const a = Math.random() * Math.PI * 2
      const rad = 1.35 + Math.random() * 0.55
      const tilt = (Math.random() - 0.5) * 0.9
      orbData.push({ a, rad, tilt, speed: 0.2 + Math.random() * 0.6 })
      orbCol[i * 3] = 0.65; orbCol[i * 3 + 1] = 0.5; orbCol[i * 3 + 2] = 1.0
    }
    const orbGeo = new THREE.BufferGeometry()
    orbGeo.setAttribute('position', new THREE.BufferAttribute(orbPos, 3))
    orbGeo.setAttribute('color', new THREE.BufferAttribute(orbCol, 3))
    const orbMat = new THREE.PointsMaterial({
      size: 0.016, vertexColors: true, transparent: true,
      opacity: 0.7, sizeAttenuation: true, blending: THREE.AdditiveBlending,
    })
    const orbs = new THREE.Points(orbGeo, orbMat)
    group.add(orbs)

    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
    const colAttr = geo.getAttribute('color') as THREE.BufferAttribute
    const orbPosAttr = orbGeo.getAttribute('position') as THREE.BufferAttribute

    // Paletas aurora por zona del mouse
    const auroraColors = [
      [0.0, 1.0, 0.7], [0.5, 0.0, 1.0], [0.0, 0.6, 1.0], [1.0, 0.3, 0.6], [0.3, 1.0, 0.4],
    ]

    let tick = 0
    let auroraTarget = 0
    let auroraLerp = 0
    let lastAuroraSwitch = 0
    let coreScale = 1

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      tick += 0.004

      const m = mouseRef.current
      const audio = audioLevelRef.current
      const boost = phaseRef.current === 'activating' ? 1 : 0
      m.strength += ((m.over ? 1 : 0) - m.strength) * 0.03

      if (m.over && tick - lastAuroraSwitch > 5.0) {
        auroraTarget = (auroraTarget + 1) % auroraColors.length
        lastAuroraSwitch = tick
        auroraLerp = 0
      }
      auroraLerp = m.over
        ? Math.min(auroraLerp + 0.008, 1)
        : Math.max(auroraLerp - 0.01, 0)

      const [ar, ag, ab] = auroraColors[auroraTarget]
      const orig = colorsOrigRef.current!

      // La voz de MIA infla y hace pulsar la esfera
      const voicePulse = audio * 0.14 + boost * 0.1

      for (let i = 0; i < count; i++) {
        const ox = origPos[i * 3], oy = origPos[i * 3 + 1], oz = origPos[i * 3 + 2]
        const wave = Math.sin(ox * 2.5 + tick) * Math.cos(oy * 2.5 + tick * 0.7) * Math.sin(oz * 2 + tick * 0.5)

        let mouseDisplace = 0
        if (m.over) {
          const nx = m.x * 2 - 1
          const ny = -(m.y * 2 - 1)
          const dot = ox * nx + oy * ny
          const proximity = Math.max(0, dot)
          mouseDisplace = proximity * 0.18 * Math.sin(tick * 2 + proximity * 5)
        }

        // Ondulación por voz: ripple radial sincronizado con el habla
        const voiceWave = voicePulse * Math.sin(oy * 6 + tick * 6) * 0.5

        const displacement = 0.07 * wave + mouseDisplace * m.strength + voicePulse + voiceWave
        const r = radii[i] + displacement
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz)
        posAttr.array[i * 3]     = (ox / len) * r
        posAttr.array[i * 3 + 1] = (oy / len) * r
        posAttr.array[i * 3 + 2] = (oz / len) * r

        const baseR = orig[i * 3], baseG = orig[i * 3 + 1], baseB = orig[i * 3 + 2]
        const shimmer = Math.sin(tick * 2 + i * 0.01) * 0.5 + 0.5
        const influence = auroraLerp * shimmer
        // Cuando habla, brilla hacia violeta claro
        const vGlow = audio * 0.4
        colAttr.array[i * 3]     = baseR + (ar - baseR) * influence + vGlow * 0.3
        colAttr.array[i * 3 + 1] = baseG + (ag - baseG) * influence + vGlow * 0.2
        colAttr.array[i * 3 + 2] = baseB + (ab - baseB) * influence + vGlow * 0.4
      }
      posAttr.needsUpdate = true
      colAttr.needsUpdate = true

      // Órbitas
      for (let i = 0; i < orbCount; i++) {
        const o = orbData[i]
        o.a += 0.004 * o.speed * (1 + audio * 2 + boost)
        const rad = o.rad + audio * 0.15
        const x = Math.cos(o.a) * rad
        const z = Math.sin(o.a) * rad
        const y = Math.sin(o.a * 2) * o.tilt
        orbPosAttr.array[i * 3] = x
        orbPosAttr.array[i * 3 + 1] = y
        orbPosAttr.array[i * 3 + 2] = z
      }
      orbPosAttr.needsUpdate = true

      // Núcleo late con la voz
      const targetScale = 1 + audio * 0.5 + boost * 0.4 + Math.sin(tick * 3) * 0.03
      coreScale += (targetScale - coreScale) * 0.2
      core.scale.setScalar(coreScale)
      coreMat.opacity = 0.18 + audio * 0.35 + boost * 0.3

      group.rotation.y += 0.0008 + m.strength * 0.002 + audio * 0.004
      group.rotation.x += 0.0003
      orbs.rotation.z += 0.001

      renderer.render(scene, camera)
    }
    animate()

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
      geo.dispose(); mat.dispose()
      coreGeo.dispose(); coreMat.dispose()
      orbGeo.dispose(); orbMat.dispose()
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
    configureUtterance(utt)
    utt.onstart = () => { speakingRef.current = true; audioLevelRef.current = 0.7 }
    utt.onend = () => { speakingRef.current = false; audioLevelRef.current = 0 }
    window.speechSynthesis.speak(utt)
    setTimeout(() => {
      setPhase('exiting')
      setTimeout(onEnter, 900)
    }, 1600)
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
        <img src={Logo1} alt="Valkyron Group" style={{ width: '120px', marginBottom: '1.5rem', opacity: 0.9 }} />

        <div
          ref={wrapRef}
          style={{ position: 'relative', width: '360px', height: '360px', cursor: 'pointer', marginBottom: '2rem' }}
          onClick={handleActivate}
        >
          <canvas ref={canvasRef} style={{ width: '360px', height: '360px', display: 'block' }} />

          {/* Glow externo — pulsa cuando MIA habla */}
          <div style={{
            position: 'absolute', inset: '-14px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 68%)',
            pointerEvents: 'none',
            transform: speaking ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform .25s ease-out',
            animation: speaking ? 'coreGlow 0.6s ease-in-out infinite' : 'none',
          }} />

          {phase === 'activating' && [0, 150, 300].map(d => (
            <div key={d} style={{
              position: 'absolute', inset: '15%', borderRadius: '50%',
              border: '1px solid rgba(196,181,253,0.7)',
              animation: `burst 1.2s ease-out forwards ${d}ms`,
            }} />
          ))}
        </div>

        <img src={LogoMIA} alt="MIA" style={{ height: '36px', marginBottom: '1.5rem', opacity: 0.85 }} />

        {speaking && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '18px', marginBottom: '1rem' }}>
            {[0, 1, 2, 3, 4].map(i => (
              <span key={i} style={{
                width: '3px', background: '#A78BFA', borderRadius: '2px',
                animation: `speakBar 0.7s ease-in-out infinite ${i * 0.1}s`,
              }} />
            ))}
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '3px', color: '#A78BFA', textTransform: 'uppercase', marginLeft: '6px' }}>Mía</span>
          </div>
        )}

        {listening && !speaking && (
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

        <div style={{ marginTop: '1.5rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '2px', color: '#3A3352', textTransform: 'uppercase', textAlign: 'center' }}>
          Habla con Mía o haz clic para continuar
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes burst { 0%{transform:scale(1);opacity:.9} 100%{transform:scale(3.5);opacity:0} }
        @keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:.7} }
        @keyframes coreGlow { 0%,100%{opacity:.7} 50%{opacity:1} }
        @keyframes speakBar { 0%,100%{height:5px} 50%{height:18px} }
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