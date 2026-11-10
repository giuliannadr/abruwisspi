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
  const els = root.querySelectorAll(':is([data-reveal], [data-titulo], [data-cortina], [data-entra]):not([data-in])')
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.dataset.in = 'true'
          io.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  )
  els.forEach((el) => io.observe(el))
  // Si la página salta (un link, recargar a mitad de página), lo que quedó arriba también aparece.
  let raf = 0
  const barrer = () => {
    raf = 0
    for (const el of els) {
      if (!el.dataset.in && el.getBoundingClientRect().top < innerHeight) {
        el.dataset.in = 'true'
        io.unobserve(el)
      }
    }
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
      gsap.fromTo(el, { x: -40 * dir }, {
        x: 40 * dir,
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
