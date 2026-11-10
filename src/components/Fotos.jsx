import { useCallback, useEffect, useRef, useState } from 'react'
import { series, reels } from '../data/fotos'
import { img } from '../data/site'
import { transicion, getLenis, reduce } from '../lib/motion'

// Fotografía separada en proyectos: cada serie con su título, su bajada y su tira.
// Al tocar una foto, viaja al visor (elemento compartido).

// Los reels no bajan nada hasta que están cerca (ni la imagen de portada) y solo se reproducen mientras se ven.
const vistos = new WeakSet()
function verEnPantalla(v) {
  if (!v || vistos.has(v)) return
  vistos.add(v)
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting) return
    v.poster = v.dataset.poster
    v.src = v.dataset.src
    io.disconnect()
  }, { rootMargin: '900px' }).observe(v)
  new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { rootMargin: '100px' }).observe(v)
}

function Tira({ s, abrir }) {
  const ref = useRef(null)
  const n = s.fotos.length
  // solo es infinita (y pasa sola) si las fotos no entran en la pantalla
  const [loop, setLoop] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const medir = () => {
      const ancho = loop ? el.scrollWidth / 2 : el.scrollWidth
      setLoop(ancho > el.clientWidth + 8)
    }
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    el.querySelectorAll('img').forEach((im) => im.addEventListener('load', medir, { once: true }))
    return () => ro.disconnect()
  }, [loop])

  // Pasa sola, despacio y en loop (las fotos van dos veces para que no se note el salto).
  // Solo se frena si la persona la mueve (arrastre o deslizar de costado) o si no se ve.
  useEffect(() => {
    const el = ref.current
    if (!el || !loop || reduce()) return
    let raf, visible = false, quieto = 0, resto = 0
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(el)
    const pausa = (ms) => { quieto = performance.now() + ms }
    const toque = () => pausa(1e9) // quieta mientras la tengan agarrada
    const suelta = () => { if (quieto > performance.now() + 5000) pausa(1500) }
    addEventListener('pointerup', suelta)
    addEventListener('pointercancel', suelta)
    // la rueda vertical (scrollear la página) no la frena; solo el gesto de costado
    const rueda = (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) pausa(1500) }
    el.addEventListener('pointerdown', toque)
    el.addEventListener('wheel', rueda, { passive: true })
    let last = performance.now()
    const avanzar = (t) => {
      raf = requestAnimationFrame(avanzar)
      const dt = Math.min(50, t - last); last = t
      if (!visible || t < quieto) return
      resto += dt * 0.045 // ≈ 45 px por segundo
      const px = Math.floor(resto); resto -= px
      if (!px) return
      el.scrollLeft += px
      const mitad = el.scrollWidth / 2
      if (el.scrollLeft >= mitad) el.scrollLeft -= mitad
    }
    raf = requestAnimationFrame(avanzar)
    return () => {
      cancelAnimationFrame(raf); io.disconnect()
      el.removeEventListener('pointerdown', toque); el.removeEventListener('wheel', rueda)
      removeEventListener('pointerup', suelta); removeEventListener('pointercancel', suelta)
    }
  }, [loop])

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

  // dos vueltas de la misma serie: la segunda es copia (oculta para lectores de pantalla)
  const vuelta = loop ? [...s.fotos, ...s.fotos] : s.fotos
  return (
    <div className="tira" ref={ref} data-loop={loop}>
      {vuelta.map((f, k) => {
        const i = k % n
        const copia = k >= n
        return (
          <button
            className="tira__cuadro"
            key={k}
            data-cortina={copia ? undefined : ''}
            style={{ '--i': Math.min(i, 5) }}
            tabIndex={copia ? -1 : 0}
            aria-hidden={copia || undefined}
            onClick={(e) => abrir(s, i, e.currentTarget.querySelector('img'))}
            aria-label={`${s.nombre}: ampliar foto ${i + 1} de ${n}`}
          >
            <img src={img(f.src, 'sm')} width={f.w} height={f.h} alt={copia ? '' : s.alt} loading="lazy" draggable="false" data-foto={copia ? undefined : f.src} />
          </button>
        )
      })}
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
        <h2 className="fotos__h" id="fotos-h" data-titulo><span>Fotografía</span></h2>
        <p className="fotos__cuenta" data-reveal style={{ '--i': 1 }}>
          ({series.length + 1}) series: books, estudio, producto, repostería y reels
        </p>
      </header>

      {series.map((s, k) => {
        const arriba = k === 0 ? 'claro' : series[k - 1].fondo
        return (
        <article
          className="serie"
          key={s.id}
          data-fondo={s.fondo}
          data-lado={k % 2 ? 'der' : 'izq'}
          data-costura={arriba !== s.fondo ? '' : undefined}
          style={{ '--arriba': `var(--${arriba})` }}
          aria-labelledby={`serie-${s.id}`}
        >
          <header className="serie__cabeza">
            <h3 className="serie__titulo" id={`serie-${s.id}`} data-titulo data-deriva={k % 2 ? 1 : -1}><span>{s.nombre}</span></h3>
            <p className="serie__bajada" data-reveal style={{ '--i': 1 }}>
              <b>({s.fotos.length})</b> {s.bajada}
            </p>
          </header>
          <Tira s={s} abrir={abrir} />
        </article>
        )
      })}

      <article className="serie serie--reels" data-fondo="bordo" data-costura="" style={{ '--arriba': `var(--${series.at(-1).fondo})` }} aria-labelledby="serie-reels">
        <header className="serie__cabeza">
          <h3 className="serie__titulo" id="serie-reels" data-titulo data-deriva="-1"><span>Reels</span></h3>
          <p className="serie__bajada" data-reveal style={{ '--i': 1 }}>
            <b>({reels.length})</b> Reels para una repostería, sin sonido.
          </p>
        </header>
        <div className="reels">
          {reels.map((r, i) => (
            <figure className="reel" key={r.id} data-reveal style={{ '--i': i }}>
              <video ref={verEnPantalla} data-src={`/video/${r.id}.mp4`} data-poster={`/video/${r.id}.jpg`} muted loop playsInline preload="metadata" width="540" height="960" aria-label={r.alt} />
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
