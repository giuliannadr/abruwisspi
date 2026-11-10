import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cartas } from '../data/fotos'
import { img } from '../data/site'

// El mazo de El Principito que diseñó Abril, para jugar:
// arrastrá la carta de arriba para mandarla al fondo, tocala para darla vuelta.
const pila = [
  { rotate: -9, x: -26, y: 14 },
  { rotate: 6, x: 22, y: 6 },
  { rotate: -1.5, x: 0, y: 0 },
]

export default function Mazo({ abrir }) {
  const [orden, setOrden] = useState(cartas.map((c) => c.id)) // el último es el de arriba
  const [vueltas, setVueltas] = useState({})
  const quieto = useReducedMotion()
  const arriba = orden[orden.length - 1]

  const alFondo = () => setOrden((o) => [o[o.length - 1], ...o.slice(0, -1)])
  const darVuelta = (id = arriba) => setVueltas((v) => ({ ...v, [id]: !v[id] }))

  return (
    <section className="mazo" id="cartas" aria-labelledby="mazo-h">
      <div className="mazo__texto">
        <h2 className="mazo__h" id="mazo-h" data-titulo><span>El Principito</span></h2>
        <p data-reveal style={{ '--i': 1 }}>
          Cartas y caja. Un mazo coleccionable con los personajes de los planetas. Cada carta trae su frase y tres palabras que lo describen, y el dorso es su objeto: el farol, la galera, el mundo.
        </p>
        <p className="mazo__nombre" aria-live="polite" data-reveal style={{ '--i': 2 }}>
          Arriba: {cartas.find((c) => c.id === arriba).nombre}
          {vueltas[arriba] ? ', de dorso' : ''}
        </p>
        <div className="mazo__acciones" data-reveal style={{ '--i': 3 }}>
          <button className="btn btn--cherry" onClick={() => darVuelta()}>Dar vuelta</button>
          <button className="btn" onClick={alFondo}>Pasar carta</button>
          <button className="btn btn--claro" onClick={(e) => abrir('principito', e.currentTarget)}>Ver la caja</button>
        </div>
      </div>

      <div className="mazo__mesa" data-entra="reparte">
        {orden.map((id, i) => {
          const c = cartas.find((x) => x.id === id)
          const top = id === arriba
          const pos = pila[i]
          return (
            <motion.div
              key={id}
              className="carta"
              data-top={top}
              data-flip={!!vueltas[id]}
              style={{ zIndex: i }}
              initial={false}
              animate={{ rotate: pos.rotate, x: pos.x, y: pos.y, scale: top ? 1 : 0.96 }}
              transition={quieto ? { duration: 0 } : { type: 'spring', duration: 0.55, bounce: 0.22 }}
              drag={top ? 'x' : false}
              dragSnapToOrigin
              dragElastic={0.6}
              whileDrag={{ scale: 1.04, rotate: 0, filter: 'drop-shadow(0 22px 30px rgba(43, 3, 12, 0.35))' /* taste-skill-ignore: la carta flota mientras se arrastra */ }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 500) alFondo()
              }}
              onTap={() => top && darVuelta(id)}
              aria-hidden={!top}
            >
              <div className="carta__cuerpo">
                <div className="carta__cara">
                  <img src={img(`carta-${id}`, 'sm')} srcSet={`${img(`carta-${id}`, 'sm')} 600w, ${img(`carta-${id}`)} 1200w`} sizes="340px" width={c.w} height={c.h} alt={`Carta de ${c.nombre}`} draggable="false" loading="lazy" />
                </div>
                <div className="carta__cara carta__cara--dorso">
                  <img src={img(`dorso-${id}`, 'sm')} width={c.w} height={c.h} alt={`Dorso de la carta de ${c.nombre}`} draggable="false" loading="lazy" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
