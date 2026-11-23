import { categorias } from '../data/categorias'
import { porId } from '../data/proyectos'
import { img } from '../data/site'

// Inicio: una mesa con un objeto por categoría, hecho con sus piezas (afiches apilados, la tapa con el
// vinilo, la caja con las cartas…). Al pasar el mouse el objeto se abre; al tocarlo, se entra a la
// categoría y la pieza de adelante viaja a la página.
// Cada objeto tiene su forma: no es una grilla de tarjetas iguales.
const nombresDe = (c) => c.nombres ?? c.proyectos.map((id) => porId[id].titulo)
const fuente = (src) => (src.includes('/') ? `/img/${src}.webp` : img(src, 'sm')) // la caja no tiene versión chica

function Objeto({ c }) {
  return (
    <span className="obj" aria-hidden="true">
      {c.capas.map(([src, ancho, ar, q, a], i) => {
        const estilo = {
          '--w': `${ancho}%`,
          '--ar': ar,
          '--x': `${q.x}%`, '--y': `${q.y}%`, '--r': `${q.r}deg`,
          '--hx': `${a.x}%`, '--hy': `${a.y}%`, '--hr': `${a.r}deg`,
          zIndex: i + 1,
        }
        if (src === 'vinilo') {
          return (
            <span key={i} className="obj__capa obj__vinilo" style={estilo}>
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="49.5" fill="#160207" />
                {[44, 39, 34, 29, 24].map((r) => (
                  <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#3a0a16" strokeWidth="0.4" />
                ))}
                <circle cx="50" cy="50" r="16" fill="#B00F34" />
                <circle cx="50" cy="50" r="1.6" fill="#F6D3DA" />
              </svg>
            </span>
          )
        }
        return <img key={i} className="obj__capa" style={estilo} src={fuente(src)} alt="" loading="lazy" decoding="async" draggable="false" />
      })}
    </span>
  )
}

export default function Categorias({ ir }) {
  return (
    <section className="cats" id="categorias" aria-labelledby="cats-h">
      <header className="cats__cabeza">
        <h2 className="cats__h" id="cats-h" data-titulo><span>Proyectos</span></h2>
        <p className="cats__cuenta" data-reveal style={{ '--i': 1 }}>({categorias.length}) categorías. Tocá una para entrar</p>
      </header>

      <ol className="mesa2">
        {categorias.map((c, k) => (
          <li key={c.id} className="mesa2__lugar" data-reveal style={{ '--i': k % 3 }}>
            <a
              className="cat2"
              href={`#/c/${c.id}`}
              data-cat={c.id}
              onClick={(e) => {
                e.preventDefault()
                // la pieza de adelante viaja a la página de la categoría
                const capas = e.currentTarget.querySelectorAll('img.obj__capa')
                ir(c.id, capas[capas.length - 1])
              }}
            >
              <Objeto c={c} />
              <span className="cat2__pie">
                <span className="cat2__nombre">{c.nombre}</span>
                <span className="cat2__lista">({nombresDe(c).length}) {nombresDe(c).join(', ')}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
