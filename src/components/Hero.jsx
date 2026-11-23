import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { site } from '../data/site'
import { reduce } from '../lib/motion'

// Portada tipo revista, limpia (pedido de Abril, 2026-11-22: solo nombre y foto):
// "ABRIL" detrás de ella, ella recortada en semitono (cherry + rosa flúo corrido, como un riso),
// "WISSPI" adelante en bordó y sus dos disciplinas abajo.
// (2026-11-23 se probaron versiones con grosores, garabatos a mano y lupa; Giuli eligió esta.)
export default function Hero() {
  const ref = useRef(null)

  // Entrada: el nombre sube desde su línea y ella aparece.
  useLayoutEffect(() => {
    if (reduce()) return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.portada__linea > span', { yPercent: 100, duration: 1.2, stagger: 0.12 })
        .from('.portada__foto', { y: 60, opacity: 0, duration: 1.3 }, 0.1)
        .from('.portada__bajada', { opacity: 0, y: 12, duration: 0.7, stagger: 0.08 }, 0.7)
      gsap.to('.portada__foto', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="portada" id="inicio" ref={ref}>
      <h1 className="portada__nombre" aria-label={`${site.nombre} ${site.apellido}`}>
        <span className="portada__linea portada__linea--a" aria-hidden="true"><span>{site.nombre}</span></span>
        <span className="portada__linea portada__linea--b" aria-hidden="true"><span>{site.apellido}</span></span>
      </h1>

      {/* Abril ya "impresa": papel, foto teñida y dos tintas en una sola imagen (ver public/tex) */}
      <div className="portada__foto">
        <img className="portada__abril" src="/tex/abril-portada.png" width="691" height="1088" alt="" aria-hidden="true" fetchPriority="high" decoding="async" />
      </div>

      <p className="portada__bajada portada__bajada--izq">{site.disciplinas[0]}</p>
      <p className="portada__bajada portada__bajada--der">{site.disciplinas[1]}</p>
    </section>
  )
}
