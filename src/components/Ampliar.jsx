import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { reduce } from '../lib/motion'

// Ver en grande cualquier imagen o video de los proyectos (pedido de Giuli, 2026-11-23).
// <Ampliable> envuelve la pieza en un botón (las imágenes no reciben el mouse: así Chrome no pone su
// botón de Gemini encima) y al tocarla avisa al <Ampliador>, que está una sola vez en App.
// La pieza viaja desde donde estaba (View Transitions, nombre propio "ampliada" para no chocar con
// el de la vista de proyecto). Se cierra tocando, con "Cerrar" o con Escape; el foco vuelve a la pieza.
const EVENTO = 'ampliar'

export function Ampliable({ src, w, h, alt = '', video = false, className = '', style, children }) {
  return (
    <button
      type="button"
      className={`ampliable ${className}`}
      style={style}
      aria-label={alt ? `Ver en grande: ${alt}` : 'Ver en grande'}
      onClick={(e) => {
        const el = e.currentTarget.querySelector('img, video, .signo') ?? e.currentTarget
        dispatchEvent(new CustomEvent(EVENTO, { detail: { src, w, h, alt, video, el, boton: e.currentTarget } }))
      }}
    >
      {children}
    </button>
  )
}

// cambio de estado con la pieza viajando (si el navegador puede)
function viajar(desde, hasta, cambiar) {
  if (!document.startViewTransition || reduce()) {
    cambiar()
    return
  }
  // si la pieza ya tenía nombre (la primera de la vista de proyecto usa "pieza"), se le devuelve
  const previo = desde?.style.viewTransitionName ?? ''
  if (desde) desde.style.viewTransitionName = 'ampliada'
  const vt = document.startViewTransition(() => {
    if (desde) desde.style.viewTransitionName = previo
    flushSync(cambiar)
    const d = hasta?.()
    if (d) d.style.viewTransitionName = 'ampliada'
  })
  vt.finished.catch(() => {}).finally(() => {
    const d = hasta?.()
    if (d && d.style.viewTransitionName === 'ampliada') d.style.viewTransitionName = d.dataset.vtNombre ?? ''
  })
  vt.ready.catch(() => {})
}

export default function Ampliador() {
  const [pieza, setPieza] = useState(null)
  const caja = useRef(null)

  useEffect(() => {
    const abrir = (e) => {
      const d = e.detail
      viajar(d.el, () => caja.current?.querySelector('img, video'), () => setPieza(d))
    }
    addEventListener(EVENTO, abrir)
    return () => removeEventListener(EVENTO, abrir)
  }, [])

  const cerrar = () => {
    if (!pieza) return
    const { el, boton } = pieza
    viajar(caja.current?.querySelector('img, video'), () => el, () => setPieza(null))
    boton?.focus({ preventScroll: true })
  }

  useEffect(() => {
    if (!pieza) return
    const key = (e) => e.key === 'Escape' && cerrar()
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  })

  if (!pieza) return null
  return (
    <div className="ampliador" role="dialog" aria-modal="true" aria-label={pieza.alt || 'Pieza en grande'} data-lenis-prevent ref={caja} onClick={(e) => e.target === e.currentTarget && cerrar()}>
      {pieza.video ? (
        <video src={pieza.src} controls autoPlay playsInline loop width={pieza.w} height={pieza.h} aria-label={pieza.alt} />
      ) : (
        <img src={pieza.src} width={pieza.w} height={pieza.h} alt={pieza.alt} />
      )}
      <button className="ampliador__cerrar" onClick={cerrar} autoFocus>Cerrar</button>
    </div>
  )
}
