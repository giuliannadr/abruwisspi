import { useEffect, useRef } from 'react'
import { site } from '../data/site'
import { reduce } from '../lib/motion'

// Contratapa: Abril sentada en el borde de la página, impresa en semitono como la portada.
// La tinta rosa se corre un poco con el mouse, como un riso fuera de registro.
// PENDIENTE: completar mail, Instagram, Behance y CV en src/data/site.js. La bajada es propuesta.
const anio = new Date().getFullYear()

export default function Cierre() {
  const fluo = useRef(null)

  useEffect(() => {
    const el = fluo.current
    if (!el || reduce() || !matchMedia('(pointer: fine)').matches) return
    let tx = 10, ty = -6, x = tx, y = ty, raf
    const mover = (e) => {
      const r = el.parentElement.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 18
      ty = ((e.clientY - r.top) / r.height - 0.5) * 12
    }
    const loop = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      el.style.transform = `translate(${x}px, ${y}px)`
      raf = requestAnimationFrame(loop)
    }
    addEventListener('pointermove', mover, { passive: true })
    loop()
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', mover)
    }
  }, [])

  const links = [
    { nombre: 'Instagram', href: site.instagram },
    { nombre: 'Mail', href: site.mail && `mailto:${site.mail}` },
    { nombre: 'Behance', href: site.behance },
    { nombre: 'CV en PDF', href: site.cv },
  ]

  return (
    <footer className="cierre" id="contacto">
      <div className="cierre__texto">
        <h2 className="cierre__invita" data-titulo><span>¿Hablamos?</span></h2>
        <p className="cierre__bajada" data-reveal style={{ '--i': 1 }}>
          Para proyectos o para charlar de diseño.
        </p>
        <ul className="cierre__links">
          {links.map((l, i) => (
            <li key={l.nombre} data-reveal style={{ '--i': i + 2 }}>
              <a href={l.href || '#contacto'} target={l.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <span>{l.nombre}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>
              </a>
            </li>
          ))}
        </ul>
        <div className="cierre__legal">
          <span>{site.nombre} {site.apellido}, {anio}</span>
          <span>Diseño gráfico y fotografía</span>
        </div>
      </div>
      <div className="cierre__abril" aria-hidden="true" data-entra="sube">
        <img className="cierre__abril-base" src="/tex/abril-cierre.png" width="785" height="1333" alt="" loading="lazy" decoding="async" />
        <div className="cierre__abril-fluo" ref={fluo} />
      </div>
    </footer>
  )
}
