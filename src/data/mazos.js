// Los mazos con caja 3D (Juegos de cartas). Los dos usan la misma mecánica (components/Mazo.jsx):
// la caja arranca grande en el centro, se corre, se abre y las cartas salen por la boca.
//   carpeta: caras de la caja en public/img/<carpeta> (frente, dorso, izq, der, tapa, base)
//   rh / rd: alto y profundidad de la caja sobre su ancho (medidos en el troquel)
//   cartas: frente y dorso de cada carta (public/img, con versión -sm)
//   dentro / boca: colores del interior de la caja
import { cartas as cartasPrincipito } from './fotos'

export const mazos = {
  principito: {
    carpeta: 'caja',
    rh: 1020 / 720,
    rd: 190 / 720,
    dentro: '#23256a',
    boca: '#14163f',
    nombre: 'de El Principito',
    cartas: cartasPrincipito.map((c) => ({ id: c.id, nombre: c.nombre, frente: `carta-${c.id}`, dorso: `dorso-${c.id}`, w: c.w, h: c.h })),
  },
  tarot: {
    carpeta: 'caja-tarot',
    rh: 710 / 488,
    rd: 109 / 488,
    dentro: '#1d3a22',
    boca: '#0d1f12',
    nombre: 'del tarot',
    cartas: [
      { id: 'mago', nombre: 'El Mago', frente: 'tarot-mago', dorso: 'tarot-dorso', w: 945, h: 1417 },
      { id: 'amantes', nombre: 'Los Amantes', frente: 'tarot-amantes', dorso: 'tarot-dorso', w: 945, h: 1417 },
      { id: 'fuerza', nombre: 'La Fuerza', frente: 'tarot-fuerza', dorso: 'tarot-dorso', w: 945, h: 1417 },
      { id: 'diablo', nombre: 'El Diablo', frente: 'tarot-diablo', dorso: 'tarot-dorso', w: 945, h: 1418 },
    ],
  },
}
