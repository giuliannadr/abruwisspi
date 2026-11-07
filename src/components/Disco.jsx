import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap } from 'gsap'
import { porId } from '../data/proyectos'
import { img } from '../data/site'
import { reduce } from '../lib/motion'

// Discos: la tapa en un cuadro y un aro encima que la convierte en disco.
// El disco gira con el scroll.
const discos = [
  { id: 'tinta90', tab: 'CD', src: 'tinta90', pos: '50% 50%' },
  { id: 'trago', tab: 'Vinilo', src: 'vinilo-tapa', pos: '100% 50%' },
]

export default function Disco({ abrir }) {
  const [sel, setSel] = useState(0)
  const ref = useRef(null)
  const d = discos[sel]
  const p = porId[d.id]
  const otro = discos[(sel + 1) % discos.length]

  useLayoutEffect(() => {
    if (reduce()) return
    const ctx = gsap.context(() => {
      // El disco sale de la funda y gira mientras la sección cruza la pantalla.
      gsap.fromTo('.disco__vinilo', { xPercent: 0, rotate: 0 }, {
        xPercent: () => (window.innerWidth < 860 ? 30 : 46),
        rotate: 300,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'center 40%', scrub: 0.6, invalidateOnRefresh: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="disco" ref={ref} aria-labelledby="disco-h" data-oscuro>
      <div className="disco__placa">
        <div className="disco__funda-wrap" data-reveal>
          <div className="disco__vinilo" aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="49.5" fill="#160207" />
              {[46, 42, 38.5, 35, 31.5, 28, 25].map((r) => (
                <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#3a0a16" strokeWidth="0.35" />
              ))}
            </svg>
            <img className="disco__etiqueta" src={img(d.src, 'sm')} style={{ objectPosition: d.pos }} alt="" />
          </div>
          <div className="disco__cuadro">
            <AnimatePresence initial={false}>
              <motion.img
                key={d.src}
                src={img(d.src, 'sm')}
                srcSet={`${img(d.src, 'sm')} 1000w, ${img(d.src)} 2000w`}
                sizes="(max-width: 860px) 92vw, 46vw"
                alt={p.piezas[0].alt}
                data-pieza={d.id}
                style={{ objectPosition: d.pos }}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="disco__info">
        <div className="tabs" role="tablist" aria-label="Discos" data-reveal>
          {discos.map((x, i) => (
            <button key={x.id} className="tab" role="tab" aria-selected={i === sel} onClick={() => setSel(i)}>
              {i === sel && <motion.span layoutId="disco-tab" className="tab__bg" transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }} />}
              <span>{x.tab}</span>
            </button>
          ))}
        </div>
        <div data-reveal style={{ '--i': 1 }}>
          <h2 className="sr-only" id="disco-h">Discos</h2>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <h3 className="disco__titulo">{p.titulo}</h3>
              <p className="disco__desc">{p.texto}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="disco__celdas" data-reveal style={{ '--i': 2 }}>
          <button onClick={(e) => abrir(d.id, e.currentTarget.closest('.disco').querySelector('[data-pieza]'))}>Ver el proyecto</button>
          <button onClick={() => setSel((sel + 1) % discos.length)}>Ver el {otro.tab.toLowerCase()}</button>
        </div>
      </div>
    </section>
  )
}
