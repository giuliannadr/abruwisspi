import { useCallback, useEffect, useRef, useState } from 'react'
import { series, reels } from '../data/fotos'
import { img } from '../data/site'
import { transicion, getLenis } from '../lib/motion'

// Fotografía separada en proyectos: cada serie con su título, su bajada y su tira.
// Al tocar una foto, viaja al visor (elemento compartido).

// Reproduce el video solo mientras se ve (ahorra decodificar tres videos todo el tiempo).
const vistos = new WeakSet()
function verEnPantalla(v) {
  if (!v || vistos.has(v)) return
  vistos.add(v)
  new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { rootMargin: '100px' }).observe(v)
}

function Tira({ s, abrir }) {
  const ref = useRef(null)

  // Arrastrar la tira con el mouse (en táctil ya se desliza sola).
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia('(pointer: fine)').matches) return
    let x0 = 0, s0 = 0, abajo = false, movido = false
    const down = (e) => { abajo = true; movido = false; x0 = e.clientX; s0 = el.scrollLeft }
    const move = (e) => {
      if (!abajo) return
      const dx = e.clientX - x0
      if (Math.abs(dx) > 4) movido = true
      el.scrollLeft = s0 - dx
    }
    const up = () => { abajo = false }
    const click = (e) => { if (movido) { e.stopPropagation(); e.preventDefault() } }
    el.addEventListener('pointerdown', down)
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)
    el.addEventListener('click', click, true)
    return () => {
      el.removeEventListener('pointerdown', down)
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
      el.removeEventListener('click', click, true)
    }
  }, [])

  return (
    <div className="tira" ref={ref}>
      {s.fotos.map((f, i) => (
        <button className="tira__cuadro" key={f.src} data-reveal style={{ '--i': Math.min(i, 5) }} onClick={(e) => abrir(s, i, e.currentTarget.querySelector('img'))} aria-label={`${s.nombre}: ampliar foto ${i + 1} de ${s.fotos.length}`}>
          <img src={img(f.src, 'sm')} width={f.w} height={f.h} alt={s.alt} loading="lazy" draggable="false" data-foto={f.src} />
        </button>
      ))}
    </div>
  )
}

export default function Fotos() {
  const [abierta, setAbierta] = useState(null) // { s, i }

  const abrir = (s, i, el) => transicion(() => setAbierta({ s, i }), { from: el })
  const cerrar = useCallback(() => {
    const src = abierta && abierta.s.fotos[abierta.i].src
    transicion(() => setAbierta(null), { to: () => document.querySelector(`[data-foto="${src}"]`) })
  }, [abierta])
  const mover = useCallback((d) => setAbierta((a) => a && { ...a, i: (a.i + d + a.s.fotos.length) % a.s.fotos.length }), [])

  useEffect(() => {
    const l = getLenis()
    if (!abierta) { l?.start(); return }
    l?.stop()
    const key = (e) => {
      if (e.key === 'Escape') cerrar()
      if (e.key === 'ArrowRight') mover(1)
      if (e.key === 'ArrowLeft') mover(-1)
    }
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  }, [abierta, cerrar, mover])

  const actual = abierta && abierta.s.fotos[abierta.i]

  return (
    <section className="fotos" id="fotografia" aria-labelledby="fotos-h">
      <header className="fotos__portada">
        <h2 className="fotos__h" id="fotos-h" data-reveal>Fotografía</h2>
        <p className="fotos__cuenta" data-reveal style={{ '--i': 1 }}>
          ({series.length + 1}) series: books, estudio, producto, repostería y reels
        </p>
      </header>

      {series.map((s, k) => (
        <article className="serie" key={s.id} data-fondo={s.fondo} data-lado={k % 2 ? 'der' : 'izq'} aria-labelledby={`serie-${s.id}`}>
          <header className="serie__cabeza">
            <h3 className="serie__titulo" id={`serie-${s.id}`} data-reveal>{s.nombre}</h3>
            <p className="serie__bajada" data-reveal style={{ '--i': 1 }}>
              <b>({s.fotos.length})</b> {s.bajada}
            </p>
          </header>
          <Tira s={s} abrir={abrir} />
        </article>
      ))}

      <article className="serie serie--reels" data-fondo="bordo" aria-labelledby="serie-reels">
        <header className="serie__cabeza">
          <h3 className="serie__titulo" id="serie-reels" data-reveal>Reels</h3>
          <p className="serie__bajada" data-reveal style={{ '--i': 1 }}>
            <b>({reels.length})</b> Reels para una repostería, sin sonido.
          </p>
        </header>
        <div className="reels">
          {reels.map((r, i) => (
            <figure className="reel" key={r.id} data-reveal style={{ '--i': i }}>
              <video ref={verEnPantalla} src={`/video/${r.id}.mp4`} poster={`/video/${r.id}.jpg`} muted loop playsInline preload="metadata" width="540" height="960" aria-label={r.alt} />
              <figcaption>{r.titulo}</figcaption>
            </figure>
          ))}
        </div>
      </article>

      {actual && (
        <div className="visor" role="dialog" aria-modal="true" aria-label={`${abierta.s.nombre}, foto ampliada`} data-lenis-prevent onClick={(e) => e.target === e.currentTarget && cerrar()}>
          <img src={img(actual.src)} width={actual.w} height={actual.h} alt={abierta.s.alt} style={{ viewTransitionName: 'pieza' }} data-vt-fijo="" />
          <p className="visor__titulo">{abierta.s.nombre}</p>
          <button className="visor__btn visor__cerrar" onClick={cerrar} autoFocus>Cerrar</button>
          <button className="visor__btn visor__prev" onClick={() => mover(-1)}>Anterior</button>
          <span className="visor__cuenta">{abierta.i + 1} / {abierta.s.fotos.length}</span>
          <button className="visor__btn visor__next" onClick={() => mover(1)}>Siguiente</button>
        </div>
      )}
    </section>
  )
}
