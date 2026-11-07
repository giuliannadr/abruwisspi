import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { site, img } from '../data/site'
import { MESA, piezasMesa } from '../data/mesa'
import { proyectos } from '../data/proyectos'
import { reduce, scrollTo } from '../lib/motion'

// Portada tipo revista: las piezas de Abril en una mesa que sigue al mouse,
// "ABRIL" detrás de ella, ella recortada en semitono (cherry + rosa flúo corrido, como un riso)
// y "WISSPI" adelante, en bordó.
export default function Hero() {
  const ref = useRef(null)
  const mesa = useRef(null)

  // La mesa acompaña al mouse; cada pieza tiene su profundidad. En táctil se mueve sola, despacio.
  useEffect(() => {
    const el = mesa.current, hero = ref.current
    if (!el || !hero) return
    const figs = [...el.children].map((f, i) => ({ f, d: 0.75 + ((i * 37) % 10) / 20 }))
    const fino = matchMedia('(pointer: fine)').matches
    const quieto = reduce()
    let mx = 0.5, my = 0.5, x = 0.5, y = 0.5, t = 0, raf, visible = true
    const mover = (e) => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(hero)
    addEventListener('pointermove', mover, { passive: true })
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      if (!fino && !quieto) { t += 0.0022; mx = 0.5 + Math.sin(t) * 0.38; my = 0.5 + Math.cos(t * 0.8) * 0.32 }
      const k = quieto ? 1 : 0.06
      x += (mx - x) * k; y += (my - y) * k
      const esc = innerWidth < 760 ? 0.48 : 1
      const bx = -(MESA.w * esc - innerWidth) * x, by = -(MESA.h * esc - hero.clientHeight) * y
      el.style.transform = `translate3d(${bx}px, ${by}px, 0) scale(${esc})`
      const ox = (x - 0.5) * 120, oy = (y - 0.5) * 80
      for (const { f, d } of figs) f.style.translate = `${-ox * (d - 1) * 2}px ${-oy * (d - 1) * 2}px`
    }
    loop()
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', mover); io.disconnect() }
  }, [])

  // Entrada: el nombre sube desde su línea, ella aparece y las piezas caen sobre la mesa.
  useLayoutEffect(() => {
    if (reduce()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.portada__linea > span', { yPercent: 100, duration: 1.2, stagger: 0.12 })
        .from('.portada__abril', { y: 60, opacity: 0, duration: 1.3 }, 0.1)
        .from('.portada__abril-fluo', { x: 0, y: 0, duration: 1.4, ease: 'power3.out' }, 0.5)
        .from('.portada__pieza', { opacity: 0, scale: 0.9, duration: 0.9, stagger: { each: 0.04, from: 'random' } }, 0.2)
        .from('.portada__bajada', { opacity: 0, y: 12, duration: 0.7, stagger: 0.08 }, 0.7)
      gsap.to('.portada__abril', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="portada" id="inicio" ref={ref}>
      <div className="portada__fondo" aria-hidden="true">
      <div className="portada__mesa" ref={mesa}>
        {piezasMesa.map(([src, t, w, x, y, r]) => (
          <figure className="portada__pieza" key={src} style={{ left: x, top: y, width: w, rotate: `${r}deg` }}>
            <img src={img(src, 'sm')} alt="" draggable="false" loading="eager" />
            <figcaption>{t}</figcaption>
          </figure>
        ))}
      </div>
      </div>

      <h1 className="portada__nombre">
        <span className="portada__linea portada__linea--a"><span>{site.nombre}</span></span>
        <span className="portada__linea portada__linea--b"><span>{site.apellido}</span></span>
      </h1>

      <div className="portada__abril" aria-hidden="true">
        <div className="portada__abril-papel" />
        <div className="portada__abril-fluo" />
        <div className="portada__abril-tinta" />
      </div>

      <p className="portada__rol">{site.rol}</p>
      <p className="portada__bajada portada__bajada--izq">
        <a href="#proyectos" onClick={(e) => { e.preventDefault(); scrollTo('#proyectos') }}><b>({proyectos.length})</b> proyectos</a><span className="portada__resto">: afiches, packaging, folletos y discos</span>
      </p>
      <p className="portada__bajada portada__bajada--der">{site.rol}. Fotografía de retrato, producto y repostería</p>
      <span className="portada__pista">Mové el mouse</span>
    </section>
  )
}
