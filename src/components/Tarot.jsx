import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { porId } from '../data/proyectos'
import { img } from '../data/site'

// Tarot (Juegos de cartas, después de El Principito): misma gramática que El Principito,
// título, texto y botones en las esquinas y las cartas al centro.
// Al entrar en pantalla las cuatro se reparten boca abajo y se dan vuelta de a una, como una tirada.
// Tocar una carta la da vuelta.
const p = porId.tarot
const nombres = { 'tarot-mago': 'El Mago', 'tarot-amantes': 'Los Amantes', 'tarot-fuerza': 'La Fuerza', 'tarot-diablo': 'El Diablo' }

export default function Tarot({ abrir }) {
  const ref = useRef(null)
  const visto = useInView(ref, { once: true, amount: 0.45 })
  const quieto = useReducedMotion()
  // al principio todas de dorso; después de repartirlas se van dando vuelta
  const [dorso, setDorso] = useState(() => Object.fromEntries(p.piezas.map((f) => [f.src, !quieto])))

  useEffect(() => {
    if (!visto || quieto) return
    const ts = p.piezas.map((f, i) => setTimeout(() => setDorso((d) => ({ ...d, [f.src]: false })), 900 + i * 260))
    return () => ts.forEach(clearTimeout)
  }, [visto, quieto])

  const n = p.piezas.length
  return (
    <section className="tarot" ref={ref} aria-labelledby="tarot-h">
      <div className="tarot__mesa">
        {p.piezas.map((f, i) => (
          <motion.button
            key={f.src}
            type="button"
            className="tarot__carta"
            data-flip={dorso[f.src] || undefined}
            initial={quieto ? false : { x: `${((n - 1) / 2 - i) * 106}%`, y: 30, rotate: (i - 1.5) * 4, opacity: 0 }}
            animate={visto || quieto ? { x: 0, y: 0, rotate: [-2, 1.5, -1, 2][i], opacity: 1 } : undefined}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => setDorso((d) => ({ ...d, [f.src]: !d[f.src] }))}
            aria-label={`${nombres[f.src]}${dorso[f.src] ? ', de dorso' : ''}. Tocá para darla vuelta.`}
          >
            <span className="tarot__cuerpo">
              <img className="tarot__cara" src={img(f.src, 'sm')} srcSet={`${img(f.src, 'sm')} 600w, ${img(f.src)} 945w`} sizes="(max-width: 860px) 44vw, 260px" width={f.w} height={f.h} alt="" draggable="false" loading="lazy" data-pieza={i === 0 ? 'tarot' : undefined} />
              <img className="tarot__cara tarot__cara--dorso" src={img('tarot-dorso', 'sm')} width="945" height="1418" alt="" draggable="false" loading="lazy" />
            </span>
          </motion.button>
        ))}
      </div>

      <header className="tarot__esquina tarot__esquina--titulo">
        <p className="tarot__disc">{p.disciplina}</p>
        <h2 className="tarot__titulo" id="tarot-h">{p.titulo}</h2>
      </header>
      <p className="tarot__esquina tarot__esquina--texto tarot__desc">{p.texto}</p>
      <div className="tarot__esquina tarot__esquina--botones">
        <p className="tarot__pista">Tocá una carta para darla vuelta</p>
        <div className="disco__celdas">
          <button onClick={(e) => abrir('tarot', e.currentTarget.closest('.tarot').querySelector('[data-pieza]'))}>Ver el proyecto</button>
          <button onClick={() => setDorso((d) => { const alguna = Object.values(d).some((v) => !v); return Object.fromEntries(Object.keys(d).map((k) => [k, alguna])) })}>Dar vuelta las cartas</button>
        </div>
      </div>
    </section>
  )
}
