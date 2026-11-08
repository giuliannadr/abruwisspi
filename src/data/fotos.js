// Fotografía de Abril (Drive: FOTOGRAFÍA y REELS), separada en proyectos.
// Las bajadas son PROPUESTAS a partir de las fotos: confirmarlas con ella.

const serie = (cat, ids, w = 1200, h = 1600) =>
  ids.map(([id, ww, hh]) => ({ src: `foto-${cat}-${id}`, w: ww ?? w, h: hh ?? h }))

export const series = [
  {
    id: 'diner',
    nombre: 'Book diner',
    bajada: 'Un book en un diner de los cincuenta: campera de cuero, pañuelo rojo y milkshake.',
    alt: 'Retrato en un diner de los cincuenta, con campera de cuero y pañuelo rojo',
    fondo: 'cherry',
    fotos: serie('books', [
      ['img_1211', 1173], ['img_1167', 1102], ['img_1257', 1230], ['img_1235', 1210],
      ['img_1177', 1112], ['img_1283', 1128], ['img_1314', 1229], ['img_1225', 1230],
      ['img_1359', 1213], ['img_1219', 1190], ['img_1327', 1188], ['img_1236', 1280],
    ]),
  },
  {
    id: 'estudio',
    nombre: 'Estudio',
    bajada: 'Retratos sobre fondo blanco, en color y en blanco y negro.',
    alt: 'Retrato de estudio sobre fondo blanco, remera blanca y jean',
    fondo: 'claro',
    fotos: serie('polaroids', [
      ['img_1676'], ['img_1665-3'], ['img_1789-2', 1134], ['img_1681', 1227], ['img_1735', 1102],
      ['img_1705-2'], ['img_1792', 1123], ['img_1810-2', 1196], ['img_1919-2', 921], ['1dcc5211-8ff', 1084, 1451],
    ]),
  },
  {
    id: 'producto',
    nombre: 'Producto',
    bajada: 'Pink y maquillaje: fondos planos, flores de verdad y el producto en el centro.',
    alt: 'Foto de producto sobre fondo de color con flores',
    fondo: 'claro',
    fotos: [
      { src: 'foto-productos-pink-p', w: 1111, h: 1600 },
      { src: 'foto-productos-pink-j', w: 1130, h: 1600 },
      { src: 'foto-productos-img_0053', w: 1200, h: 1600 },
    ],
  },
  {
    id: 'reposteria',
    nombre: 'Repostería',
    bajada: 'Postres en vaso, macarons y tortas, con luz de ventana.',
    alt: 'Foto de repostería sobre tabla de madera',
    fondo: 'claro',
    fotos: serie('reposteria', [
      ['img_4180', 1350], ['img_1420', 1276], ['img_4176', 1282], ['img_3051', 1313],
      ['img_4267', 1403], ['img_4182', 1210], ['img_4153', 1600, 1200],
    ]),
  },
]

// Reels para una repostería (sin sonido, en loop).
export const reels = [
  { id: 'shots', titulo: 'Shots dulces', alt: 'Reel: shots de postre con galletitas y crema' },
  { id: 'cookies', titulo: 'Unboxing de cookies', alt: 'Reel: manos que abren una bolsa de galletitas craqueladas' },
  { id: 'feria', titulo: 'Hoy estamos de feria', alt: 'Reel: cartel de la repostería en una feria nocturna' },
]

// Mazo de El Principito: frente y dorso de cada carta.
export const cartas = [
  { id: 'geografo', nombre: 'El geógrafo', w: 769, h: 1200 },
  { id: 'vanidoso', nombre: 'El vanidoso', w: 764, h: 1200 },
  { id: 'farolero', nombre: 'El farolero', w: 760, h: 1200 },
]
