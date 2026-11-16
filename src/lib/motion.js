import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { flushSync } from 'react-dom'

gsap.registerPlugin(ScrollTrigger)

export const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null
export function startLenis() {
  if (lenis || reduce()) return lenis
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}
export const getLenis = () => lenis

export function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.1 })
  else document.querySelector(target)?.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth' })
}

// Entradas: cada [data-reveal] sube y aparece una vez cuando entra en pantalla.
export function observeReveals(root = document) {
  const pendientes = new Set(root.querySelectorAll(':is([data-reveal], [data-titulo], [data-cortina], [data-entra]):not([data-in])'))
  const entrar = (el) => {
    el.dataset.in = 'true'
    io.unobserve(el)
    pendientes.delete(el)
    // terminada la cortina, se saca el recorte: si queda puesto, cada foto es una capa aparte
    // y las tiras que se mueven solas obligan a recomponerlas en cada cuadro
    if ('cortina' in el.dataset) setTimeout(() => { el.dataset.listo = '' }, 1600 + (Number(getComputedStyle(el).getPropertyValue('--i')) || 0) * 80)
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) entrar(e.target)
    },
    { rootMargin: '0px 0px -12% 0px' },
  )
  pendientes.forEach((el) => io.observe(el))
  // Si la página salta (un link, recargar a mitad de página), lo que quedó arriba también aparece.
  let raf = 0
  const barrer = () => {
    raf = 0
    for (const el of pendientes) if (el.getBoundingClientRect().top < innerHeight) entrar(el)
    if (!pendientes.size) removeEventListener('scroll', onScroll)
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(barrer) }
  addEventListener('scroll', onScroll, { passive: true })
  barrer()
  return () => {
    io.disconnect()
    removeEventListener('scroll', onScroll)
  }
}

// Títulos que se corren un poco de costado con el scroll (data-deriva = 1 o -1).
export function derivas() {
  if (reduce()) return () => {}
  const ctx = gsap.context(() => {
    gsap.utils.toArray('[data-deriva]').forEach((el) => {
      const dir = Number(el.dataset.deriva) || 1
      // en celu el título ya ocupa casi todo el ancho: se corre apenas
      const amp = () => (innerWidth < 760 ? 10 : 40)
      gsap.fromTo(el, { x: () => -amp() * dir }, {
        x: () => amp() * dir,
        invalidateOnRefresh: true,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
      })
    })
  })
  return () => ctx.revert()
}

// Transición entre vistas con elemento compartido (View Transitions API).
// `from`: el elemento tocado (lleva la imagen a la vista nueva).
// `to`: función que devuelve el elemento de destino al volver.
export function transicion(update, { from, to } = {}) {
  if (!document.startViewTransition || reduce()) {
    update()
    return
  }
  if (from) from.style.viewTransitionName = 'pieza'
  const vt = document.startViewTransition(() => {
    if (from) from.style.viewTransitionName = ''
    flushSync(update)
    const destino = to?.()
    if (destino) destino.style.viewTransitionName = 'pieza'
    return destino
  })
  vt.ready.catch(() => {})
  vt.finished.catch(() => {}).finally(() => {
    document.querySelectorAll('[style*="view-transition-name"]').forEach((el) => {
      if (!el.dataset.vtFijo) el.style.viewTransitionName = ''
    })
  })
}
