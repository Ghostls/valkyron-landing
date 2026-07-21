import React, { useState, useEffect } from 'react'
import Logo2 from '../assets/Logo2.png'

const links: { label: string; href: string }[] = [
  { label: 'Misión', href: '#mision' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Portafolio', href: '#portafolio' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  // Bloquea el scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Cierra con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <nav style={navStyle}>
        <a href="#hero" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={Logo2} alt="Valkyron Group" style={{ height: '30px', objectFit: 'contain', display: 'block' }} className="vk-logo" />
        </a>

        {/* Links de escritorio */}
        <div className="vk-desktop-links" style={{ gap: '2rem' }}>
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#A78BFA')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA de escritorio */}
        <a
          href="#contacto"
          className="vk-desktop-cta"
          style={ctaStyle}
          onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.color = 'white' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A78BFA' }}
        >
          Contactar
        </a>

        {/* Botón hamburguesa (solo móvil) */}
        <button
          className="vk-burger"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          style={burgerStyle}
        >
          <span style={{ ...burgerBar, transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }} />
          <span style={{ ...burgerBar, opacity: open ? 0 : 1 }} />
          <span style={{ ...burgerBar, transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 90,
          background: 'rgba(4,4,8,0.6)', backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .3s ease',
        }}
      />

      {/* Drawer */}
      <aside
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 95,
          width: 'min(80vw, 320px)',
          background: 'rgba(8,8,16,0.98)', backdropFilter: 'blur(16px)',
          borderLeft: '1px solid #1E1B2E',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .32s cubic-bezier(.4,0,.2,1)',
          display: 'flex', flexDirection: 'column',
          padding: '88px 8% 2rem',
        }}
      >
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            style={{
              fontFamily: "'Rajdhani', sans-serif", fontSize: '20px', fontWeight: 600,
              letterSpacing: '2px', textTransform: 'uppercase', color: '#E2E8F0',
              textDecoration: 'none', padding: '16px 0',
              borderBottom: '1px solid rgba(124,58,237,0.12)',
              opacity: open ? 1 : 0,
              transform: open ? 'translateX(0)' : 'translateX(20px)',
              transition: `opacity .3s ease ${0.1 + i * 0.06}s, transform .3s ease ${0.1 + i * 0.06}s`,
            }}
          >
            {l.label}
          </a>
        ))}

        <a
          href="#contacto"
          onClick={() => setOpen(false)}
          style={{
            marginTop: '2rem',
            fontFamily: "'Rajdhani', sans-serif", fontSize: '13px', letterSpacing: '3px',
            textTransform: 'uppercase', textAlign: 'center', padding: '14px',
            background: '#7C3AED', color: 'white', textDecoration: 'none', fontWeight: 600,
          }}
        >
          Contactar
        </a>
      </aside>

      <style>{`
        .vk-desktop-links { display: flex; }
        .vk-burger { display: none; }
        @media (max-width: 768px) {
          .vk-desktop-links, .vk-desktop-cta { display: none !important; }
          .vk-burger { display: flex !important; }
        }
      `}</style>
    </>
  )
}

const navStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
  padding: '0 5%', height: '64px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  background: 'rgba(8, 8, 16, 0.9)', backdropFilter: 'blur(12px)',
  borderBottom: '1px solid #1E1B2E',
}

const linkStyle: React.CSSProperties = {
  fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase',
  color: '#94A3B8', textDecoration: 'none', transition: 'color .2s',
}

const ctaStyle: React.CSSProperties = {
  fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', letterSpacing: '2px',
  textTransform: 'uppercase', padding: '8px 20px', border: '1px solid #7C3AED',
  color: '#A78BFA', background: 'transparent', cursor: 'pointer',
  textDecoration: 'none', transition: 'all .2s',
}

const burgerStyle: React.CSSProperties = {
  flexDirection: 'column', justifyContent: 'center', gap: '4px',
  width: '40px', height: '40px', padding: 0,
  background: 'transparent', border: 'none', cursor: 'pointer',
}

const burgerBar: React.CSSProperties = {
  display: 'block', width: '22px', height: '2px', background: '#A78BFA',
  borderRadius: '2px', transition: 'all .3s ease',
}