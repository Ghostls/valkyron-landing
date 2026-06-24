import { useEffect, useRef, useState } from 'react'

const EMAIL = 'valkyrondefensegroup@gmail.com'

const channels = [
  { label: 'Email directo', value: EMAIL, href: `mailto:${EMAIL}`, icon: '✉' },
  { label: 'Sede', value: 'Barquisimeto, Venezuela', href: null, icon: '◎' },
  { label: 'Mercado', value: 'Latinoamérica', href: null, icon: '◈' },
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

import React from 'react'

export default function ContactoCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef as React.RefObject<Element>)
  const [copied, setCopied] = useState(false)
  const [btnHover, setBtnHover] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      ref={sectionRef}
      id="contacto"
      style={{
        background: '#080810',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(80px,10vw,140px) 5%',
      }}
    >
      {/* Deep purple glow center */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '80vw', height: '80vw', maxWidth: '900px',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      {/* Corner TL */}
      <div style={{ position: 'absolute', top: '3rem', left: '5%', pointerEvents: 'none' }}>
        <div style={{ width: '40px', height: '1px', background: 'rgba(124,58,237,0.3)' }} />
        <div style={{ width: '1px', height: '40px', background: 'rgba(124,58,237,0.3)' }} />
      </div>
      {/* Corner BR */}
      <div style={{ position: 'absolute', bottom: '3rem', right: '5%', pointerEvents: 'none' }}>
        <div style={{ width: '40px', height: '1px', background: 'rgba(124,58,237,0.3)', marginLeft: 'auto' }} />
        <div style={{ width: '1px', height: '40px', background: 'rgba(124,58,237,0.3)', marginLeft: 'auto' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>

        {/* Label */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          marginBottom: '2rem',
          opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.4))' }} />
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: '#7C3AED' }}>
            Contacto
          </span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(124,58,237,0.4))' }} />
        </div>

        {/* Headline */}
        <div style={{
          textAlign: 'center', marginBottom: 'clamp(2rem,4vw,3.5rem)',
          opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
        }}>
          <h2 style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 'clamp(40px,6vw,80px)', fontWeight: 700,
            textTransform: 'uppercase', lineHeight: 0.92,
            letterSpacing: '-1px', margin: '0 0 1.5rem',
          }}>
            <span style={{ display: 'block', color: '#E2E8F0' }}>¿Listo para</span>
            <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '1px rgba(167,139,250,0.4)' }}>
              operar al
            </span>
            <span style={{ display: 'block', color: '#7C3AED' }}>siguiente nivel?</span>
          </h2>
          <p style={{
            fontSize: 'clamp(14px,1.3vw,16px)',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 300, maxWidth: '480px', margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Cuéntanos qué necesitas construir. Respondemos en menos de 24 horas.
          </p>
        </div>

        {/* CTA buttons */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '1rem',
          flexWrap: 'wrap', marginBottom: 'clamp(3rem,5vw,5rem)',
          opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s',
        }}>
          {/* Primary */}
          <a
            href={`mailto:${EMAIL}`}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase',
              padding: '16px 40px', fontWeight: 600,
              background: btnHover ? '#6D28D9' : '#7C3AED',
              color: 'white', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              transition: 'all 0.25s',
              transform: btnHover ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: btnHover ? '0 8px 24px rgba(124,58,237,0.35)' : '0 0 0 rgba(0,0,0,0)',
            }}
          >
            Escribir ahora
            <span style={{ fontSize: '16px', opacity: 0.8 }}>→</span>
          </a>

          {/* Copy email */}
          <button
            onClick={handleCopy}
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
              padding: '16px 28px',
              background: 'transparent',
              color: copied ? '#22C55E' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.color = '#A78BFA' }}}
            onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}}
          >
            <span style={{ fontSize: '12px' }}>{copied ? '✓' : '⎘'}</span>
            {copied ? 'Email copiado' : 'Copiar email'}
          </button>
        </div>

        {/* Info cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,200px), 1fr))',
          gap: '2px',
          background: 'rgba(124,58,237,0.08)',
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.8s ease 0.4s',
        }}>
          {channels.map((c, i) => (
            <div key={c.label} style={{
              background: '#080810',
              padding: '1.5rem 2rem',
              borderTop: `1px solid ${i === 0 ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)'}`,
              display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#7C3AED', fontSize: '12px' }}>{c.icon}</span>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                  {c.label}
                </span>
              </div>
              {c.href ? (
                <a href={c.href} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: '#A78BFA', textDecoration: 'none', letterSpacing: '1px', wordBreak: 'break-all' }}>
                  {c.value}
                </a>
              ) : (
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>
                  {c.value}
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}