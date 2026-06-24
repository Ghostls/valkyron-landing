import { useEffect, useRef, useState } from 'react'

const cards = [
  {
    tag: '// Misión',
    title: '¿Por qué existimos?',
    num: '01',
    keyword: 'IMPACTO REAL',
    text: 'Construir tecnología de nivel estratégico que potencie las operaciones de organizaciones venezolanas y latinoamericanas. Cada solución que desarrollamos está diseñada para operar en condiciones exigentes y generar impacto donde más se necesita.',
    items: ['Sistemas para operaciones críticas', 'Software que sobrevive al cambio', 'Infraestructura, no solo apps'],
  },
  {
    tag: '// Visión',
    title: '¿Hacia dónde vamos?',
    num: '02',
    keyword: 'REFERENTE GLOBAL',
    text: 'Posicionarnos como el referente latinoamericano en tecnología de defensa y sistemas autónomos, reconocidos globalmente por inteligencia artificial aplicada a operaciones críticas, drones autónomos y plataformas de command & control.',
    items: ['Líderes en defense-tech latam', 'IA en operaciones reales', 'Command & Control de siguiente gen'],
  },
]

function useInView(ref: React.RefObject<Element>) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return inView
}

import React from 'react'

export default function MisionVision() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef as React.RefObject<Element>)

  return (
    <section
      ref={sectionRef}
      id="mision"
      style={{ padding: 'clamp(60px,8vw,120px) 5%', background: '#0A0A14', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background text watermark */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 'clamp(80px,14vw,200px)',
        fontWeight: 700, letterSpacing: '-4px',
        color: 'rgba(124,58,237,0.03)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        pointerEvents: 'none', userSelect: 'none',
        lineHeight: 1,
      }}>
        VALKYRON
      </div>

      {/* Section label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '1rem',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        <div style={{ width: '32px', height: '1px', background: '#7C3AED' }} />
        <span style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: '10px',
          letterSpacing: '4px', textTransform: 'uppercase', color: '#7C3AED',
        }}>Fundamentos</span>
      </div>

      {/* Heading */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 'clamp(2rem,4vw,4rem)',
        flexWrap: 'wrap', gap: '1rem',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
      }}>
        <h2 style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 'clamp(36px,5vw,64px)',
          fontWeight: 700, textTransform: 'uppercase',
          lineHeight: 0.95, letterSpacing: '-1px', margin: 0,
          color: '#E2E8F0',
        }}>
          Propósito &<br />
          <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(167,139,250,0.4)' }}>
            Dirección
          </span>
        </h2>
        <p style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '11px', color: '#ffffff', letterSpacing: '2px',
          textTransform: 'uppercase', maxWidth: '260px', lineHeight: 1.7, margin: 0,
        }}>
          La razón por la que Valkyron existe y el horizonte al que apunta.
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,480px), 1fr))',
        gap: '2px',
        background: 'rgba(124,58,237,0.08)',
        border: '1px solid rgba(124,58,237,0.08)',
      }}>
        {cards.map((c, idx) => (
          <CardItem key={c.num} card={c} idx={idx} inView={inView} />
        ))}
      </div>
    </section>
  )
}

function CardItem({ card: c, idx, inView }: { card: typeof cards[0], idx: number, inView: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#0F0F1C' : '#0A0A14',
        padding: 'clamp(2rem,3vw,3.5rem)',
        position: 'relative', overflow: 'hidden',
        borderTop: `2px solid ${hovered ? '#A78BFA' : '#7C3AED'}`,
        transition: 'background 0.4s ease, border-color 0.3s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transitionProperty: 'opacity, transform, background, border-color',
        transitionDuration: `0.7s, 0.7s, 0.4s, 0.3s`,
        transitionDelay: `${0.2 + idx * 0.12}s, ${0.2 + idx * 0.12}s, 0s, 0s`,
        cursor: 'default',
      }}
    >
      {/* Hover glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: hovered
          ? 'linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)'
          : 'transparent',
        transition: 'background 0.4s',
      }} />

      {/* Tag + num row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: '10px',
          letterSpacing: '4px', textTransform: 'uppercase',
          color: hovered ? '#A78BFA' : '#7C3AED',
          transition: 'color 0.3s',
        }}>{c.tag}</span>
        <span style={{
          fontFamily: "'Rajdhani', sans-serif", fontSize: '11px',
          letterSpacing: '3px', color: 'rgba(124,58,237,0.2)',
          fontWeight: 600,
        }}>{c.num}</span>
      </div>

      {/* Keyword badge */}
      <div style={{
        display: 'inline-block',
        padding: '3px 10px',
        border: '1px solid rgba(124,58,237,0.2)',
        background: 'rgba(124,58,237,0.06)',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '9px', letterSpacing: '3px',
        textTransform: 'uppercase', color: '#5B21B6',
        marginBottom: '1.25rem',
      }}>{c.keyword}</div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 'clamp(22px,2.5vw,30px)',
        fontWeight: 700, textTransform: 'uppercase',
        color: '#E2E8F0', letterSpacing: '1px',
        marginBottom: '1.25rem', lineHeight: 1.1,
      }}>{c.title}</h3>

      {/* Text */}
      <p style={{
        fontSize: 'clamp(13px,1.2vw,15px)',
        color: '#ffffff', lineHeight: 1.85,
        fontWeight: 300, marginBottom: '2rem',
      }}>{c.text}</p>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(124,58,237,0.1)', marginBottom: '1.5rem' }} />

      {/* Items */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {c.items.map(item => (
          <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '4px', height: '4px', borderRadius: '50%',
              background: '#7C3AED', flexShrink: 0,
              boxShadow: hovered ? '0 0 6px #7C3AED' : 'none',
              transition: 'box-shadow 0.3s',
            }} />
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px', letterSpacing: '2px',
              textTransform: 'uppercase', color: '#ffffff',
            }}>{item}</span>
          </li>
        ))}
      </ul>

      {/* Big background number */}
      <div style={{
        position: 'absolute', bottom: '1.5rem', right: '2rem',
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 'clamp(60px,8vw,96px)',
        fontWeight: 700, letterSpacing: '-4px', lineHeight: 1,
        color: hovered ? 'rgba(124,58,237,0.06)' : 'rgba(124,58,237,0.03)',
        transition: 'color 0.4s', userSelect: 'none',
      }}>{c.num}</div>
    </div>
  )
}