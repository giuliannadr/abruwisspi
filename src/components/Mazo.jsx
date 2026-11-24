import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mazos } from '../data/mazos'
import { porId } from '../data/proyectos'
import { img } from '../data/site'
import { reduce } from '../lib/motion'
import Caja from './Caja'

gsap.registerPlugin(ScrollTrigger)

// Un mazo con caja 3D (El Principito o el Tarot, ver data/mazos.js): la caja y las cartas en el centro, a todo el ancho; alrededor, en las esquinas,
// el título (arriba a la izquierda), los botones chicos (arriba a la derecha) y el texto abajo, a lo ancho,
// todos alineados con los bordes de la composición (--borde, lo calcula el scroll).
// El objeto es UNA sola pieza: la caja arranca grande en el centro, al bajar se corre a su lugar,
// la tapa se abre y las cartas salen por la boca
// (lo que sigue adentro queda recortado en el borde del frente) y se sirven en fila: en compu a la izquierda
// de la caja, en celu arriba. Grandes, sin tocarse entre ellas ni tocar la caja, sin salir de su columna. Al final: tocar una carta la da vuelta, arrastrarla y soltarla la devuelve
// a su lugar, y la caja se gira arrastrando.
// La animación queda fija en pantalla mientras se baja (en compu la sección; en celu la caja con las cartas)
// y al final hay una pausa con las cartas afuera.
const lerp = (a, b, t) => a + (b - a) * t
const tramo = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)))
const salir = (t) => 1 - Math.pow(1 - t, 3)
const ida = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export default function Mazo({ id = 'principito', abrir }) {
  const p = porId[id]
  const { cartas, ...caja3d } = mazos[id]
  const n = cartas.length
  const sec = useRef(null), escena = useRef(null), caja = useRef(null)
  const salidas = useRef([])
  const repintar = useRef(() => {})
  const [vueltas, setVueltas] = useState({})
  const [fase, setFase] = useState('cerrada') // cerrada → saliendo → lista
  const quieto = useReducedMotion()

  const darVuelta = (id) => setVueltas((v) => ({ ...v, [id]: !v[id] }))
  const todas = () => setVueltas((v) => {
    const alguna = cartas.some((c) => !v[c.id])
    return Object.fromEntries(cartas.map((c) => [c.id, alguna]))
  })

  useLayoutEffect(() => {
    const esc = escena.current
    const frente = caja.current.querySelector('.caja__cara--frente')
    const tapa = caja.current.querySelector('.caja__tapa')
    const wrap = esc.querySelector('.principito__caja')
    // Rendimiento (2026-11-23, en celu se trababa): las medidas se toman cuando cambia el tamaño, no en
    // cada cuadro; la boca de la caja se mide una vez y se guarda; la tapa recibe su variable directo
    // (en el contenedor la heredaban las seis caras y las cartas); React solo se entera si cambia la etapa.
    let med = null, boca = null, faseAct = null
    const medir = () => {
      const e = esc.getBoundingClientRect()
      const celu = e.width < 600
      const cw = salidas.current[0].offsetWidth, ch = salidas.current[0].offsetHeight
      const bw = caja.current.querySelector('.caja__escena').offsetWidth
      const bh = caja.current.querySelector('.caja__escena').offsetHeight
      const gap = celu ? 0 : Math.min(40, e.width * 0.025)
      const total = n * cw + (n - 1) * gap + gap * 1.6 + bw
      const izq = (e.width - total) / 2
      const bajar = celu ? 0 : Math.min(48, e.height * 0.05) // en compu el grupo va un poco más abajo: la carta que sale no toca los botones
      med = {
        W: e.width, H: e.height, celu, cw, ch, bw, bh, gap, izq, bajar,
        finX: celu ? 0 : izq + n * cw + (n - 1) * gap + gap * 1.6 + bw / 2 - e.width / 2,
        finY: celu ? e.height - 96 - bh / 2 - e.height / 2 : bajar,
      }
      // los textos de las esquinas se alinean con los bordes de la composición (cartas + caja)
      if (!celu) sec.current.style.setProperty('--borde', `${Math.max(0, izq)}px`)
      boca = null
    }
    const medirBoca = () => {
      const e = esc.getBoundingClientRect()
      const f = frente.getBoundingClientRect() // el frente ya girado: su borde de arriba es la boca
      boca = { x: f.left + f.width / 2 - e.left, y: f.top - e.top + 2, izq: f.left - e.left, ancho: f.width }
    }
    // el recorrido: la animación ocupa el 70 % y el resto es una pausa con las cartas ya afuera,
    // para verlas y darlas vuelta antes de pasar a la sección siguiente
    const FIN = 0.7
    const pintar = (prog) => {
      if (!med) medir()
      const { celu, cw, ch, gap, izq, bajar, finX, finY, W, H, bh } = med
      const t = Math.min(1, prog / FIN)
      // 1) la caja arranca grande en el centro y se desliza a su lugar
      const m = ida(tramo(t, 0.08, 0.3))
      wrap.style.transform = `translate3d(${finX * m}px, ${finY * m}px, 0) scale(${lerp(1.3, 1, m)})`
      // 2) se abre la tapa
      tapa.style.setProperty('--tapa', salir(tramo(t, 0.28, 0.38)).toFixed(3))
      // 3) las cartas salen por la boca y van a su lugar (recién cuando la caja ya llegó: la boca no se mueve)
      if (t >= 0.3 && !boca) medirBoca()
      const k0 = boca ?? { x: W / 2, y: H / 2, izq: W / 2, ancho: cw }
      const s0 = Math.min(1, (k0.ancho * 0.84) / cw)
      let filas, giros
      if (celu) {
        // celu: la caja abajo al centro; las cartas en fila arriba de la tapa, un poco montadas como una mano
        const y = k0.y - 56 - ch / 2
        const paso = Math.min(cw * 0.78, (W - cw - 44) / Math.max(1, n - 1)) // deja margen a los costados (las cartas se inclinan)
        filas = cartas.map((_, i) => { const k = i - (n - 1) / 2; return { x: W / 2 + k * paso, y: y + Math.abs(k) * 10 } })
        giros = cartas.map((_, i) => (i - (n - 1) / 2) * 6)
      } else {
        // compu: la fila a la izquierda de la caja, apoyadas en la misma línea que ella
        const base = H / 2 + bh / 2 + bajar
        filas = cartas.map((_, i) => ({ x: izq + cw / 2 + i * (cw + gap), y: base - ch / 2 }))
        giros = cartas.map((_, i) => [-3, 2, -1.5, 2.5][i % 4])
      }
      salidas.current.forEach((el, i) => {
        const a = 0.36 + i * (0.35 / Math.max(1, n - 1)) // las cartas salen de a una
        const sube = salir(tramo(t, a, a + 0.1)) // sale derecha por la boca
        const va = ida(tramo(t, a + 0.1, a + 0.24)) // va a su lugar
        const yAdentro = k0.y + (ch * s0) / 2
        const yAfuera = k0.y - ch * s0 * 0.08 // sale un poco más de la mitad
        const fin = filas[i]
        const x = lerp(k0.x, fin.x, va)
        const y = lerp(lerp(yAdentro, yAfuera, sube), fin.y, va)
        const s = lerp(s0, 1, va)
        const r = lerp(0, giros[i], va)
        // mientras la carta siga delante de la caja, lo que está por debajo de la boca no se ve
        const encima = x + (cw * s) / 2 > k0.izq
        const abajo = encima ? Math.max(0, (y + (ch * s) / 2 - k0.y) / s) : 0
        el.style.transform = `translate3d(${x - cw / 2}px, ${y - ch / 2}px, 0) rotate(${r}deg) scale(${s})`
        const clip = abajo > 0 ? `inset(-40px -40px ${abajo.toFixed(1)}px -40px)` : 'none'
        if (el.dataset.clip !== clip) { el.style.clipPath = clip; el.dataset.clip = clip }
        const vis = sube > 0 ? 'visible' : 'hidden'
        if (el.style.visibility !== vis) el.style.visibility = vis
      })
      const f = t < 0.26 ? 'cerrada' : t < 0.95 ? 'saliendo' : 'lista'
      if (f !== faseAct) { faseAct = f; setFase(f) }
    }

    if (reduce()) {
      const r = () => { med = null; pintar(1) }
      repintar.current = r
      r()
      addEventListener('resize', r)
      return () => removeEventListener('resize', r)
    }
    // un "progreso" que sigue al scroll con un poco de suavizado (en celu el dedo mueve la página a saltitos)
    const prox = { p: 0 }
    const mm = gsap.matchMedia()
    const armar = (trigger, start, end) => {
      const tw = gsap.to(prox, {
        p: 1,
        ease: 'none',
        onUpdate: () => pintar(prox.p),
        scrollTrigger: { trigger, start, end, pin: true, pinSpacing: true, scrub: 0.6, // pinSpacing explícito: en celu el padre es flex y por defecto no reserva el lugar
          onRefresh: () => { med = null; pintar(prox.p) } },
      })
      return () => tw.scrollTrigger?.kill() || tw.kill()
    }
    // compu: queda fija la sección entera; celu: queda fija la caja con las cartas (el texto pasa antes)
    mm.add('(min-width: 861px)', () => armar(sec.current, 'top top', '+=220%'))
    mm.add('(max-width: 860px)', () => armar(esc, 'center center', '+=230%'))
    // mientras la caja se acomoda de frente, la boca se vuelve a medir
    repintar.current = () => { boca = null; pintar(prox.p) }
    return () => mm.revert()
  }, [])

  // la caja tarda un poco en ponerse de frente (o en soltarse): se repinta unos cuadros para seguir la boca
  useEffect(() => {
    let raf = 0, n = 0
    const seguir = () => { repintar.current(); if (++n < 45) raf = requestAnimationFrame(seguir) }
    raf = requestAnimationFrame(seguir)
    return () => cancelAnimationFrame(raf)
  }, [fase])

  return (
    <section className={`principito principito--${id}`} id={`mazo-${id}`} aria-labelledby={`mazo-${id}-h`} ref={sec} data-fase={fase} style={{ '--car': cartas[0].w / cartas[0].h }}>
      {/* en las esquinas (compu) o en este orden (celu): título, caja con cartas, pista, texto, botones */}
      <header className="principito__esquina principito__esquina--titulo">
        <p className="principito__disc">{p.disciplina}</p>
        <h2 className="principito__titulo" id={`mazo-${id}-h`}>{p.titulo}</h2>
      </header>
      <div className="principito__objeto" ref={escena}>
        <div className="principito__caja">
          <Caja frente={fase === 'saliendo'} sinGiroSolo={fase === 'lista'} cajaRef={caja} {...caja3d} />
        </div>

        {cartas.map((c, i) => (
          <div key={c.id} className="principito__salida" ref={(el) => (salidas.current[i] = el)} style={{ zIndex: 10 + i }}>
            <motion.div
              className="carta"
              data-flip={!!vueltas[c.id]}
              drag={fase === 'lista'}
              dragSnapToOrigin
              dragElastic={0.5}
              dragTransition={{ bounceStiffness: 420, bounceDamping: 26 }}
              whileDrag={{ scale: 1.06, zIndex: 30 }}
              transition={quieto ? { duration: 0 } : undefined}
              onTap={() => fase === 'lista' && darVuelta(c.id)}
              role="button"
              tabIndex={fase === 'lista' ? 0 : -1}
              aria-label={`${c.nombre}${vueltas[c.id] ? ', de dorso' : ''}. Tocá para darla vuelta.`}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), darVuelta(c.id))}
            >
              <div className="carta__cuerpo">
                <div className="carta__cara">
                  <img src={img(c.frente, 'sm')} srcSet={`${img(c.frente, 'sm')} 600w, ${img(c.frente)} ${c.w}w`} sizes="240px" width={c.w} height={c.h} alt="" draggable="false" loading="lazy" data-pieza={i === 0 ? id : undefined} />
                </div>
                <div className="carta__cara carta__cara--dorso">
                  <img src={img(c.dorso, 'sm')} width={c.w} height={c.h} alt="" draggable="false" loading="lazy" />
                </div>
              </div>
            </motion.div>
          </div>
        ))}

      </div>

      <p className="principito__esquina principito__esquina--pista principito__pista" aria-live="polite">
        {fase === 'lista' ? 'Tocá una carta para darla vuelta' : 'Bajá para abrir la caja'}
      </p>
      <p className="principito__esquina principito__esquina--texto principito__desc">{p.texto}</p>
      <div className="principito__esquina principito__esquina--botones">
        <div className="disco__celdas">
          <button onClick={(e) => abrir(id, e.currentTarget)}>Ver el proyecto</button>
          <button onClick={todas} disabled={fase !== 'lista'}>Dar vuelta las cartas</button>
        </div>
      </div>
    </section>
  )
}
