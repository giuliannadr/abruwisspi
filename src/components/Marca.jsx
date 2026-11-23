// Marca y papelería: Patagonia, el manual de identidad visual de Abril (PDF de 31 páginas, 116 MB).
// v3 (2026-11-23): un estudio de marca limpio, todo sobre el papel claro del sitio y con mucho aire.
// El marrón de la marca queda en las piezas, no en los fondos (el salto de bordó a marrón cargaba todo).
// Cuatro partes separadas solo por una línea con su nombre: la marca, construcción, color, aplicaciones.
// Las piezas salen del PDF (scratchpad patagonia.py): la marca y los bocetos en PNG transparente,
// usados como máscara CSS para pintarlos con la paleta.
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
        <Signo src="isotipo.png" ar={424 / 593} className="estudio__isotipo" label="Isotipo de Patagonia" />
        <Signo src="logotipo.png" ar={1242 / 566} className="estudio__logotipo" label="Logotipo horizontal de Patagonia" />
      </Parte>

      <Parte nombre="Construcción">
        <div className="estudio__tres">
          <figure data-reveal>
            <div className="estudio__marco">
              {/* la tinta sola, sin el papel ni el renglón de la foto (scratchpad: separada por color) */}
              <Signo src="boceto-mano-tinta.png" ar={1254 / 986} className="estudio__mano" label="Bocetos a mano de la letra P con vetas de madera" />
            </div>
            <figcaption>Boceto a mano</figcaption>
          </figure>
          <figure data-reveal style={{ '--i': 1 }}>
            <div className="estudio__marco">
              <Signo src="boceto-2.png" ar={452 / 554} className="estudio__digital" label="Boceto digital de la P" />
            </div>
            <figcaption>Boceto digital</figcaption>
          </figure>
          <figure data-reveal style={{ '--i': 2 }}>
            <div className="estudio__marco">
              <img src={P('grilla.png')} width="1040" height="1430" alt="Grilla de construcción del isotipo con circunferencias" loading="lazy" decoding="async" />
            </div>
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
            <img src={P('maqueta-2.webp')} width="672" height="840" alt="Isotipo tallado en madera, colgado en la pared con luz de ventana" loading="lazy" decoding="async" />
            <figcaption>Maqueta en volumen</figcaption>
          </figure>
          <figure data-reveal style={{ '--i': 1 }}>
            <div className="estudio__papeleria">
              <img className="estudio__pieza estudio__pieza--hoja" src={P('hoja.webp')} width="1400" height="1980" alt="Hoja membretada" loading="lazy" decoding="async" />
              <img className="estudio__pieza estudio__pieza--sobre" src={P('sobre-frente.webp')} width="1400" height="700" alt="Sobre" loading="lazy" decoding="async" />
              <img className="estudio__pieza estudio__pieza--tarjeta" src={P('tarjeta-frente.webp')} width="1339" height="867" alt="Tarjeta personal, frente" loading="lazy" decoding="async" />
            </div>
            <figcaption>Hoja, sobre y tarjeta</figcaption>
          </figure>
        </div>
      </Parte>
    </div>
  )
}
