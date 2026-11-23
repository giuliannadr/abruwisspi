import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reduce } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

// Marca y papelería: Patagonia, el manual de identidad visual de Abril (PDF de 31 páginas, 116 MB).
// No se muestra el PDF: dos pantallas con la misma gramática que El Principito y el Tarot
// (un objeto grande al centro, los textos en las esquinas), en la paleta de la marca.
//   1. Del boceto a la marca: fija mientras se baja; al centro pasa del boceto a mano a los digitales,
//      a la grilla y a la marca (también en celu).
//   2. Aplicaciones: la maqueta en madera y la papelería apoyadas juntas.
// Las piezas salen del PDF (scratchpad patagonia.py): la marca y los bocetos en PNG transparente,
// usados como máscara CSS para pintarlos con la paleta.
const P = (n) => `/img/patagonia/${n}`
const paleta = [
  { hex: '#EDE5D9', nombre: 'Crema' },
  { hex: '#BD9D7B', nombre: 'Madera' },
  { hex: '#211305', nombre: 'Corteza' },
]
const pasos = ['Bocetos a mano', 'Bocetos digitales', 'Grilla de construcción', 'Marca']

const Signo = ({ src, ar, color, className = '', label }) => (
  <span
    className={`signo ${className}`}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    style={{ '--src': `url(${P(src)})`, '--ar': ar, background: color }}
  />
)

export default function Marca() {
  const escena = useRef(null)
  const [paso, setPaso] = useState(0)

  useLayoutEffect(() => {
    const sec = escena.current
    const capas = [...sec.querySelectorAll('.proceso__capa')]
    // cada paso ocupa un cuarto del recorrido; entre uno y otro, un fundido con un poco de escala
    const pintar = (prog) => {
      const t = prog * (capas.length - 1)
      capas.forEach((el, i) => {
        const d = t - i // < 0: todavía no llegó; > 0: ya pasó
        const o = Math.max(0, 1 - Math.abs(d) * 1.6)
        el.style.opacity = o.toFixed(3)
        el.style.transform = `scale(${(1 + d * 0.06).toFixed(4)})`
        el.style.visibility = o > 0 ? 'visible' : 'hidden'
      })
      setPaso(Math.min(capas.length - 1, Math.round(t)))
    }
    if (reduce()) {
      pintar(1)
      return
    }
    const st = ScrollTrigger.create({ trigger: sec, start: 'top top', end: '+=240%', pin: true, scrub: 0.4, onUpdate: (x) => pintar(x.progress), onRefresh: (x) => pintar(x.progress) })
    pintar(0)
    return () => st.kill()
  }, [])

  return (
    <div className="marca">
      {/* 1. del boceto a la marca */}
      <section className="proceso" ref={escena} aria-labelledby="marca-h">
        <div className="proceso__escena">
          <figure className="proceso__capa proceso__capa--mano">
            <img src={P('boceto-mano.webp')} width="1600" height="1196" alt="Bocetos a mano de la letra P con vetas de madera" loading="lazy" decoding="async" />
          </figure>
          <figure className="proceso__capa proceso__capa--digital">
            <Signo src="boceto-1.png" ar={425 / 562} color="#EDE5D9" label="Boceto digital 1" />
            <Signo src="boceto-2.png" ar={452 / 554} color="#EDE5D9" label="Boceto digital 2" />
            <Signo src="boceto-3.png" ar={462 / 562} color="#EDE5D9" label="Boceto digital 3" />
          </figure>
          <figure className="proceso__capa proceso__capa--grilla">
            <img src={P('grilla.png')} width="1040" height="1430" alt="Grilla de construcción del isotipo con circunferencias" loading="lazy" decoding="async" />
          </figure>
          <figure className="proceso__capa proceso__capa--marca">
            <Signo src="isotipo.png" ar={424 / 593} color="#EDE5D9" className="proceso__isotipo" label="Isotipo de Patagonia" />
          </figure>
        </div>

        <header className="proceso__esquina proceso__esquina--titulo">
          <p className="proceso__disc">Manual de identidad visual</p>
          <h2 className="proceso__titulo" id="marca-h">Patagonia</h2>
        </header>
        <ul className="proceso__esquina proceso__esquina--paleta" aria-label="Paleta de la marca">
          {paleta.map((c) => (
            <li key={c.hex}>
              <span className="proceso__chip" style={{ background: c.hex }} />
              <span><b>{c.nombre}</b> {c.hex}</span>
            </li>
          ))}
        </ul>
        <p className="proceso__esquina proceso__esquina--paso" aria-live="polite">
          <b>{paso + 1} de {pasos.length}</b> {pasos[paso]}
        </p>
        <p className="proceso__esquina proceso__esquina--pista">Bajá para ver el proceso</p>
      </section>

      {/* 2. aplicaciones: la maqueta y la papelería, juntas */}
      <section className="aplic" aria-labelledby="marca-aplic">
        <header className="aplic__esquina">
          <p className="proceso__disc">Aplicaciones</p>
          <h3 className="proceso__titulo" id="marca-aplic">Madera y papel</h3>
        </header>
        <div className="aplic__mesa">
          <figure className="aplic__maqueta">
            <img src={P('maqueta-2.webp')} width="672" height="840" alt="Isotipo tallado en madera, colgado en la pared con luz de ventana" loading="lazy" decoding="async" />
            <figcaption>Maqueta en volumen</figcaption>
          </figure>
          <figure className="aplic__papeleria" tabIndex={0}>
            <img className="aplic__pieza aplic__pieza--hoja" src={P('hoja.webp')} width="1400" height="1980" alt="Hoja membretada" loading="lazy" decoding="async" />
            <img className="aplic__pieza aplic__pieza--sobre" src={P('sobre-frente.webp')} width="1400" height="700" alt="Sobre" loading="lazy" decoding="async" />
            <img className="aplic__pieza aplic__pieza--tarjeta" src={P('tarjeta-frente.webp')} width="1339" height="867" alt="Tarjeta personal, frente" loading="lazy" decoding="async" />
            <img className="aplic__pieza aplic__pieza--tarjeta2" src={P('tarjeta-dorso.webp')} width="1339" height="867" alt="Tarjeta personal, dorso" loading="lazy" decoding="async" />
            <figcaption>Hoja, sobre y tarjeta</figcaption>
          </figure>
        </div>
      </section>
    </div>
  )
}
