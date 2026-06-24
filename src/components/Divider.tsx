import { useEffect, useRef, useState } from 'react'

export default function Divider() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: '32px', display: 'flex', alignItems: 'center' }}>
      {/* Main line — animates in from center */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        height: '1px',
        width: inView ? '100%' : '0%',
        background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.25), rgba(124,58,237,0.5), rgba(124,58,237,0.25), transparent)',
        transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
      }} />

      {/* Center diamond */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: `translate(-50%,-50%) rotate(45deg) scale(${inView ? 1 : 0})`,
        width: '6px', height: '6px',
        background: '#7C3AED',
        boxShadow: inView ? '0 0 8px rgba(124,58,237,0.6)' : 'none',
        transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.4s, box-shadow 0.5s ease 0.4s',
      }} />

      {/* Left dot */}
      <div style={{
        position: 'absolute', left: '5%', top: '50%',
        transform: `translateY(-50%) scale(${inView ? 1 : 0})`,
        width: '3px', height: '3px', borderRadius: '50%',
        background: 'rgba(124,58,237,0.3)',
        transition: 'transform 0.4s ease 0.7s',
      }} />

      {/* Right dot */}
      <div style={{
        position: 'absolute', right: '5%', top: '50%',
        transform: `translateY(-50%) scale(${inView ? 1 : 0})`,
        width: '3px', height: '3px', borderRadius: '50%',
        background: 'rgba(124,58,237,0.3)',
        transition: 'transform 0.4s ease 0.7s',
      }} />
    </div>
  )
}