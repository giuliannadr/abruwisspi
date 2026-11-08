import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue } from 'motion/react'
import { destacados, porId } from '../data/proyectos'
import { img } from '../data/site'
import { reduce } from '../lib/motion'

// Proyectos en un coverflow (patrón del "Coverflow Carousel" de 21st.dev, hecho a medida):
// la pieza del centro de frente y grande, las de los costados giradas en 3D y más oscuras.
// Se arrastra, se usa con flechas o teclado y avanza sola mientras nadie la toca.
const lista = destacados.map((id) => porId[id])
const N = lista.length
const envolver = (d) => ((((d + N / 2) % N) + N) % N) - N / 2 // distancia más corta en el loop

function Flecha({ dir }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={dir < 0 ? 'M15 5 8 12l7 7' : 'm9 5 7 7-7 7'} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
    </svg>
  )
}

export default function Carrusel({ abrir }) {
  const ref = useRef(null)
  const cartas = useRef([])
  const pos = useMotionValue(0)
  const [activo, setActivo] = useState(0)
  const [enVista, setEnVista] = useState(false)
  const tocando = useRef(false)
  const ultimoArrastre = useRef(0) // para que soltar después de arrastrar no cuente como clic

  // Pinta cada pieza según su distancia al centro (sin re-render de React por cuadro).
  useEffect(() => {
    const pintar = (p) => {
      const ancho = innerWidth
      const paso = ancho < 760 ? ancho * 0.56 : Math.min(ancho * 0.21, 330)
      cartas.current.forEach((el, i) => {
        if (!el) return
        const d = envolver(i - p)
        const a = Math.abs(d)
        const x = Math.sign(d) * (a < 1 ? a * paso : paso + (a - 1) * paso * 0.62)
        const ry = Math.max(-58, Math.min(58, -d * 42))
        const s = 1 - Math.min(a, 3) * 0.12
        el.style.transform = `translate3d(calc(-50% + ${x}px), -50%, ${-a * 140}px) rotateY(${ry}deg) scale(${s})`
        el.style.zIndex = String(100 - Math.round(a * 10))
        el.style.opacity = a > 2.6 ? '0' : '1'
        el.style.setProperty('--sombra', Math.min(a, 1.4) * 0.5)
        el.style.pointerEvents = a > 2.6 ? 'none' : 'auto'
      })
      const k = ((Math.round(p) % N) + N) % N
      setActivo((v) => (v === k ? v : k))
    }
    pintar(pos.get())
    const off = pos.on('change', pintar)
    const alCambiar = () => pintar(pos.get())
    addEventListener('resize', alCambiar)
    return () => { off(); removeEventListener('resize', alCambiar) }
  }, [pos])

  const ir = useCallback((destino) => {
    const p = pos.get()
    const objetivo = Math.round(p) + envolver(destino - p)
    if (reduce()) pos.set(objetivo)
    else animate(pos, objetivo, { type: 'spring', stiffness: 170, damping: 26 })
  }, [pos])
  const mover = useCallback((n, auto = false) => {
    if (!auto) ultimoArrastre.current = performance.now() - 300
    ir(Math.round(pos.get()) + n)
  }, [ir, pos])

  // Arrastre con mouse o dedo; al soltar, se acomoda según la velocidad.
  useEffect(() => {
    const el = ref.current?.querySelector('.carru__escena')
    if (!el) return
    let x0 = 0, p0 = 0, lastX = 0, lastT = 0, vel = 0, activoDrag = false, movido = false, id = null
    const paso = () => (innerWidth < 760 ? innerWidth * 0.56 : Math.min(innerWidth * 0.21, 330))
    const down = (e) => {
      if (e.button > 0) return
      activoDrag = true; movido = false; id = e.pointerId; tocando.current = true
      x0 = lastX = e.clientX; lastT = performance.now(); p0 = pos.get(); vel = 0
      pos.stop()
    }
    const move = (e) => {
      if (!activoDrag || e.pointerId !== id) return
      const dx = e.clientX - x0
      if (!movido && Math.abs(dx) > 6) { movido = true; el.setPointerCapture(id) }
      if (!movido) return
      const t = performance.now()
      vel = (e.clientX - lastX) / Math.max(1, t - lastT); lastX = e.clientX; lastT = t
      pos.set(p0 - dx / paso())
    }
    const up = () => {
      if (!activoDrag) return
      activoDrag = false
      tocando.current = false
      if (!movido) return
      ultimoArrastre.current = performance.now()
      // proyecta ~140 ms de inercia y no salta más de dos piezas
      const ahora = pos.get()
      const extra = Math.max(-2, Math.min(2, (-vel * 140) / paso()))
      animate(pos, Math.round(ahora + extra), { type: 'spring', stiffness: 170, damping: 26, velocity: (-vel * 1000) / paso() })
    }
    const click = (e) => { if (movido) { e.preventDefault(); e.stopPropagation() } }
    el.addEventListener('pointerdown', down)
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)
    addEventListener('pointercancel', up)
    el.addEventListener('click', click, true)
    return () => {
      el.removeEventListener('pointerdown', down)
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
      removeEventListener('pointercancel', up)
      el.removeEventListener('click', click, true)
    }
  }, [pos])

  // Avanza sola solo si se ve y nadie la está tocando.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.5 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!enVista || reduce()) return
    // avanza sola; solo espera si alguien la tocó hace menos de 4 s
    const t = setInterval(() => {
      if (!tocando.current && performance.now() - ultimoArrastre.current > 4000) mover(1, true)
    }, 4200)
    return () => clearInterval(t)
  }, [enVista, mover])

  const p = lista[activo]

  return (
    <section
      className="carru"
      id="proyectos"
      ref={ref}
      aria-roledescription="carrusel"
      aria-labelledby="carru-h"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); mover(1) }
        if (e.key === 'ArrowLeft') { e.preventDefault(); mover(-1) }
      }}
    >
      <header className="carru__cabeza">
        <h2 className="carru__h" id="carru-h" data-reveal>Proyectos</h2>
        <p className="carru__pista" data-reveal style={{ '--i': 1 }}>
          <b>({N})</b> Afiches, folletos, gráfica de gira, retícula y un vinilo. Arrastrá o usá las flechas.
        </p>
      </header>

      <div className="carru__escena">
        {lista.map((x, i) => {
          const f = x.piezas[0]
          const centro = i === activo
          return (
            <button
              key={x.id}
              ref={(el) => (cartas.current[i] = el)}
              className="carru__pieza"
              style={{ '--ar': f.w / f.h }}
              tabIndex={centro ? 0 : -1}
              aria-label={centro ? `Ver ${x.titulo}` : `Ir a ${x.titulo}`}
              aria-hidden={!centro}
              onClick={(e) => {
                if (performance.now() - ultimoArrastre.current < 350) return
                if (centro) abrir(x.id, e.currentTarget.querySelector('img'))
                else ir(i)
              }}
            >
              <img src={img(f.src, 'sm')} srcSet={`${img(f.src, 'sm')} 900w, ${img(f.src)} 1800w`} sizes="(max-width: 760px) 70vw, 30vw" alt={f.alt} loading="lazy" draggable="false" data-pieza={x.id} />
              <span className="carru__sombra" />
            </button>
          )
        })}
      </div>

      <div className="carru__pie">
        <div className="carru__info" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="carru__disc">{p.disciplina}</p>
              <h3 className="carru__titulo">{p.titulo}</h3>
              <p className="carru__texto">{p.texto}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="carru__controles">
          <span className="carru__cuenta">{activo + 1} de {N}</span>
          <button className="carru__flecha" onClick={() => mover(-1)} aria-label="Proyecto anterior"><Flecha dir={-1} /></button>
          <button className="carru__flecha" onClick={() => mover(1)} aria-label="Proyecto siguiente"><Flecha dir={1} /></button>
          <button className="btn btn--claro" onClick={() => abrir(p.id, cartas.current[activo]?.querySelector('img'))}>Ver proyecto</button>
        </div>
      </div>
    </section>
  )
}
