import { useEffect, useState } from 'react'
import { scrollTo } from '../lib/motion'
import { catPorId } from '../data/categorias'

// En el inicio no está en la portada (deja libre la cabeza de Abril): entra desde arriba
// cuando se pasó dos tercios de la portada. En las categorías está siempre y en el centro dice dónde estás.
// Fondo rosa translúcido para leerse sobre las fotos.
export default function Nav({ pagina, inicio }) {
  const [on, setOn] = useState(false)
  const [oscuro, setOscuro] = useState(false)
  const [escondido, setEscondido] = useState(false)

  useEffect(() => {
    // aparece pasada la portada (una sola medición por cuadro, no por evento)
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => { raf = 0; setOn(pagina ? true : window.scrollY > innerHeight * 0.65) })
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
    document.querySelectorAll('.carru, .catc, .tarot, .pliego2[data-oscuro], .cierre, .serie[data-fondo="cherry"], .serie[data-fondo="bordo"]').forEach((el) => io.observe(el))
    // en El Principito el menú se esconde: las cartas salen de la caja hasta arriba y no tiene que taparlas
    const sobre = new Set()
    const ioP = new IntersectionObserver((es) => { for (const e of es) e.isIntersecting ? sobre.add(e.target) : sobre.delete(e.target); setEscondido(sobre.size > 0) }, { rootMargin: `0px 0px -${Math.max(0, innerHeight - 71)}px 0px` })
    document.querySelectorAll('.principito').forEach((el) => ioP.observe(el))
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); io.disconnect(); ioP.disconnect() }
  }, [pagina])

  // en una categoría, los links del inicio primero vuelven al inicio
  const ir = (id) => (e) => {
    e.preventDefault()
    if (pagina && id !== '#contacto') {
      inicio()
      if (id !== '#categorias') setTimeout(() => scrollTo(id), 450)
    } else scrollTo(id)
  }

  return (
    <header className="nav" data-on={on && !escondido} data-oscuro={oscuro}>
      {/* a la izquierda, dónde estás; al centro el nombre, que siempre vuelve al inicio */}
      <span className="nav__donde">{pagina ? catPorId[pagina].nombre : 'Diseño gráfico'}</span>
      <a className="nav__marca nav__marca--centro" href="#/" onClick={ir('#inicio')}>Abril Wisspi</a>
      <nav className="nav__links" aria-label="Secciones">
        <a href="#/" onClick={ir('#categorias')}>Proyectos</a>
        <a href="#/" onClick={ir('#sobre-mi')}>Sobre mí</a>
        <a href="#contacto" onClick={ir('#contacto')}>Contacto</a>
      </nav>
    </header>
  )
}
