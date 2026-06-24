import React from 'react'

const navStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  padding: '0 5%',
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'rgba(8, 8, 16, 0.9)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid #1E1B2E',
}

const links: { label: string; href: string }[] = [
  { label: 'Misión', href: '#mision' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Portafolio', href: '#portafolio' },
]

export default function Navbar() {
  return (
    <nav style={navStyle}>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#E2E8F0' }}>
        VALKYRON<span style={{ color: '#7C3AED' }}>.</span>GROUP
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {links.map(l => (
          <a
            key={l.href}
            href={l.href}
            style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#94A3B8', textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#A78BFA')}
            onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
          >
            {l.label}
          </a>
        ))}
      </div>

      <a
        href="#contacto"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '12px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          padding: '8px 20px',
          border: '1px solid #7C3AED',
          color: '#A78BFA',
          background: 'transparent',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all .2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.color = 'white' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A78BFA' }}
      >
        Contactar
      </a>
    </nav>
  )
}
