import { useEffect, useState } from 'react'
import { scrollTo } from '../lib/motion'

// No está en la portada (deja libre la cabeza de Abril): entra desde arriba
// cuando se pasó dos tercios de la portada. Fondo rosa translúcido para leerse sobre las fotos.
export default function Nav() {
  const [on, setOn] = useState(false)
  const [oscuro, setOscuro] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setOn(window.scrollY > innerHeight * 0.65)
      const el = document.elementFromPoint(innerWidth / 2, 70)
      setOscuro(!!el?.closest('.carru, .cierre, .serie[data-fondo="cherry"], .serie[data-fondo="bordo"]'))
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  const ir = (id) => (e) => {
    e.preventDefault()
    scrollTo(id)
  }

  return (
    <header className="nav" data-on={on} data-oscuro={oscuro}>
      <a className="nav__marca" href="#inicio" onClick={ir('#inicio')}>Abril Wisspi</a>
      <span className="nav__centro">Diseño gráfico</span>
      <nav className="nav__links" aria-label="Secciones">
        <a href="#sobre-mi" onClick={ir('#sobre-mi')}>Sobre mí</a>
        <a href="#proyectos" onClick={ir('#proyectos')}>Proyectos</a>
        <a href="#fotografia" onClick={ir('#fotografia')}>Fotografía</a>
        <a href="#contacto" onClick={ir('#contacto')}>Contacto</a>
      </nav>
    </header>
  )
}
