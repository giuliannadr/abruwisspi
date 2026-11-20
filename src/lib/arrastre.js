import { useEffect } from 'react'
import { reduce } from './motion'

// Arrastrar una fila con el mouse (en táctil ya se desliza sola). Al soltar sigue con la inercia del gesto.
// Si la fila tiene data-loop="true", al pasar el borde salta a la otra vuelta (es la misma foto).
// Con `rueda`, la rueda vertical también la mueve de costado hasta llegar a un extremo.
export function useArrastre(ref, { rueda = false } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia('(pointer: fine)').matches) return
    let x0 = 0, s0 = 0, abajo = false, movido = false // s0 cambia al dar la vuelta
    let vel = 0, ultX = 0, ultT = 0, raf = 0
    const ubicar = (x) => {
      if (el.dataset.loop === 'true') {
        const mitad = el.scrollWidth / 2
        if (x >= mitad) { x -= mitad; s0 -= mitad }
        else if (x < 0) { x += mitad; s0 += mitad }
      }
      el.scrollLeft = x
    }
    const inercia = () => {
      vel *= 0.94
      if (Math.abs(vel) < 0.02) return
      ubicar(el.scrollLeft - vel * 16)
      raf = requestAnimationFrame(inercia)
    }
    const down = (e) => {
      if (e.button > 0) return
      cancelAnimationFrame(raf)
      abajo = true; movido = false; x0 = ultX = e.clientX; ultT = performance.now(); vel = 0; s0 = el.scrollLeft
    }
    const move = (e) => {
      if (!abajo) return
      const dx = e.clientX - x0
      if (!movido && Math.abs(dx) > 4) { movido = true; el.dataset.arrastrando = '' }
      const t = performance.now()
      vel = (e.clientX - ultX) / Math.max(1, t - ultT); ultX = e.clientX; ultT = t
      ubicar(s0 - dx)
    }
    const up = () => {
      if (!abajo) return
      abajo = false
      delete el.dataset.arrastrando
      if (!movido) return
      if (performance.now() - ultT > 80) vel = 0 // la soltó quieta
      if (!reduce()) raf = requestAnimationFrame(inercia)
    }
    const click = (e) => { if (movido) { e.stopPropagation(); e.preventDefault() } }
    const wheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return // el trackpad de costado ya la mueve
      const max = el.scrollWidth - el.clientWidth
      if (max < 2) return
      const enBorde = (e.deltaY > 0 && el.scrollLeft >= max - 1) || (e.deltaY < 0 && el.scrollLeft <= 0)
      if (enBorde) return // en los extremos, la rueda vuelve a mover la página
      e.preventDefault()
      cancelAnimationFrame(raf)
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('pointerdown', down)
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)
    addEventListener('pointercancel', up)
    el.addEventListener('click', click, true)
    if (rueda) el.addEventListener('wheel', wheel, { passive: false })
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', down)
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
      removeEventListener('pointercancel', up)
      el.removeEventListener('click', click, true)
      el.removeEventListener('wheel', wheel)
    }
  }, [ref, rueda])
}
