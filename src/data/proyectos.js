// Proyectos de Abril, sacados de su Drive (ABRU PROYECTOS).
// Los textos son PROPUESTOS a partir de las piezas: confirmarlos con ella.
// `piezas`: imágenes en /public/img (nombre sin extensión) con su proporción w/h.
// `tinta`: color propio de la pieza, para el título y el fondo de su vista.

export const proyectos = [
  {
    id: 'gatsby',
    titulo: 'El gran Gatsby',
    disciplina: 'Afiche de cine',
    tinta: '#C9A55A',
    fondo: '#0F2A22',
    texto: 'Afiche para el reestreno de la película de Baz Luhrmann. Un Gatsby de espaldas frente a la bahía y un marco art déco que toma la tipografía de los años veinte.',
    piezas: [
      { src: 'gatsby', w: 1273, h: 1800, alt: 'Afiche de El gran Gatsby: silueta de espaldas frente a la bahía con marco art déco dorado' },
    ],
    detalle: { src: 'gatsby', pos: '50% 18%' },
  },
  {
    id: 'dictador',
    titulo: 'El gran dictador',
    disciplina: 'Afiche de cine',
    tinta: '#F2C200',
    fondo: '#141414',
    texto: 'Afiche para la película de Chaplin. Una mano negra sostiene el mundo como un juguete, sobre un amarillo plano y una tipografía condensada roja.',
    piezas: [
      { src: 'dictador', w: 1273, h: 1800, alt: 'Afiche de El gran dictador: mano negra que sostiene el globo terráqueo sobre fondo amarillo' },
    ],
    detalle: { src: 'dictador', pos: '50% 70%' },
  },
  {
    id: 'morfologia',
    titulo: 'Morfología',
    disciplina: 'Retícula y módulo',
    tinta: '#F6D3DA',
    fondo: '#141414',
    texto: 'Un módulo de alas que se repite, gira y se desarma. Tres láminas que van del módulo solo a la trama completa.',
    piezas: [
      { src: 'morfologia-1', w: 1273, h: 1800, alt: 'Módulo de alas negras sobre blanco' },
      { src: 'morfologia-2', w: 1273, h: 1800, alt: 'Trama en espiral hecha con el módulo de alas' },
      { src: 'morfologia-3', w: 1273, h: 1800, alt: 'Alas que se desprenden de una trama densa' },
    ],
    detalle: { src: 'morfologia-2', pos: '50% 50%' },
  },
  {
    id: 'atalaya',
    titulo: 'Atalaya',
    disciplina: 'Folletos',
    tinta: '#2B030C',
    fondo: '#E8742A',
    texto: 'Folleto para el parador Atalaya: naranja, la franja celeste y blanca, medialunas en primer plano y un combo merienda con precio a la vista.',
    piezas: [
      { src: 'atalaya-frente', w: 1376, h: 2000, alt: 'Folleto de Atalaya con medialunas y franja celeste y blanca' },
      { src: 'atalaya-combo', w: 1376, h: 2000, alt: 'Folleto de combo merienda de Atalaya' },
    ],
    detalle: { src: 'atalaya-combo', pos: '50% 45%' },
  },
  {
    id: 'futttura',
    titulo: 'Futttura',
    disciplina: 'Gráfica de gira',
    tinta: '#F6D3DA',
    fondo: '#14223A',
    texto: 'Piezas para la gira de Tini en el Movistar Arena: el afiche del show y un mapa del estadio con el merch y los objetos prohibidos.',
    piezas: [
      { src: 'futttura-tour', w: 2000, h: 1419, alt: 'Afiche de la gira Futttura de Tini' },
      { src: 'futttura-mapa', w: 2000, h: 1419, alt: 'Mapa del Movistar Arena con ubicaciones, merch y objetos prohibidos' },
    ],
    detalle: { src: 'futttura-mapa', pos: '45% 50%' },
  },
  {
    id: 'principito',
    titulo: 'El Principito',
    disciplina: 'Cartas y caja',
    tinta: '#B7D96B',
    fondo: '#1E2B5A',
    texto: 'Un mazo coleccionable con los personajes de los planetas. Cada carta tiene su frase y tres palabras que lo definen; el dorso es su objeto.',
    piezas: [
      { src: 'principito-caja', w: 2000, h: 1548, alt: 'Troquel de la caja del mazo de El Principito' },
      { src: 'principito-personajes', w: 2000, h: 1376, alt: 'Personajes ilustrados: el geógrafo, el farolero y el vanidoso' },
    ],
    detalle: { src: 'principito-caja', pos: '50% 50%' },
  },
  {
    id: 'trago',
    titulo: 'En el último trago',
    disciplina: 'Vinilo',
    tinta: '#F6D3DA',
    fondo: '#3E4D51',
    texto: 'Tapa e interior de un vinilo para Calamaro. Una copa de vino con dos personas sentadas en el borde y una barra llena de botellas.',
    piezas: [
      { src: 'vinilo-tapa', w: 2400, h: 1200, alt: 'Tapa y contratapa del vinilo En el último trago' },
      { src: 'vinilo-interior', w: 2400, h: 1200, alt: 'Interior del vinilo con retrato pintado y la frase Siempre caigo en los mismos errores' },
    ],
    detalle: { src: 'vinilo-tapa', pos: '75% 50%' },
  },
  {
    id: 'tinta90',
    titulo: 'Tinta 90',
    disciplina: 'Portada de disco',
    tinta: '#7FA8D9',
    fondo: '#0F1530',
    texto: 'Portada para un disco de Tini. Un retrato hecho solo con línea, con un cassette en la frente.',
    piezas: [
      { src: 'tinta90', w: 1080, h: 1080, alt: 'Portada Tinta 90: retrato en línea celeste con un cassette en la frente' },
    ],
    detalle: { src: 'tinta90', pos: '50% 50%' },
  },
  {
    id: 'avira',
    titulo: 'Avira',
    disciplina: 'Afiche de campaña',
    tinta: '#F6D3DA',
    fondo: '#3A1A12',
    texto: 'Afiche para una campaña de seguridad: una pared de ladrillos con un hueco y una frase que se lee de dos maneras.',
    piezas: [
      { src: 'avira', w: 1273, h: 1800, alt: 'Afiche de Avira: pared de ladrillos con un hueco y la frase Que tu ausencia no desarme lo que construiste' },
    ],
    detalle: { src: 'avira', pos: '50% 35%' },
  },
  {
    id: 'winx',
    titulo: 'Winx',
    disciplina: 'Ilustración',
    tinta: '#F6D3DA',
    fondo: '#24402C',
    texto: 'Ilustración a mano de una de las hadas Winx, sentada en una rama entre flores.',
    piezas: [
      { src: 'winx', w: 1279, h: 1800, alt: 'Ilustración pintada de un hada Winx con alas rosas sentada entre flores' },
    ],
    detalle: { src: 'winx', pos: '50% 35%' },
  },
  {
    id: 'pink',
    titulo: 'Pink',
    disciplina: 'Fotografía de producto',
    tinta: '#FDE6EB',
    fondo: '#D9346B',
    texto: 'Fotos de producto para un exfoliante de coco: fondo plano, flores de verdad y el pomo en el centro.',
    piezas: [
      { src: 'foto-productos-pink-p', w: 1111, h: 1600, alt: 'Exfoliante Coco Scrub de Pink entre flores sobre fondo naranja y rosa' },
      { src: 'foto-productos-pink-j', w: 1130, h: 1600, alt: 'Exfoliante Coco Scrub de Pink rodeado de flores' },
      { src: 'foto-productos-img_0053', w: 1200, h: 1600, alt: 'Maquillaje sobre fondo rosa con cortina de brillos' },
    ],
    detalle: { src: 'foto-productos-pink-j', pos: '50% 40%' },
  },
]

// Los que se muestran grandes, con el título partido al medio.
export const destacados = ['atalaya', 'gatsby', 'dictador', 'morfologia', 'trago', 'futttura', 'avira', 'winx']

export const porId = Object.fromEntries(proyectos.map((p) => [p.id, p]))
