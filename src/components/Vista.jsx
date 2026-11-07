import { useEffect, useRef } from 'react'
import { proyectos, temaDe } from '../data/proyectos'
import { img } from '../data/site'

// Vista de un proyecto: su color, su texto y todas las piezas.
// La primera pieza recibe la imagen que se tocó (view-transition-name: pieza).
export default function Vista({ p, cerrar, abrir }) {
  const ref = useRef(null)
  const i = proyectos.findIndex((x) => x.id === p.id)
  const sig = proyectos[(i + 1) % proyectos.length]

  useEffect(() => {
    ref.current?.scrollTo(0, 0)
    ref.current?.querySelector('.vista__volver')?.focus({ preventScroll: true })
    const key = (e) => e.key === 'Escape' && cerrar()
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [p.id, cerrar])

  return (
    <div className="vista" ref={ref} role="dialog" aria-modal="true" aria-labelledby="vista-h" data-lenis-prevent style={{ '--tinta': temaDe(p.id).tinta, '--fondo': temaDe(p.id).fondo }}>
      <div className="vista__barra">
        <button className="vista__volver" onClick={cerrar}>Volver</button>
      </div>
      <header className="vista__cabeza">
        <h2 className="vista__h" id="vista-h">{p.titulo}</h2>
        <div>
          <p className="vista__disc">{p.disciplina}</p>
          <p className="vista__texto">{p.texto}</p>
        </div>
      </header>
      <div className="vista__piezas">
        {p.piezas.map((f, k) => (
          <img
            key={f.src}
            src={img(f.src)}
            srcSet={`${img(f.src, 'sm')} 900w, ${img(f.src)} ${f.w}w`}
            sizes="(max-width: 760px) 100vw, 90vw"
            width={f.w}
            height={f.h}
            alt={f.alt}
            loading={k === 0 ? 'eager' : 'lazy'}
            style={k === 0 ? { viewTransitionName: 'pieza' } : undefined}
            data-vt-fijo={k === 0 ? '' : undefined}
          />
        ))}
      </div>
      <button className="vista__siguiente" onClick={() => abrir(sig.id, null)}>
        <small>Siguiente proyecto</small>
        <strong>{sig.titulo}</strong>
      </button>
    </div>
  )
}
