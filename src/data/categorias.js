// Las categorías del sitio (2026-11-23): el inicio muestra estas filas y cada una tiene su página
// (#/c/<id>). `proyectos` son ids de proyectos.js; `especial` usa una sección propia en vez de la lista
// común (música: el disco; cartas: El Principito y el tarot; fotografía: las series y los reels).
// `portada`: la pieza que la representa (viaja a la página de la categoría).
// `capas`: el objeto de la mesa del inicio, de atrás para adelante: [imagen, ancho (% de la celda),
//   proporción ancho/alto, quieto {x, y, r}, abierto {x, y, r}] (x/y en % del ancho de la propia capa).
//   'vinilo' es el disco negro (no es una imagen).
export const categorias = [
  {
    id: 'afiches',
    nombre: 'Afiches',
    proyectos: ['gatsby', 'dictador', 'avira', 'winx'],
    capas: [
      ['avira', 40, 1273 / 1800, { x: -30, y: 4, r: -9 }, { x: -78, y: 2, r: -14 }],
      ['dictador', 40, 1273 / 1800, { x: 0, y: -2, r: 3 }, { x: 0, y: -8, r: 0 }],
      ['gatsby', 40, 1273 / 1800, { x: 28, y: 3, r: 8 }, { x: 78, y: 2, r: 13 }],
    ],
    portada: { src: 'gatsby', w: 1273, h: 1800 },
  },
  {
    id: 'editorial',
    nombre: 'Editorial',
    proyectos: ['atalaya', 'futttura'],
    capas: [
      ['futttura-tour', 66, 2000 / 1419, { x: 6, y: -16, r: -3 }, { x: 10, y: -34, r: -6 }],
      ['atalaya-combo', 34, 1376 / 2000, { x: -40, y: 12, r: -7 }, { x: -92, y: 16, r: -12 }],
      ['atalaya-frente', 34, 1376 / 2000, { x: 24, y: 16, r: 5 }, { x: 70, y: 20, r: 10 }],
    ],
    portada: { src: 'atalaya-frente', w: 1376, h: 2000 },
  },
  {
    id: 'musica',
    nombre: 'Música',
    especial: 'disco',
    proyectos: ['trago', 'tinta90'],
    capas: [
      ['vinilo', 52, 1, { x: 14, y: 0, r: 0 }, { x: 52, y: 0, r: 140 }],
      ['tinta90', 52, 1, { x: -14, y: 0, r: -3 }, { x: -24, y: 0, r: -5 }],
    ],
    portada: { src: 'tinta90', w: 1080, h: 1080 },
  },
  {
    id: 'cartas',
    nombre: 'Juegos de cartas',
    especial: 'cartas',
    proyectos: ['principito', 'tarot'],
    capas: [
      ['tarot-mago', 28, 945 / 1417, { x: 40, y: 2, r: 9 }, { x: 108, y: -4, r: 15 }],
      ['carta-farolero', 28, 760 / 1200, { x: 8, y: -6, r: -4 }, { x: 34, y: -22, r: 3 }],
      ['caja/frente', 32, 720 / 1020, { x: -34, y: 4, r: -3 }, { x: -48, y: 6, r: -6 }],
    ],
    portada: { src: 'tarot-mago', w: 945, h: 1417 },
  },
  {
    id: 'marca',
    nombre: 'Marca y papelería',
    especial: 'marca',
    nombres: ['Patagonia'],
    proyectos: [],
    capas: [
      ['patagonia/hoja', 30, 1400 / 1980, { x: -36, y: 0, r: -5 }, { x: -82, y: -2, r: -9 }],
      ['patagonia/sobre-frente', 58, 2, { x: 16, y: -30, r: 3 }, { x: 26, y: -62, r: 5 }],
      ['patagonia/tarjeta-frente', 30, 1339 / 867, { x: 40, y: 58, r: -6 }, { x: 86, y: 92, r: -10 }],
    ],
    portada: { src: 'patagonia/hoja', w: 1400, h: 1980 },
  },
  {
    id: 'morfologia',
    nombre: 'Morfología',
    proyectos: ['morfologia'],
    capas: [
      ['morfologia-1', 38, 1273 / 1800, { x: -26, y: 4, r: -8 }, { x: -74, y: 2, r: -12 }],
      ['morfologia-3', 38, 1273 / 1800, { x: 26, y: 4, r: 8 }, { x: 74, y: 2, r: 12 }],
      ['morfologia-2', 38, 1273 / 1800, { x: 0, y: -2, r: 1 }, { x: 0, y: -8, r: 0 }],
    ],
    portada: { src: 'morfologia-2', w: 1273, h: 1800 },
  },
  {
    id: 'fotografia',
    nombre: 'Fotografía',
    especial: 'fotos',
    // las series de fotos no son proyectos de proyectos.js: se nombran acá para la fila del inicio
    nombres: ['Book años 50', 'Book de polas', 'Producto', 'Repostería', 'Reels'],
    proyectos: [],
    capas: [
      ['foto-reposteria-img_4180', 34, 1350 / 1600, { x: 34, y: 6, r: 6 }, { x: 96, y: 4, r: 9 }],
      ['foto-polaroids-img_1676', 34, 1200 / 1600, { x: -34, y: 4, r: -6 }, { x: -96, y: 2, r: -9 }],
      ['foto-books-img_1211', 34, 1173 / 1600, { x: 0, y: -4, r: 2 }, { x: 0, y: -12, r: 0 }],
    ],
    portada: { src: 'foto-books-img_1211', w: 1173, h: 1600 },
  },
]

export const catPorId = Object.fromEntries(categorias.map((c) => [c.id, c]))
// la categoría de un proyecto (para volver a ella al cerrar la vista)
export const catDeProyecto = (id) => categorias.find((c) => c.proyectos.includes(id))
