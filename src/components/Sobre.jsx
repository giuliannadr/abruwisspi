import { proyectos } from '../data/proyectos'
import { series } from '../data/fotos'

// PENDIENTE: la bio es provisoria, armada solo con lo que hay en su Drive.
// Reemplazar con el texto de Abril (de dónde es, dónde estudia, qué busca).
export default function Sobre() {
  return (
    <section className="sobre" id="sobre-mi" aria-labelledby="sobre-h">
      <div className="sobre__foto" aria-hidden="true">
        <div className="sobre__foto-papel" />
        <div className="sobre__foto-fluo" />
        <div className="sobre__foto-tinta" />
      </div>
      <div className="sobre__texto">
        <h2 className="sobre__h" id="sobre-h" data-reveal>Sobre mí</h2>
        <p className="sobre__bio" data-reveal style={{ '--i': 1 }}>
          Soy Abril y estudio diseño gráfico. Hago afiches de cine, packaging, folletos y portadas de disco, y me gusta sacar mis propias fotos: books, producto y repostería.
        </p>
        <p className="sobre__bio sobre__bio--2" data-reveal style={{ '--i': 2 }}>
          También estoy aprendiendo UX/UI, con cursos de research, writing y diseño de interfaces.
        </p>
        <dl className="sobre__datos" data-reveal style={{ '--i': 3 }}>
          <div><dt>Estudio</dt><dd>Diseño gráfico</dd></div>
          <div><dt>Hago</dt><dd>Gráfica, fotografía y UX/UI</dd></div>
          <div><dt>En esta web</dt><dd>{proyectos.length} proyectos y {series.length + 1} series de fotos</dd></div>
        </dl>
      </div>
    </section>
  )
}
