import { proyectos } from '../data/proyectos'
import { series } from '../data/fotos'

// Bio: el texto que mandó Abril (2026-11-23), en dos párrafos. Sin mencionar el estudio.
export default function Sobre() {
  return (
    <section className="sobre" id="sobre-mi" aria-labelledby="sobre-h">
      <img className="sobre__foto" data-entra="sube" src="/tex/abril-sobre.png" width="819" height="1100" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className="sobre__texto">
        <h2 className="sobre__h" id="sobre-h" data-titulo><span>Sobre mí</span></h2>
        <p className="sobre__bio" data-reveal style={{ '--i': 1 }}>
          Me interesa abordar el diseño desde una perspectiva integral, aportando creatividad y pensamiento estratégico para que cada marca pueda transmitir su esencia y generar una identidad con la que las personas se sientan identificadas.
        </p>
        <p className="sobre__bio sobre__bio--2" data-reveal style={{ '--i': 2 }}>
          Busco desarrollar soluciones que combinen lo estético y lo funcional, creando experiencias visuales y digitales que conecten con las personas y respondan a sus necesidades.
        </p>
        <dl className="sobre__datos" data-reveal style={{ '--i': 3 }}>
          <div><dt>Hago</dt><dd>Gráfica, fotografía y UX/UI</dd></div>
          <div><dt>En esta web</dt><dd>{proyectos.length} proyectos y {series.length + 1} series de fotos</dd></div>
        </dl>
      </div>
    </section>
  )
}
