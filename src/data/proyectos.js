// Proyectos de Abril, sacados de su Drive (ABRU PROYECTOS).
// Títulos, disciplinas y textos: los que mandó Abril (2026-11-22).
// `piezas`: imágenes en /public/img (nombre sin extensión) con su proporción w/h.
// `tinta`: color propio de la pieza, para el título y el fondo de su vista.

export const proyectos = [
  {
    id: 'gatsby',
    titulo: 'El gran Gatsby',
    disciplina: 'Diseño de afiche e identidad visual',
    tinta: '#C9A55A',
    fondo: '#0F2A22',
    texto: 'Desarrollo de un afiche promocional para el estreno de la película El Gran Gatsby, tomando como punto de partida la estética del Art Déco. La propuesta construye una identidad visual inspirada en sus formas geométricas, ornamentación y elegancia, adaptando el lenguaje gráfico de la época a una pieza de comunicación cinematográfica.',
    piezas: [
      { src: 'gatsby', w: 1273, h: 1800, alt: 'Afiche de El gran Gatsby: silueta de espaldas frente a la bahía con marco art déco dorado' },
    ],
    detalle: { src: 'gatsby', pos: '50% 18%' },
  },
  {
    id: 'dictador',
    titulo: 'El gran dictador',
    disciplina: 'Diseño de afiche cinematográfico',
    tinta: '#F2C200',
    fondo: '#141414',
    texto: 'Diseño de un afiche para la película El gran dictador, de Charles Chaplin, incorporando las leyes de la Gestalt como recurso para construir la composición y reforzar su identidad visual. La propuesta utiliza una paleta cromática vinculada al contexto histórico y político de la película, tomando como referencia los colores asociados a la Alemania de la época para transmitir su atmósfera y mensaje.',
    piezas: [
      { src: 'dictador', w: 1273, h: 1800, alt: 'Afiche de El gran dictador: mano negra que sostiene el globo terráqueo sobre fondo amarillo' },
    ],
    detalle: { src: 'dictador', pos: '50% 70%' },
  },
  {
    id: 'morfologia',
    titulo: 'Módulo de alas',
    disciplina: 'Diseño morfológico',
    tinta: '#F6D3DA',
    fondo: '#141414',
    texto: 'Desarrollo de un módulo gráfico a partir de la exploración y síntesis morfológica de las alas de un hada. El proyecto busca simplificar su estructura formal, identificando y reduciendo sus elementos principales para construir una unidad visual que conserve su esencia y permita generar distintas composiciones.',
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
    disciplina: 'Diseño editorial y comunicación visual',
    tinta: '#2B030C',
    fondo: '#E8742A',
    texto: 'Desarrollo de un prototipo de folleto de 10 × 15 cm, diseñado en formato frente y dorso, junto con una propuesta de volante para vía pública. El proyecto busca comunicar la identidad de Atalaya a través de piezas gráficas claras, atractivas y coherentes con la marca.',
    piezas: [
      { src: 'atalaya-frente', w: 1376, h: 2000, alt: 'Folleto de Atalaya con medialunas y franja celeste y blanca' },
      { src: 'atalaya-combo', w: 1376, h: 2000, alt: 'Folleto de combo merienda de Atalaya' },
    ],
    detalle: { src: 'atalaya-combo', pos: '50% 45%' },
  },
  {
    id: 'futttura',
    titulo: 'Futttura',
    disciplina: 'Diseño editorial y comunicación visual',
    tinta: '#F6D3DA',
    fondo: '#14223A',
    texto: 'Desarrollo de un prototipo de folleto tríptico A4, con diseño de frente y dorso, a partir de una propuesta que lleva la identidad de Futttura al Movistar Arena. La pieza fue pensada como una guía informativa para el público, reuniendo los datos más relevantes de manera clara, visual y accesible.',
    piezas: [
      { src: 'futttura-tour', w: 2000, h: 1419, alt: 'Afiche de la gira Futttura de Tini' },
      { src: 'futttura-mapa', w: 2000, h: 1419, alt: 'Mapa del Movistar Arena con ubicaciones, merch y objetos prohibidos' },
    ],
    detalle: { src: 'futttura-mapa', pos: '45% 50%' },
  },
  {
    id: 'principito',
    titulo: 'El Principito',
    disciplina: 'Sistema de juego de cartas',
    tinta: '#B7D96B',
    fondo: '#1E2B5A',
    texto: 'Diseño de un sistema de juego de cartas inspirado en El Principito, que reinterpreta el universo de la obra a través de un mundo de alienígenas que habitan distintos planetas y representan los roles de sus personajes. La propuesta combina narrativa e identidad visual para crear una experiencia lúdica, donde cada carta forma parte de un sistema gráfico coherente y reconocible.',
    piezas: [
      { src: 'principito-caja', w: 2000, h: 1548, alt: 'Troquel de la caja del mazo de El Principito' },
      { src: 'principito-personajes', w: 2000, h: 1376, alt: 'Personajes ilustrados: el geógrafo, el farolero y el vanidoso' },
    ],
    detalle: { src: 'principito-caja', pos: '50% 50%' },
  },
  {
    id: 'trago',
    titulo: 'El último trago',
    disciplina: 'Diseño de vinilo',
    tinta: '#F6D3DA',
    fondo: '#3E4D51',
    texto: 'Diseño de una propuesta gráfica para la portada de un vinilo inspirado en la canción El último trago, de Andrés Calamaro. El proyecto explora la aplicación de recursos retóricos visuales para interpretar y transmitir el sentido de la canción a través de imágenes, símbolos y elementos gráficos, construyendo una identidad visual que acompaña su narrativa y carga emocional.',
    piezas: [
      { src: 'vinilo-tapa', w: 2400, h: 1200, alt: 'Tapa y contratapa del vinilo En el último trago' },
      { src: 'vinilo-interior', w: 2400, h: 1200, alt: 'Interior del vinilo con retrato pintado y la frase Siempre caigo en los mismos errores' },
    ],
    detalle: { src: 'vinilo-tapa', pos: '75% 50%' },
  },
  {
    id: 'tinta90',
    titulo: 'Tinta 90',
    disciplina: 'Diseño de portada de disco',
    tinta: '#7FA8D9',
    fondo: '#0F1530',
    texto: 'Diseño de una propuesta gráfica para la portada de la canción Tinta 90, de TINI, utilizando recursos de retórica visual para interpretar y representar los conceptos y emociones presentes en la letra. La composición busca traducir el mensaje de la canción a un lenguaje visual propio, mediante elementos simbólicos y decisiones gráficas que refuerzan su identidad.',
    piezas: [
      { src: 'tinta90', w: 1080, h: 1080, alt: 'Portada Tinta 90: retrato en línea celeste con un cassette en la frente' },
    ],
    detalle: { src: 'tinta90', pos: '50% 50%' },
  },
  {
    id: 'avira',
    titulo: 'Avira',
    disciplina: 'Afiche publicitario y realidad aumentada',
    tinta: '#F6D3DA',
    fondo: '#3A1A12',
    texto: 'Diseño de un afiche publicitario para una campaña de seguros de vida de Avira, incorporando recursos retóricos visuales para transmitir el concepto de protección y seguridad. La propuesta integra un código QR que permite acceder a una experiencia de realidad aumentada, combinando comunicación gráfica e interacción digital.',
    piezas: [
      { src: 'avira', w: 1273, h: 1800, alt: 'Afiche de Avira: pared de ladrillos con un hueco y la frase Que tu ausencia no desarme lo que construiste' },
    ],
    detalle: { src: 'avira', pos: '50% 35%' },
  },
  {
    id: 'winx',
    titulo: 'Winx',
    disciplina: 'Diseño de afiche para vía pública',
    tinta: '#F6D3DA',
    fondo: '#24402C',
    texto: 'Diseño de un afiche de exterior inspirado en la serie Winx, enfocado en generar un fuerte impacto visual a través de sus elementos más representativos. La propuesta busca sintetizar la identidad de la serie en una composición atractiva y reconocible, capaz de captar la atención del público en una primera impresión.',
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
    texto: 'Desarrollo de una sesión fotográfica de producto orientada a destacar su esencia, características y detalles. A través de la iluminación, la composición y la dirección visual, se busca resaltar sus cualidades y construir imágenes atractivas que comuniquen su identidad y valor.',
    piezas: [
      { src: 'foto-productos-pink-p', w: 1111, h: 1600, alt: 'Exfoliante Coco Scrub de Pink entre flores sobre fondo naranja y rosa' },
      { src: 'foto-productos-pink-j', w: 1130, h: 1600, alt: 'Exfoliante Coco Scrub de Pink rodeado de flores' },
      { src: 'foto-productos-img_0053', w: 1200, h: 1600, alt: 'Maquillaje sobre fondo rosa con cortina de brillos' },
    ],
    detalle: { src: 'foto-productos-pink-j', pos: '50% 40%' },
  },
  {
    id: 'tarot',
    titulo: 'Tarot',
    disciplina: 'Cartas de tarot',
    tinta: '#E9B85C',
    fondo: '#123A24',
    texto: 'Se desarrollaron cuatro cartas de tarot, cada una representando un arcano diferente, tomando como inspiración pinturas del movimiento surrealista. A partir de sus elementos visuales y simbólicos, se reinterpretaron las obras para crear una propuesta gráfica que combina el universo del tarot con la estética surrealista.',
    piezas: [
      { src: 'tarot-mago', w: 945, h: 1417, alt: 'Carta de tarot El Mago' },
      { src: 'tarot-amantes', w: 945, h: 1417, alt: 'Carta de tarot Los Amantes' },
      { src: 'tarot-fuerza', w: 945, h: 1417, alt: 'Carta de tarot La Fuerza' },
      { src: 'tarot-diablo', w: 945, h: 1418, alt: 'Carta de tarot El Diablo' },
    ],
    detalle: { src: 'tarot-mago', pos: '50% 40%' },
  },
]

// Los que se muestran grandes, con el título partido al medio.
export const destacados = ['atalaya', 'gatsby', 'dictador', 'morfologia', 'trago', 'futttura', 'avira', 'winx']

export const porId = Object.fromEntries(proyectos.map((p) => [p.id, p]))

// Coherencia de color: el marco de cada proyecto usa solo los tonos del sitio, en orden.
// Las piezas mantienen sus colores reales; lo que se unifica es el fondo donde se apoyan.
// (Los campos fondo/tinta de cada proyecto quedan como referencia del color propio de la pieza.)
export const temas = [
  { fondo: '#B00F34', tinta: '#FDEEF1' }, // cherry
  { fondo: '#F6D3DA', tinta: '#2B030C' }, // rosa
  { fondo: '#2B030C', tinta: '#F6D3DA' }, // bordó
  { fondo: '#FDEEF1', tinta: '#B00F34' }, // rosa claro
]
export const temaDe = (id) => {
  const i = destacados.indexOf(id)
  return temas[(i < 0 ? 0 : i) % temas.length]
}

// Ficha de cada proyecto: COMPLETAR CON ABRIL. Lo que quede vacío no se muestra.
// para: materia, cátedra o cliente (real o ficticio) · hice: qué hizo ella · herramientas · anio
export const fichas = {
  atalaya: { para: '', hice: '', herramientas: '', anio: '' },
  gatsby: { para: '', hice: '', herramientas: '', anio: '' },
  dictador: { para: '', hice: '', herramientas: '', anio: '' },
  morfologia: { para: '', hice: '', herramientas: '', anio: '' },
  trago: { para: '', hice: '', herramientas: '', anio: '' },
  futttura: { para: '', hice: '', herramientas: '', anio: '' },
  avira: { para: '', hice: '', herramientas: '', anio: '' },
  winx: { para: '', hice: '', herramientas: '', anio: '' },
  principito: { para: '', hice: '', herramientas: '', anio: '' },
  tinta90: { para: '', hice: '', herramientas: '', anio: '' },
  pink: { para: '', hice: '', herramientas: '', anio: '' },
  tarot: { para: '', hice: '', herramientas: '', anio: '' },
}
