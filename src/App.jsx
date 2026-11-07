import { useCallback, useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Pliegos from './components/Pliegos'
import Mazo from './components/Mazo'
import Disco from './components/Disco'
import Fotos from './components/Fotos'
import Sobre from './components/Sobre'
import Cierre from './components/Cierre'
import Vista from './components/Vista'
import { porId } from './data/proyectos'
import { startLenis, getLenis, observeReveals, transicion } from './lib/motion'

const idDelHash = () => {
  const m = location.hash.match(/^#\/p\/([\w-]+)/)
  return m && porId[m[1]] ? m[1] : null
}

// Busca en la página la imagen visible de un proyecto, para que la vista vuelva a ella.
const piezaVisible = (id) =>
  [...document.querySelectorAll(`[data-pieza="${id}"]`)].find((el) => {
    const r = el.getBoundingClientRect()
    return r.bottom > 0 && r.top < innerHeight && getComputedStyle(el.closest('article') ?? el).visibility !== 'hidden'
  })

export default function App() {
  const [abierto, setAbierto] = useState(idDelHash)

  useEffect(() => {
    startLenis()
    return observeReveals()
  }, [])

  useEffect(() => {
    const l = getLenis()
    if (abierto) l?.stop()
    else l?.start()
    document.title = abierto ? `${porId[abierto].titulo} · Abril Wisspi` : 'Abril Wisspi · Diseño gráfico'
  }, [abierto])

  useEffect(() => {
    const onPop = () => transicion(() => setAbierto(idDelHash()))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const abrir = useCallback((id, el) => {
    transicion(() => {
      setAbierto(id)
      history.pushState(null, '', `#/p/${id}`)
    }, { from: el })
  }, [])

  const cerrar = useCallback(() => {
    const id = abierto
    transicion(() => {
      setAbierto(null)
      history.pushState(null, '', location.pathname)
    }, { to: () => piezaVisible(id) })
  }, [abierto])

  return (
    <>
      <Nav />
      <main inert={abierto ? true : undefined}>
        <Hero />
        <Sobre />
        <Pliegos abrir={abrir} />
        <Mazo abrir={abrir} />
        <Disco abrir={abrir} />
        <Fotos />
      </main>
      <Cierre />
      {abierto && <Vista p={porId[abierto]} cerrar={cerrar} abrir={abrir} />}
    </>
  )
}
