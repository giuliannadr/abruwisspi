// Marca y papelería: Patagonia, el manual de identidad visual de Abril (PDF de 31 páginas, 116 MB).
// v3 (2026-11-23): un estudio de marca limpio, todo sobre el papel claro del sitio y con mucho aire.
// El marrón de la marca queda en las piezas, no en los fondos (el salto de bordó a marrón cargaba todo).
// Cuatro partes separadas solo por una línea con su nombre: la marca, construcción, color, aplicaciones.
// Las piezas salen del PDF (scratchpad patagonia.py): la marca y los bocetos en PNG transparente,
// usados como máscara CSS para pintarlos con la paleta.
import { Ampliable } from './Ampliar'

const P = (n) => `/img/patagonia/${n}`
const paleta = [
  { hex: '#EDE5D9', nombre: 'Crema' },
  { hex: '#BD9D7B', nombre: 'Madera' },
  { hex: '#211305', nombre: 'Corteza' },
]
const CORTEZA = '#211305'

const Signo = ({ src, ar, className = '', label }) => (
  <span
    className={`signo ${className}`}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    style={{ '--src': `url(${P(src)})`, '--ar': ar, background: CORTEZA }}
  />
)

const Parte = ({ nombre, children, className = '' }) => (
  <section className={`estudio__parte ${className}`} aria-label={nombre}>
    <h3 className="estudio__rotulo" data-reveal>{nombre}</h3>
    {children}
  </section>
)

export default function Marca() {
  return (
    <div className="estudio">
      <header className="estudio__cabeza" data-reveal>
        <p className="estudio__disc">Manual de identidad visual</p>
        <h2 className="estudio__titulo">Patagonia</h2>
      </header>

      <Parte nombre="La marca" className="estudio__marca">
        <Ampliable src={P('isotipo.png')} w={424} h={593} alt="Isotipo de Patagonia">
          <Signo src="isotipo.png" ar={424 / 593} className="estudio__isotipo" label="Isotipo de Patagonia" />
        </Ampliable>
        <Ampliable src={P('logotipo.png')} w={1242} h={566} alt="Logotipo horizontal de Patagonia">
          <Signo src="logotipo.png" ar={1242 / 566} className="estudio__logotipo" label="Logotipo horizontal de Patagonia" />
        </Ampliable>
      </Parte>

      <Parte nombre="Construcción">
        <div className="estudio__tres">
          <figure data-reveal>
            <Ampliable src={P('boceto-mano-tinta.png')} w={1254} h={986} alt="Bocetos a mano de la letra P" className="estudio__marco">
              {/* la tinta sola, sin el papel ni el renglón de la foto (scratchpad: separada por color) */}
              <Signo src="boceto-mano-tinta.png" ar={1254 / 986} className="estudio__mano" label="Bocetos a mano de la letra P con vetas de madera" />
            </Ampliable>
            <figcaption>Boceto a mano</figcaption>
          </figure>
          <figure data-reveal style={{ '--i': 1 }}>
            <Ampliable src={P('boceto-2.png')} w={452} h={554} alt="Boceto digital de la P" className="estudio__marco">
              <Signo src="boceto-2.png" ar={452 / 554} className="estudio__digital" label="Boceto digital de la P" />
            </Ampliable>
            <figcaption>Boceto digital</figcaption>
          </figure>
          <figure data-reveal style={{ '--i': 2 }}>
            <Ampliable src={P('grilla.png')} w={1040} h={1430} alt="Grilla de construcción del isotipo" className="estudio__marco">
              <img src={P('grilla.png')} width="1040" height="1430" alt="Grilla de construcción del isotipo con circunferencias" loading="lazy" decoding="async" />
            </Ampliable>
            <figcaption>Grilla</figcaption>
          </figure>
        </div>
      </Parte>

      <Parte nombre="Color">
        <ul className="estudio__paleta">
          {paleta.map((c, i) => (
            <li key={c.hex} data-reveal style={{ '--i': i }}>
              <span className="estudio__circulo" style={{ background: c.hex }} />
              <b>{c.nombre}</b>
              <span>{c.hex}</span>
            </li>
          ))}
        </ul>
      </Parte>

      <Parte nombre="Aplicaciones">
        <div className="estudio__aplic">
          <figure data-reveal>
            <Ampliable src={P('maqueta-2.webp')} w={672} h={840} alt="Isotipo tallado en madera" className="estudio__foto">
              <img src={P('maqueta-2.webp')} width="672" height="840" alt="Isotipo tallado en madera, colgado en la pared con luz de ventana" loading="lazy" decoding="async" />
            </Ampliable>
            <figcaption>Maqueta en volumen</figcaption>
          </figure>
          <figure data-reveal style={{ '--i': 1 }}>
            <div className="estudio__papeleria">
              <Ampliable src={P('hoja.webp')} w={1400} h={1980} alt="Hoja membretada" className="estudio__pieza estudio__pieza--hoja">
                <img src={P('hoja.webp')} width="1400" height="1980" alt="Hoja membretada" loading="lazy" decoding="async" />
              </Ampliable>
              <Ampliable src={P('sobre-frente.webp')} w={1400} h={700} alt="Sobre" className="estudio__pieza estudio__pieza--sobre">
                <img src={P('sobre-frente.webp')} width="1400" height="700" alt="Sobre" loading="lazy" decoding="async" />
              </Ampliable>
              <Ampliable src={P('tarjeta-frente.webp')} w={1339} h={867} alt="Tarjeta personal, frente" className="estudio__pieza estudio__pieza--tarjeta">
                <img src={P('tarjeta-frente.webp')} width="1339" height="867" alt="Tarjeta personal, frente" loading="lazy" decoding="async" />
              </Ampliable>
            </div>
            <figcaption>Hoja, sobre y tarjeta</figcaption>
          </figure>
        </div>
      </Parte>
    </div>
  )
}
