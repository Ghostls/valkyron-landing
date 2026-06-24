import React, { useEffect, useRef, useState } from 'react'

const pillars = [
  {
    num: '01',
    title: 'Arquitectura crítica',
    desc: 'Sistemas diseñados para operar sin fallos bajo alta demanda y condiciones adversas.',
    icon: '◈',
  },
  {
    num: '02',
    title: 'IA aplicada',
    desc: 'Inteligencia artificial integrada en operaciones reales, no en demos de laboratorio.',
    icon: '⬡',
  },
  {
    num: '03',
    title: 'Autonomía operacional',
    desc: 'Desde drones hasta ERPs, nuestros sistemas trabajan solos cuando el operador no puede.',
    icon: '◎',
  },
  {
    num: '04',
    title: 'Contexto local',
    desc: 'Construimos para Venezuela y Latinoamérica, entendiendo sus restricciones y potencial.',
    icon: '◍',
  },
]

const paragraphs = [
  <>
    Valkyron Group es una empresa de{' '}
    <strong style={{ color: '#C4B5FD', fontWeight: 500 }}>tecnología estratégica</strong>{' '}
    con sede en Barquisimeto, Venezuela. Nacimos con una visión clara: llevar tecnología
    de alto rendimiento a organizaciones latinoamericanas que la necesitan para operar,
    crecer y sobrevivir.
  </>,
  <>
    Operamos bajo el principio de{' '}
    <strong style={{ color: '#C4B5FD', fontWeight: 500 }}>evolución sin destrucción</strong>
    {' '}— cada sistema que construimos se diseña para crecer y adaptarse. No desarrollamos
    aplicaciones; desplegamos infraestructura tecnológica que dura.
  </>,
  <>
    Combinamos experiencia en{' '}
    <strong style={{ color: '#C4B5FD', fontWeight: 500 }}>
      ingeniería de software, inteligencia artificial y sistemas autónomos
    </strong>
    {' '}con un profundo conocimiento del contexto operativo latinoamericano.
  </>,
]

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return inView
}

export default function QuienesSomos() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef as React.RefObject<Element>)
  const [activePillar, setActivePillar] = useState<number | null>(null)

  return (
    <section
      ref={sectionRef}
      id="nosotros"
      style={{ padding: 'clamp(60px,8vw,120px) 5%', background: '#080810', position: 'relative', overflow: 'hidden' }}
    >
      {/* Decorative corner lines */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '40px', right: 0, width: '1px', height: '120px', background: 'linear-gradient(to bottom, rgba(124,58,237,0.3), transparent)' }} />
        <div style={{ position: 'absolute', top: '40px', right: 0, width: '120px', height: '1px', background: 'linear-gradient(to left, rgba(124,58,237,0.3), transparent)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '200px', height: '200px', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', bottom: '40px', left: 0, width: '1px', height: '120px', background: 'linear-gradient(to top, rgba(124,58,237,0.3), transparent)' }} />
        <div style={{ position: 'absolute', bottom: '40px', left: 0, width: '120px', height: '1px', background: 'linear-gradient(to right, rgba(124,58,237,0.3), transparent)' }} />
      </div>

      {/* Section label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem',
        opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        <div style={{ width: '32px', height: '1px', background: '#7C3AED' }} />
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: '#7C3AED' }}>
          Identidad
        </span>
      </div>

      {/* Heading row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 'clamp(3rem,5vw,5rem)', flexWrap: 'wrap', gap: '1.5rem',
        opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
      }}>
        <h2 style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700,
          textTransform: 'uppercase', lineHeight: 0.95,
          letterSpacing: '-1px', margin: 0,
        }}>
          <span style={{ display: 'block', color: '#E2E8F0' }}>¿Quiénes</span>
          <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '1px rgba(167,139,250,0.4)' }}>
            somos?
          </span>
        </h2>

        {/* Inline stat */}
        <div style={{
          display: 'flex', gap: '2.5rem', paddingBottom: '8px',
        }}>
          {[['Sep 2024', 'Fundación'], ['VEN', 'Sede'], ['LATAM', 'Mercado']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: '#E2E8F0', lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
        gap: 'clamp(2rem,5vw,5rem)',
        alignItems: 'start',
      }}>

        {/* Left — text */}
        <div style={{
          opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-24px)',
          transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
        }}>
          {/* Pull quote */}
          <blockquote style={{
            borderLeft: '2px solid #7C3AED',
            paddingLeft: '1.5rem',
            marginBottom: '2.5rem',
            margin: '0 0 2.5rem 0',
          }}>
            <p style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 'clamp(18px,2vw,24px)',
              fontWeight: 600, color: '#A78BFA',
              lineHeight: 1.3, letterSpacing: '0.5px',
              textTransform: 'uppercase', margin: 0,
            }}>
              "No vendemos software.<br />Desplegamos infraestructura<br />que opera donde otros fallan."
            </p>
          </blockquote>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {paragraphs.map((p, i) => (
              <p key={i} style={{
                fontSize: 'clamp(13px,1.1vw,15px)',
                color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, fontWeight: 300, margin: 0,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.7s ease ${0.35 + i * 0.1}s, transform 0.7s ease ${0.35 + i * 0.1}s`,
              }}>{p}</p>
            ))}
          </div>

          {/* Tagline */}
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(124,58,237,0.1)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
              Barquisimeto, Venezuela — Operativo
            </span>
          </div>
        </div>

        {/* Right — pillars */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '2px',
          background: 'rgba(124,58,237,0.06)',
          opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(24px)',
          transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
        }}>
          {pillars.map((p, i) => (
            <div
              key={p.num}
              onMouseEnter={() => setActivePillar(i)}
              onMouseLeave={() => setActivePillar(null)}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr',
                gap: '1rem',
                padding: 'clamp(1.2rem,2vw,1.75rem)',
                background: activePillar === i ? '#0F0F1C' : '#080810',
                borderLeft: `2px solid ${activePillar === i ? '#A78BFA' : 'transparent'}`,
                transition: 'background 0.3s, border-color 0.3s',
                cursor: 'default',
              }}
            >
              {/* Icon + number col */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2px', gap: '6px' }}>
                <span style={{
                  fontSize: '18px',
                  color: activePillar === i ? '#A78BFA' : '#5B21B6',
                  transition: 'color 0.3s',
                  lineHeight: 1,
                }}>{p.icon}</span>
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '9px', letterSpacing: '1px',
                  color: activePillar === i ? '#7C3AED' : 'rgba(255,255,255,0.25)',
                  transition: 'color 0.3s',
                }}>{p.num}</span>
              </div>

              {/* Content col */}
              <div>
                <h4 style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 'clamp(14px,1.5vw,17px)',
                  fontWeight: 600, letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: activePillar === i ? '#E2E8F0' : '#94A3B8',
                  marginBottom: '4px', margin: '0 0 4px',
                  transition: 'color 0.3s',
                }}>{p.title}</h4>
                <p style={{
                  fontSize: 'clamp(12px,1vw,13px)',
                  color: activePillar === i ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
                  lineHeight: 1.65, margin: 0,
                  transition: 'color 0.3s',
                }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
