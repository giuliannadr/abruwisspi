import { categorias } from '../data/categorias'
import { porId, temas } from '../data/proyectos'
import { img } from '../data/site'
import Disco from './Disco'
import Mazo from './Mazo'
import Fotos from './Fotos'
import Marca from './Marca'

// Página de una categoría (#/c/<id>): cabeza con el nombre y sus proyectos (la pieza tocada en el inicio
// viaja al primer proyecto), los proyectos y, al final, la categoría siguiente.
// Las categorías con sección propia usan la suya (música: el disco; cartas: El Principito y el tarot;
// fotografía: las series). El resto: un pliego por proyecto, con los colores del sitio en orden.
function Pliego({ p, k, abrir, arriba }) {
  const f = p.piezas[0]
  const t = temas[(k + 1) % temas.length] // arranca en rosa: la cabeza ya es cherry
  return (
    <article
      className="pliego2"
      data-lado={k % 2 ? 'der' : 'izq'}
      data-oscuro={['#B00F34', '#2B030C'].includes(t.fondo) || undefined}
      style={{ '--fondo': t.fondo, '--tinta': t.tinta, '--arriba': arriba }}
      aria-labelledby={`pl-${p.id}`}
    >
      <button className="pliego2__pieza" onClick={(e) => abrir(p.id, e.currentTarget.querySelector('img'))} aria-label={`Ver ${p.titulo}`} style={{ '--ar': f.w / f.h }}>
        <img src={img(f.src, 'sm')} srcSet={`${img(f.src, 'sm')} 900w, ${img(f.src)} ${f.w}w`} sizes="(max-width: 860px) 92vw, 50vw" width={f.w} height={f.h} alt={f.alt} loading="lazy" decoding="async" data-pieza={p.id} />
      </button>
      <div className="pliego2__info">
        <p className="pliego2__disc" data-reveal>{p.disciplina}</p>
        <div data-reveal style={{ '--i': 1 }}>
          <h2 className="pliego2__titulo" id={`pl-${p.id}`}>{p.titulo}</h2>
          <p className="pliego2__texto">{p.texto}</p>
        </div>
        <div className="pliego2__botones" data-reveal style={{ '--i': 2 }}>
          <button onClick={(e) => abrir(p.id, e.currentTarget.closest('.pliego2').querySelector('img'))}>
            {p.piezas.length > 1 ? `Ver las ${p.piezas.length} piezas` : 'Ver el proyecto'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Categoria({ cat, abrir, ir, inicio }) {
  const i = categorias.findIndex((c) => c.id === cat.id)
  const sig = categorias[(i + 1) % categorias.length]
  const nombres = cat.nombres ?? cat.proyectos.map((id) => porId[id].titulo)
  const ultimo = cat.especial ? null : temas[cat.proyectos.length % temas.length].fondo

  return (
    <div className="pagina" data-cat={cat.id}>
      <header className="catc">
        <a className="catc__volver" href="#/" onClick={(e) => { e.preventDefault(); inicio() }}>Inicio</a>
        <div className="catc__texto">
          <h1 className="catc__h">{cat.nombre}</h1>
          <p className="catc__cuenta">({nombres.length}) {nombres.join(', ')}</p>
        </div>
      </header>

      {cat.especial === 'disco' && <Disco abrir={abrir} />}
      {cat.especial === 'cartas' && (
        <>
          <Mazo id="principito" abrir={abrir} />
          <Mazo id="tarot" abrir={abrir} />
        </>
      )}
      {cat.especial === 'fotos' && <Fotos sinCabeza />}
      {cat.especial === 'marca' && <Marca />}
      {!cat.especial &&
        cat.proyectos.map((id, k) => (
          <Pliego key={id} p={porId[id]} k={k} abrir={abrir} arriba={temas[k % temas.length].fondo} />
        ))}

      <nav className="catc__sig" aria-label="Otra categoría" style={ultimo ? { '--arriba': ultimo } : undefined}>
        <button onClick={(e) => ir(sig.id, e.currentTarget.querySelector('img'))}>
          <small>Siguiente categoría</small>
          <strong>{sig.nombre}</strong>
          <img src={sig.portada.src.includes('/') ? `/img/${sig.portada.src}.webp` : img(sig.portada.src, 'sm')} width={sig.portada.w} height={sig.portada.h} alt="" loading="lazy" decoding="async" />
        </button>
      </nav>
    </div>
  )
}
