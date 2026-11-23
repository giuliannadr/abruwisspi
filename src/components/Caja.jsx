import { useEffect, useLayoutEffect, useRef } from 'react'
import { reduce } from '../lib/motion'

// La caja del mazo de El Principito, armada en 3D con las seis caras del troquel.
// Libre: se gira arrastrando (con inercia) y, quieta, da vueltas sola, despacio.
// `frente`: deja de girar y se acomoda de frente, un poco desde arriba (para verla abrirse).
// `sinGiroSolo`: no da vueltas sola (se gira solo arrastrando).
// La tapa se abre con la variable CSS --tapa (0 cerrada, 1 abierta) en .caja: la pone el mazo.
// PROVISORIA: Abril va a mandar el diseño final de la caja. Para cambiarla,
// reemplazar las seis imágenes de public/img/caja (mismos nombres y proporciones:
// frente y dorso 720 × 1020, costados 190 × 1020, tapa y base 720 × 190).
const caras = [
  { id: 'frente', alt: (n) => `Frente de la caja ${n}` },
  { id: 'dorso', alt: (n) => `Dorso de la caja ${n}` },
  { id: 'izq', alt: (n) => `Costado de la caja ${n}` },
  { id: 'der', alt: (n) => `Otro costado de la caja ${n}` },
  { id: 'base', alt: () => '' },
]

// `carpeta`: dónde están las seis caras (public/img/<carpeta>); `rh` y `rd`: alto y profundidad sobre el ancho.
export default function Caja({ frente = false, sinGiroSolo = false, onToque, cajaRef, carpeta = 'caja', rh = 1020 / 720, rd = 190 / 720, nombre = 'del mazo', dentro = '#23256a', boca = '#14163f' }) {
  const ref = useRef(null)
  const cuerpo = useRef(null)
  const modo = useRef({ frente, sinGiroSolo, onToque })
  modo.current = { frente, sinGiroSolo, onToque }
  const despertarRef = useRef(() => {})
  // el mazo mide la caja en su propio useLayoutEffect, que corre después de este
  useLayoutEffect(() => { if (cajaRef) cajaRef.current = ref.current }, [cajaRef])

  useEffect(() => {
    const el = ref.current, c = cuerpo.current
    if (!el || !c) return
    const quieto = reduce()
    let ry = -28, rx = -12, vy = 0, vx = 0
    let arrastrando = false, px = 0, py = 0, x0 = 0, ultimo = 0, quietoDesde = 0
    let raf = 0, visible = false

    const pintar = () => { c.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)` }
    const despertar = () => { if (!raf && visible) raf = requestAnimationFrame(loop) }
    despertarRef.current = despertar

    const loop = (t) => {
      raf = 0
      if (!visible) return
      if (modo.current.frente) {
        // de frente: a la vuelta entera más cercana, un poco de costado y desde arriba
        vy = vx = 0
        const meta = Math.round((ry + 16) / 360) * 360 - 16
        const k = quieto ? 1 : 0.12
        ry += (meta - ry) * k; rx += (-18 - rx) * k
        pintar()
        if (Math.abs(meta - ry) + Math.abs(-18 - rx) > 0.05) raf = requestAnimationFrame(loop)
        return
      }
      if (!arrastrando) {
        // inercia que se apaga y, pasado un rato sin tocarla, vuelve a girar sola
        vy *= 0.94; vx *= 0.9
        ry += vy; rx += vx
        if (!quieto && !modo.current.sinGiroSolo && t - quietoDesde > 1400) ry += 0.12
        rx += (-12 - rx) * 0.03 // vuelve de a poco a mirarse un poco desde arriba
      }
      rx = Math.max(-40, Math.min(30, rx))
      pintar()
      if ((!quieto && !modo.current.sinGiroSolo) || arrastrando || Math.abs(vy) + Math.abs(vx) > 0.01 || Math.abs(-12 - rx) > 0.05) raf = requestAnimationFrame(loop)
    }

    const bajar = (e) => {
      px = x0 = e.clientX; py = e.clientY
      if (modo.current.frente) return
      arrastrando = true; ultimo = performance.now(); vy = vx = 0
      el.setPointerCapture(e.pointerId)
      el.dataset.arrastrando = ''
      despertar()
    }
    const mover = (e) => {
      if (!arrastrando) return
      const dx = e.clientX - px, dy = e.clientY - py, ahora = performance.now()
      const dt = Math.max(16, ahora - ultimo)
      ry += dx * 0.45; rx -= dy * 0.3
      // velocidad para la inercia, con tope: un tirón fuerte da una vuelta, no diez
      vy = Math.max(-14, Math.min(14, (dx * 0.45 * 16) / dt)); vx = Math.max(-6, Math.min(6, (-dy * 0.3 * 16) / dt))
      px = e.clientX; py = e.clientY; ultimo = ahora
    }
    const soltar = (e) => {
      // un toque sin arrastre (menos de 6 px) avisa al mazo
      if (e.type === 'pointerup' && Math.abs(e.clientX - x0) < 6) modo.current.onToque?.()
      if (!arrastrando) return
      arrastrando = false; quietoDesde = performance.now()
      delete el.dataset.arrastrando
      despertar()
    }
    // con teclado: flechas para girarla
    const tecla = (e) => {
      if (modo.current.frente) return
      const d = { ArrowLeft: [0, -30], ArrowRight: [0, 30], ArrowUp: [12, 0], ArrowDown: [-12, 0] }[e.key]
      if (!d) return
      e.preventDefault()
      rx += d[0]; ry += d[1]; quietoDesde = performance.now(); pintar(); despertar()
    }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; despertar() })
    io.observe(el)
    el.addEventListener('pointerdown', bajar)
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerup', soltar)
    el.addEventListener('pointercancel', soltar)
    el.addEventListener('keydown', tecla)
    pintar()
    return () => {
      cancelAnimationFrame(raf); io.disconnect()
      el.removeEventListener('pointerdown', bajar)
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerup', soltar)
      el.removeEventListener('pointercancel', soltar)
      el.removeEventListener('keydown', tecla)
    }
  }, [cajaRef])

  // al pasar a "de frente" (o volver a libre) el bucle tiene que arrancar aunque esté dormido
  useEffect(() => { despertarRef.current() }, [frente])

  return (
    <figure className="caja" ref={ref} tabIndex={0} data-frente={frente || undefined} style={{ '--rh': rh, '--rd': rd, '--dentro': dentro, '--boca': boca }} aria-label={frente ? `Caja ${nombre} en 3D, abierta` : `Caja ${nombre} en 3D. Arrastrala o usá las flechas para girarla.`}>
      <div className="caja__escena">
        <div className="caja__cuerpo" ref={cuerpo}>
          {caras.map((f) => (
            <img key={f.id} className={`caja__cara caja__cara--${f.id}`} src={`/img/${carpeta}/${f.id}.webp`} alt={f.alt(nombre)} draggable="false" loading="lazy" decoding="async" />
          ))}
          {/* adentro: el fondo oscuro que se ve cuando la tapa se levanta */}
          <span className="caja__boca" aria-hidden="true" />
          {/* la tapa gira sobre el borde de atrás; por dentro es lisa */}
          <div className="caja__tapa" aria-hidden="true">
            <img className="caja__tapa-afuera" src={`/img/${carpeta}/tapa.webp`} alt="" draggable="false" loading="lazy" decoding="async" />
            <span className="caja__tapa-dentro" />
          </div>
        </div>
      </div>
      <span className="caja__sombra" aria-hidden="true" />
    </figure>
  )
}
