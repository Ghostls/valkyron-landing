import React, { useEffect, useRef, useState } from 'react'

const projects = [
  {
    id: '001',
    tag: 'Defensa · IA · Autónomo',
    name: 'M.I.A.',
    fullName: 'Modulo de Inteligencia Autónoma',
    status: 'En desarrollo',
    year: '2022',
    desc: 'Sistema de inteligencia autónoma para control de aeronaves no tripuladas. Navegación SLAM, visión por computadora, fusión IMU/Kalman 9D y misiones de reconocimiento sin intervención humana.',
    impact: 'Primera IA venezolana para drones tácticos',
    tech: ['Python', 'OpenCV', 'Kalman 9D', 'SLAM', 'DJI Tello EDU', 'MAVLink 2'],
    featured: true,
    color: '#7C3AED',
    colorDim: 'rgba(124,58,237,0.12)',
  },
  {
    id: '002',
    tag: 'Aviación · Academia',
    name: 'Águilas Pilot',
    fullName: 'Modulo MRO y Academia de Pilotos',
    status: 'Activo',
    year: '2026',
    desc: 'Sistema integral para academia de pilotos. Módulos académicos, calificaciones, control de flota, combustible y operaciones de vuelo con panel command & control en tiempo real.',
    impact: '100% operaciones académicas digitalizadas',
    tech: ['React', 'TypeScript', 'Supabase', 'Realtime'],
    featured: false,
    color: '#2563EB',
    colorDim: 'rgba(37,99,235,0.08)',
  },
  {
    id: '003',
    tag: 'Running · Padel · Timing',
    name: 'Rayocero',
    fullName: 'Plataforma de eventos deportivos',
    status: 'Activo',
    year: '2026',
    desc: 'Plataforma de eventos deportivos con timing RFID Zebra FX9600, resultados en vivo, certificados digitales canvas y gestión de torneos de padel y beach tennis.',
    impact: '+600 atletas cronometrados en tiempo real',
    tech: ['React', 'Vite', 'RFID LLRP', 'Canvas API', 'Leaflet'],
    featured: false,
    color: '#059669',
    colorDim: 'rgba(5,150,105,0.08)',
  },
  {
    id: '004',
    tag: 'Manufactura · ERP',
    name: 'Alchaplast Vision',
    fullName: 'Sistema ERP de manufactura y ventas',
    status: 'Activo',
    year: '2026',
    desc: 'ERP de manufactura con ventas multi-almacén, inventario dinámico, punto de venta, facturación y finanzas multi-moneda USD/BS/ZELLE.',
    impact: 'Operaciones de manufactura unificadas',
    tech: ['React', 'TypeScript', 'Supabase', 'Tailwind'],
    featured: false,
    color: '#D97706',
    colorDim: 'rgba(217,119,6,0.08)',
  },
  {
    id: '005',
    tag: 'Directorio · Negocios',
    name: 'El Distrito',
    fullName: 'Directorio de Negocios Venezolanos',
    status: 'En desarrollo',
    year: '2026',
    desc: 'Plataforma de descubrimiento de negocios venezolanos con geolocalización, perfiles verificados, categorías y modelo de monetización escalonada. El directorio digital de Venezuela.',
    impact: 'Directorio digital para negocios venezolanos',
    tech: ['React', 'TypeScript', 'Supabase', 'Mapbox'],
    featured: false,
    color: '#DC2626',
    colorDim: 'rgba(220,38,38,0.08)',
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

export default function Portafolio() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef as React.RefObject<Element>)
  const [active, setActive] = useState<string | null>(null)

  return (
    <section
      ref={sectionRef}
      id="portafolio"
      style={{ padding: 'clamp(60px,8vw,120px) 5%', background: '#080810', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 65%)',
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
          Portafolio
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
          <span style={{ display: 'block', color: '#E2E8F0' }}>Sistemas</span>
          <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '1px rgba(167,139,250,0.4)' }}>
            desplegados
          </span>
        </h2>
        <div style={{ display: 'flex', gap: '2rem', paddingBottom: '8px' }}>
          {[['5', 'Proyectos'], ['100%', 'Activos'], ['2022–26', 'Años']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: '#E2E8F0', lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
        gap: 'clamp(1rem,2vw,1.5rem)',
      }}>
        {projects.map((p, idx) => (
          <ProjectCard
            key={p.id}
            project={p}
            idx={idx}
            inView={inView}
            isActive={active === p.id}
            onEnter={() => setActive(p.id)}
            onLeave={() => setActive(null)}
          />
        ))}
      </div>

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}`}</style>
    </section>
  )
}

function ProjectCard({ project: p, idx, inView, isActive, onEnter, onLeave }: {
  project: typeof projects[0]
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
        position: 'relative', overflow: 'hidden',
        background: isActive
          ? p.featured ? '#130B2A' : '#0D0D1A'
          : p.featured ? '#0E0720' : '#0A0A14',
        border: `1px solid ${isActive ? p.color : p.featured ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)'}`,
        padding: 'clamp(1.75rem,2.5vw,2.5rem)',
        transition: 'background 0.35s, border-color 0.3s',
        cursor: 'default',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transitionProperty: 'opacity, transform, background, border-color',
        transitionDuration: '0.7s, 0.7s, 0.35s, 0.3s',
        transitionDelay: `${0.15 + idx * 0.1}s, ${0.15 + idx * 0.1}s, 0s, 0s`,
      }}
    >
      {/* Top color bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: isActive
          ? `linear-gradient(90deg, transparent, ${p.color}, transparent)`
          : p.featured
            ? `linear-gradient(90deg, ${p.color}, transparent)`
            : 'transparent',
        transition: 'background 0.4s',
      }} />

      {/* Corner accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '80px', height: '80px',
        background: `radial-gradient(circle at top right, ${p.colorDim}, transparent 70%)`,
        transition: 'opacity 0.3s',
        opacity: isActive ? 1 : 0.5,
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* ID */}
          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: '9px',
            letterSpacing: '3px', color: 'rgba(255,255,255,0.2)',
          }}>{p.id}</span>
          {/* Tag pill */}
          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: '9px',
            letterSpacing: '2px', textTransform: 'uppercase',
            padding: '3px 10px',
            background: `${p.colorDim}`,
            border: `1px solid ${p.color}30`,
            color: p.color,
            width: 'fit-content',
          }}>{p.tag}</span>
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: p.status === 'En desarrollo' ? '#F59E0B' : '#22C55E',
            boxShadow: `0 0 6px ${p.status === 'En desarrollo' ? '#F59E0B' : '#22C55E'}`,
            animation: 'blink 2s infinite',
          }} />
          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: '9px',
            letterSpacing: '2px', textTransform: 'uppercase',
            color: p.status === 'En desarrollo' ? '#F59E0B' : '#22C55E',
          }}>{p.status}</span>
        </div>
      </div>

      {/* Project name */}
      <div style={{ marginBottom: '0.4rem' }}>
        <h3 style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-0.5px',
          color: isActive ? '#FFFFFF' : '#E2E8F0',
          margin: 0, lineHeight: 1,
          transition: 'color 0.3s',
        }}>{p.name}</h3>
        <p style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
          color: isActive ? p.color : 'rgba(255,255,255,0.25)',
          margin: '4px 0 0', transition: 'color 0.3s',
        }}>{p.fullName}</p>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px', margin: '1.25rem 0',
        background: isActive ? `${p.color}40` : 'rgba(255,255,255,0.06)',
        transition: 'background 0.3s',
      }} />

      {/* Description */}
      <p style={{
        fontSize: 'clamp(12px,1.1vw,14px)',
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.8, margin: '0 0 1.5rem',
      }}>{p.desc}</p>

      {/* Impact line */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '1.5rem',
        padding: '10px 14px',
        background: isActive ? `${p.colorDim}` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isActive ? `${p.color}30` : 'rgba(255,255,255,0.04)'}`,
        transition: 'all 0.3s',
      }}>
        <span style={{ color: p.color, fontSize: '12px', flexShrink: 0 }}>◆</span>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
          color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
          transition: 'color 0.3s',
        }}>{p.impact}</span>
      </div>

      {/* Tech pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {p.tech.map(t => (
          <span key={t} style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '9px', letterSpacing: '1px', padding: '4px 10px',
            background: isActive ? `${p.colorDim}` : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isActive ? `${p.color}35` : 'rgba(255,255,255,0.07)'}`,
            color: isActive ? p.color : 'rgba(255,255,255,0.35)',
            transition: 'all 0.3s',
          }}>{t}</span>
        ))}
      </div>

      {/* Year bottom right */}
      <div style={{
        position: 'absolute', bottom: '1.5rem', right: '1.75rem',
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 'clamp(48px,6vw,80px)', fontWeight: 700,
        color: isActive ? `${p.color}08` : 'rgba(255,255,255,0.02)',
        lineHeight: 1, letterSpacing: '-2px',
        transition: 'color 0.4s', userSelect: 'none', pointerEvents: 'none',
      }}>{p.year}</div>
    </div>
  )
}