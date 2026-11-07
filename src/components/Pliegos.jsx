import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { destacados, porId } from '../data/proyectos'
import { img } from '../data/site'
import { reduce } from '../lib/motion'

// Destacados como pliegos de revista (la presentación de Aloha como referencia):
// la pieza a sangre de un lado; del otro, el título condensado, un detalle recortado
// y texto chico alineado a la derecha. Los lados se alternan.
const lista = destacados.map((id) => porId[id])

export default function Pliegos({ abrir }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (reduce()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.pliego').forEach((el) => {
        // la pieza grande se desplaza un poco más lento que la página
        gsap.fromTo(el.querySelector('.pliego__grande img'), { yPercent: 4 }, {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        // el detalle entra recortándose desde abajo
        gsap.from(el.querySelector('.pliego__detalle'), {
          clipPath: 'inset(100% 0 0 0)',
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 65%' },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="pliegos" id="proyectos" ref={ref} aria-labelledby="pliegos-h">
      <header className="pliegos__cabeza">
        <h2 className="pliegos__h" id="pliegos-h" data-reveal>Proyectos</h2>
        <p className="pliegos__bajada" data-reveal style={{ '--i': 1 }}>
          <b>({lista.length})</b> afiches, folletos, gráfica de gira, retícula y un vinilo. Tocá cualquiera para verlo entero.
        </p>
      </header>
      {lista.map((p, i) => {
        const grande = p.piezas[0]
        const det = p.piezas[1] ?? p.piezas[0]
        return (
          <article className="pliego" key={p.id} data-lado={i % 2 ? 'der' : 'izq'} style={{ '--fondo': p.fondo, '--tinta': p.tinta }}>
            <button className="pliego__grande" onClick={(e) => abrir(p.id, e.currentTarget.querySelector('img'))} aria-label={`Ver ${p.titulo}`}>
              <img src={img(grande.src, 'sm')} srcSet={`${img(grande.src, 'sm')} 900w, ${img(grande.src)} 1800w`} sizes="(max-width: 860px) 100vw, 50vw" alt={grande.alt} loading="lazy" data-pieza={p.id} />
            </button>
            <div className="pliego__panel">
              <h3 className="pliego__titulo" data-reveal style={{ '--i': 1, fontSize: p.titulo.length > 12 ? 'clamp(52px, 5.6vw, 104px)' : undefined }}>{p.titulo}</h3>
              <figure className="pliego__detalle">
                <img src={img(det.src, 'sm')} alt={det.alt} loading="lazy" style={det === grande ? { objectPosition: '60% 35%', scale: '1.6' } : undefined} />
              </figure>
              <div className="pliego__pie" data-reveal style={{ '--i': 2 }}>
                <p className="pliego__disc">{p.disciplina}</p>
                <p className="pliego__texto">{p.texto}</p>
                <button className="pliego__ver" onClick={(e) => abrir(p.id, e.currentTarget.closest('.pliego').querySelector('[data-pieza]'))}>
                  Ver proyecto
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}
