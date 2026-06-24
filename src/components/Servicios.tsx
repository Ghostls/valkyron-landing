import React, { useEffect, useRef, useState } from 'react'

const services = [
  {
    id: '001',
    icon: '⬡',
    tag: 'DEFENSE · IA',
    name: 'Sistemas autónomos',
    short: 'Drones que piensan solos.',
    desc: 'Desarrollamos M.I.A. — inteligencia artificial para control de aeronaves no tripuladas. Navegación SLAM, visión por computadora, fusión IMU/Kalman 9D y misiones de reconocimiento sin intervención humana.',
    highlight: true,
    badge: 'En desarrollo activo',
    stack: ['Python', 'OpenCV', 'SLAM', 'MAVLink 2'],
  },
  {
    id: '002',
    icon: '◈',
    tag: 'ENTERPRISE',
    name: 'Plataformas empresariales',
    short: 'ERPs que no fallan bajo presión.',
    desc: 'Sistemas de gestión multi-módulo a medida: inventario dinámico, finanzas multi-moneda, punto de venta y flujos operativos complejos diseñados para el entorno venezolano.',
    highlight: false,
    badge: null,
    stack: ['React', 'TypeScript', 'Supabase'],
  },
  {
    id: '003',
    icon: '◎',
    tag: 'EDUCACIÓN',
    name: 'Gestión académica',
    short: 'Portales para instituciones técnicas.',
    desc: 'Portales académicos completos: períodos, inscripciones, calificaciones, boletines, índices académicos y certificados. Construidos para academias técnicas de alto nivel.',
    highlight: false,
    badge: null,
    stack: ['React', 'Vite', 'Supabase', 'PDF'],
  },
  {
    id: '004',
    icon: '⬘',
    tag: 'EVENTOS · TIMING',
    name: 'Plataformas de eventos',
    short: 'Timing RFID para miles de atletas.',
    desc: 'Sistemas de cronometraje RFID en tiempo real con lectores Zebra FX9600, resultados en vivo, certificados digitales canvas y gestión de torneos de padel y beach tennis.',
    highlight: false,
    badge: null,
    stack: ['RFID LLRP', 'Canvas API', 'Leaflet', 'WebSocket'],
  },
  {
    id: '005',
    icon: '⬙',
    tag: 'DIRECTORIOS',
    name: 'Directorios digitales',
    short: 'Descubrimiento de negocios verificados.',
    desc: 'Plataformas de descubrimiento con geolocalización, perfiles verificados, categorías y modelos de monetización escalonada. Construidos para mercados latinoamericanos.',
    highlight: false,
    badge: null,
    stack: ['React', 'Mapbox', 'Supabase'],
  },
  {
    id: '006',
    icon: '◍',
    tag: 'HARDWARE · IOT',
    name: 'Integración hardware',
    short: 'Del sensor al cloud en tiempo real.',
    desc: 'Conectamos lectores RFID, drones DJI, sensores industriales y hardware físico con backends cloud en tiempo real. Protocolo LLRP, MAVLink 2, WebSocket y Supabase Realtime.',
    highlight: false,
    badge: null,
    stack: ['LLRP', 'MAVLink', 'WebSocket', 'Supabase'],
  },
]

function useInView(ref: React.RefObject<Element>, threshold = 0.1) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return inView
}

export default function Servicios() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef as React.RefObject<Element>)
  const [active, setActive] = useState<string | null>(null)

  return (
    <section
      ref={sectionRef}
      id="servicios"
      style={{ padding: 'clamp(60px,8vw,120px) 5%', background: '#0A0A14', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background grid accent */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.03) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Glow top right */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(91,33,182,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Section label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem',
        opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        <div style={{ width: '32px', height: '1px', background: '#7C3AED' }} />
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: '#7C3AED' }}>
          Capacidades
        </span>
      </div>

      {/* Heading */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 'clamp(2.5rem,4vw,5rem)', flexWrap: 'wrap', gap: '1rem',
        opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
      }}>
        <h2 style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700,
          textTransform: 'uppercase', lineHeight: 0.95,
          letterSpacing: '-1px', margin: 0,
        }}>
          <span style={{ display: 'block', color: '#E2E8F0' }}>Lo que</span>
          <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '1px rgba(167,139,250,0.4)' }}>
            construimos
          </span>
        </h2>
        <p style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: '10px',
          color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase',
          maxWidth: '260px', lineHeight: 1.8, margin: 0,
        }}>
          6 capacidades — desde drones autónomos hasta ERPs de manufactura.
        </p>
      </div>

      {/* Services grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: '2px',
        background: 'rgba(124,58,237,0.06)',
      }}>
        {services.map((s, idx) => (
          <ServiceCard
            key={s.id}
            service={s}
            idx={idx}
            inView={inView}
            isActive={active === s.id}
            onEnter={() => setActive(s.id)}
            onLeave={() => setActive(null)}
          />
        ))}
      </div>

      {/* Bottom count */}
      <div style={{
        marginTop: '3rem',
        display: 'flex', alignItems: 'center', gap: '1.5rem',
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.7s ease 0.8s',
      }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(124,58,237,0.1)' }} />
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
          6 capacidades desplegadas
        </span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(124,58,237,0.1)' }} />
      </div>
    </section>
  )
}

function ServiceCard({ service: s, idx, inView, isActive, onEnter, onLeave }: {
  service: typeof services[0]
  idx: number
  inView: boolean
  isActive: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: s.highlight
          ? (isActive ? '#130B2A' : '#0E0720')
          : (isActive ? '#0F0F1C' : '#0A0A14'),
        padding: 'clamp(1.75rem,2.5vw,2.75rem)',
        position: 'relative', overflow: 'hidden',
        borderTop: `2px solid ${isActive ? '#A78BFA' : s.highlight ? '#7C3AED' : 'rgba(124,58,237,0.15)'}`,
        transition: 'background 0.35s ease, border-color 0.3s ease',
        cursor: 'default',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transitionProperty: 'opacity, transform, background, border-color',
        transitionDuration: '0.7s, 0.7s, 0.35s, 0.3s',
        transitionDelay: `${0.15 + idx * 0.07}s, ${0.15 + idx * 0.07}s, 0s, 0s`,
      }}
    >
      {/* Active glow line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: isActive ? 'linear-gradient(90deg,transparent,rgba(167,139,250,0.5),transparent)' : 'transparent',
        transition: 'background 0.35s',
      }} />

      {/* Featured badge */}
      {s.badge && (
        <div style={{
          position: 'absolute', top: '1.25rem', right: '1.25rem',
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '3px 10px',
          background: 'rgba(124,58,237,0.15)',
          border: '1px solid rgba(124,58,237,0.3)',
        }}>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 4px #22C55E' }} />
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: '#A78BFA' }}>
            {s.badge}
          </span>
        </div>
      )}

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <span style={{
          fontSize: 'clamp(22px,2.5vw,30px)',
          color: isActive ? '#A78BFA' : s.highlight ? '#7C3AED' : 'rgba(255,255,255,0.2)',
          transition: 'color 0.3s', lineHeight: 1,
        }}>{s.icon}</span>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: '9px',
          letterSpacing: '2px', textTransform: 'uppercase',
          color: isActive ? '#7C3AED' : 'rgba(255,255,255,0.25)',
          transition: 'color 0.3s',
        }}>{s.id}</span>
      </div>

      {/* Tag */}
      <div style={{
        fontFamily: "'Share Tech Mono', monospace", fontSize: '9px',
        letterSpacing: '3px', textTransform: 'uppercase',
        color: isActive ? '#A78BFA' : 'rgba(255,255,255,0.35)',
        marginBottom: '0.75rem',
        transition: 'color 0.3s',
      }}>{s.tag}</div>

      {/* Name */}
      <h3 style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 'clamp(16px,1.8vw,20px)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '1.5px',
        color: isActive ? '#E2E8F0' : 'rgba(255,255,255,0.7)',
        margin: '0 0 0.4rem',
        transition: 'color 0.3s',
      }}>{s.name}</h3>

      {/* Short line */}
      <p style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 'clamp(13px,1.3vw,15px)', fontWeight: 500,
        color: isActive ? '#A78BFA' : 'rgba(255,255,255,0.3)',
        marginBottom: '1rem', margin: '0 0 1rem',
        transition: 'color 0.3s',
        letterSpacing: '0.5px',
      }}>{s.short}</p>

      {/* Divider */}
      <div style={{
        height: '1px', marginBottom: '1rem',
        background: isActive ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)',
        transition: 'background 0.3s',
      }} />

      {/* Desc */}
      <p style={{
        fontSize: 'clamp(12px,1vw,13px)', color: 'rgba(255,255,255,0.45)',
        lineHeight: 1.75, margin: '0 0 1.5rem',
      }}>{s.desc}</p>

      {/* Stack pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {s.stack.map(t => (
          <span key={t} style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: '9px',
            letterSpacing: '1px', padding: '3px 8px',
            background: isActive ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isActive ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.1)'}`,
            color: isActive ? '#A78BFA' : 'rgba(255,255,255,0.35)',
            transition: 'all 0.3s',
          }}>{t}</span>
        ))}
      </div>
    </div>
  )
}