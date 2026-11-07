// Configuración del sitio en un solo lugar.
// PENDIENTE: confirmar con Abril apellido, mail, Instagram y CV.
// Los links vacíos ('') no se muestran en la página.
export const site = {
  nombre: 'Abril',
  apellido: 'Wisspi',
  rol: 'Estudiante de diseño gráfico',
  frase: 'Diseño afiches, packaging, discos y piezas para redes. También saco las fotos.',
  mail: '',
  instagram: '',
  behance: '',
  cv: '',
}

export const img = (name, size = '') => `/img/${name}${size ? `-${size}` : ''}.webp`
