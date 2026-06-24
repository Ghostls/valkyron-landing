import Logo2 from '../assets/Logo2.png'

const links = [
  { label: 'Misión', href: '#mision' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Portafolio', href: '#portafolio' },
  { label: 'Contacto', href: '#contacto' },
]

const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'GitHub', href: '#' },
]

export default function Footer() {
  return (
    <footer style={{
      background: '#040408',
      borderTop: '1px solid rgba(124,58,237,0.12)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Background watermark */}
      <div style={{
        position: 'absolute', bottom: '-20px', right: '3%',
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 'clamp(60px,10vw,120px)', fontWeight: 700,
        letterSpacing: '-4px', lineHeight: 1,
        color: 'rgba(124,58,237,0.03)',
        textTransform: 'uppercase',
        pointerEvents: 'none', userSelect: 'none',
      }}>VALKYRON</div>

      {/* Main footer content */}
      <div style={{ padding: 'clamp(2.5rem,5vw,4rem) 5% 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,200px), 1fr))',
          gap: 'clamp(2rem,4vw,4rem)',
          paddingBottom: 'clamp(2rem,4vw,3.5rem)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>

          {/* Brand col */}
          <div style={{ gridColumn: 'span 2' }}>
            <img
              src={Logo2}
              alt="Valkyron Group"
              style={{ height: '36px', marginBottom: '1.25rem', opacity: 0.85, objectFit: 'contain', objectPosition: 'left' }}
            />
            <p style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '11px', letterSpacing: '1.5px', lineHeight: 1.8,
              color: 'rgba(255,255,255,0.3)', maxWidth: '280px', margin: '0 0 1.5rem',
            }}>
              Tecnología de nivel estratégico.<br />
              Construida para operar donde otros fallan.
            </p>
            {/* Status badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: '#22C55E', boxShadow: '0 0 6px #22C55E',
                display: 'inline-block',
              }} />
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
              }}>Barquisimeto, Venezuela — Operativo</span>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
              color: '#7C3AED', marginBottom: '1.25rem',
            }}>Navegación</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {links.map(l => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '14px', fontWeight: 500,
                      letterSpacing: '2px', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#A78BFA'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                  >{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact col */}
          <div>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
              color: '#7C3AED', marginBottom: '1.25rem',
            }}>Contacto</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Email', value: 'info@valkyron.com' },
                { label: 'Sede', value: 'Barquisimeto, VEN' },
                { label: 'Mercado', value: 'Latinoamérica' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.2)', textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#7C3AED'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                >{s.label}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: '1.25rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.15)',
          }}>© 2025 Valkyron Group. Todos los derechos reservados.</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(124,58,237,0.4)' }} />
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.12)',
            }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}