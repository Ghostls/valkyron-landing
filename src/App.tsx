import { useState } from 'react'
import MIAIntro from './components/MIAIntro'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MisionVision from './components/MisionVision'
import QuienesSomos from './components/QuienesSomos'
import Servicios from './components/Servicios'
import Portafolio from './components/Portafolio'
import ContactoCTA from './components/ContactoCTA'
import Footer from './components/Footer'
import Divider from './components/Divider'

export default function App() {
  const [entered, setEntered] = useState(false)

  return (
    <>
      {/* MIA Intro — unmounts after entering */}
      {!entered && <MIAIntro onEnter={() => setEntered(true)} />}

      {/* Main site — fades in after intro */}
      <div
        style={{
          opacity: entered ? 1 : 0,
          transition: 'opacity 1.2s ease-in',
          pointerEvents: entered ? 'auto' : 'none',
        }}
      >
        <Navbar />
        <main>
          <Hero />
          <Divider />
          <MisionVision />
          <Divider />
          <QuienesSomos />
          <Divider />
          <Servicios />
          <Divider />
          <Portafolio />
          <Divider />
          <ContactoCTA />
        </main>
        <Footer />
      </div>
    </>
  )
}