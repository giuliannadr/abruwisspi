import { useEffect, useState } from 'react'
import { scrollTo } from '../lib/motion'

// No está en la portada (deja libre la cabeza de Abril): entra desde arriba
// cuando se pasó dos tercios de la portada. Fondo rosa translúcido para leerse sobre las fotos.
export default function Nav() {
  const [on, setOn] = useState(false)
  const [oscuro, setOscuro] = useState(false)

  useEffect(() => {
    // aparece pasada la portada (una sola medición por cuadro, no por evento)
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => { raf = 0; setOn(window.scrollY > innerHeight * 0.65) })
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    // fondo oscuro: una franja de 1 px a la altura del nav avisa qué sección pasa por debajo
    const debajo = new Set()
    const evaluar = () => setOscuro(debajo.size > 0)
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? debajo.add(e.target) : debajo.delete(e.target)
      evaluar()
    }, { rootMargin: `-70px 0px -${Math.max(0, innerHeight - 71)}px 0px` })
    document.querySelectorAll('.carru, .cierre, .serie[data-fondo="cherry"], .serie[data-fondo="bordo"]').forEach((el) => io.observe(el))
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); io.disconnect() }
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
