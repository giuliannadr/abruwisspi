import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Categorias from './components/Categorias'
import Categoria from './components/Categoria'
import Sobre from './components/Sobre'
import Cierre from './components/Cierre'
import Vista from './components/Vista'
import { porId } from './data/proyectos'
import { catPorId } from './data/categorias'
import { startLenis, getLenis, observeReveals, transicion, derivas } from './lib/motion'

// Sitio en varias páginas (2026-11-23), con rutas en el hash:
//   #/            inicio: portada, categorías, sobre mí
//   #/c/<id>      una categoría con sus proyectos
//   #/p/<id>      un proyecto abierto encima de la página en la que se estaba
const leer = () => {
  const c = location.hash.match(/^#\/c\/([\w-]+)/)
  const p = location.hash.match(/^#\/p\/([\w-]+)/)
  return {
    pagina: c && catPorId[c[1]] ? c[1] : null,
    abierto: p && porId[p[1]] ? p[1] : null,
  }
}

// Busca en la página la imagen visible de un proyecto, para que la vista vuelva a ella.
const piezaVisible = (id) =>
  [...document.querySelectorAll(`[data-pieza="${id}"]`)].find((el) => {
    const r = el.getBoundingClientRect()
    return r.bottom > 0 && r.top < innerHeight && getComputedStyle(el.closest('article') ?? el).visibility !== 'hidden'
  })

const arriba = () => {
  getLenis()?.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}

export default function App() {
  const [pagina, setPagina] = useState(() => leer().pagina) // null = inicio
  const [abierto, setAbierto] = useState(() => leer().abierto)

  useEffect(() => { startLenis() }, [])

  // entradas y derivas: se vuelven a activar con cada página nueva
  useEffect(() => {
    const fuera = observeReveals()
    const sinDerivas = derivas()
    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => { fuera(); sinDerivas() }
  }, [pagina])

  useEffect(() => {
    const l = getLenis()
    if (abierto) l?.stop()
    else l?.start()
    const cat = pagina && catPorId[pagina]
    document.title = abierto
      ? `${porId[abierto].titulo} · Abril Wisspi`
      : cat
        ? `${cat.nombre} · Abril Wisspi`
        : 'Abril Wisspi · Diseño gráfico'
  }, [abierto, pagina])

  useEffect(() => {
    const onPop = () => transicion(() => {
      const r = leer()
      setAbierto(r.abierto)
      if (!r.abierto) {
        setPagina((ant) => {
          if (ant !== r.pagina) arriba()
          return r.pagina
        })
      }
    })
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // ir a una categoría: la pieza tocada viaja al primer proyecto de la categoría
  const ir = useCallback((id, el) => {
    transicion(() => {
      setPagina(id)
      history.pushState(null, '', `#/c/${id}`)
      arriba()
    }, { from: el, to: () => document.querySelector('.pagina [data-pieza]') })
  }, [])

  const inicio = useCallback(() => {
    const desde = pagina
    transicion(() => {
      setPagina(null)
      history.pushState(null, '', location.pathname)
      // vuelve a la lista de categorías, con la de la que venía a la vista
      requestAnimationFrame(() => {
        const fila = document.querySelector(`.cat[href="#/c/${desde}"]`)
        const y = (fila ?? document.querySelector('#categorias'))?.getBoundingClientRect().top + scrollY - innerHeight * 0.3
        getLenis()?.scrollTo(y, { immediate: true, force: true })
        window.scrollTo(0, y)
      })
    })
  }, [pagina])

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
      history.pushState(null, '', pagina ? `#/c/${pagina}` : location.pathname)
    }, { to: () => piezaVisible(id) })
  }, [abierto, pagina])

  return (
    <>
      <Nav key={pagina ?? 'inicio'} pagina={pagina} inicio={inicio} />
      <main inert={abierto ? true : undefined}>
        {pagina ? (
          <Categoria key={pagina} cat={catPorId[pagina]} abrir={abrir} ir={ir} inicio={inicio} />
        ) : (
          <>
            <Hero />
            <Categorias ir={ir} />
            <Sobre />
          </>
        )}
      </main>
      <Cierre />
      {abierto && <Vista p={porId[abierto]} cerrar={cerrar} abrir={abrir} />}
    </>
  )
}
