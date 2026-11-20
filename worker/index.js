// Worker mínimo: todo lo sirve el binding de archivos estáticos, salvo los videos.
// Los estáticos de Cloudflare no responden pedidos por partes (Range → 206) y Safari los necesita
// para reproducir un <video>; acá se corta el tramo pedido.
export default {
  async fetch(req, env) {
    const res = await env.ASSETS.fetch(req)
    if (res.status !== 200) return res
    const h = new Headers(res.headers)
    h.set('Accept-Ranges', 'bytes')
    h.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400')
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get('Range') || '')
    if (!m || (m[1] === '' && m[2] === '')) return new Response(res.body, { status: 200, headers: h })
    const buf = await res.arrayBuffer()
    const size = buf.byteLength
    let start, end
    if (m[1] === '') { start = Math.max(0, size - Number(m[2])); end = size - 1 }
    else { start = Number(m[1]); end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1) }
    if (start >= size || start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } })
    h.set('Content-Range', `bytes ${start}-${end}/${size}`)
    h.set('Content-Length', String(end - start + 1))
    return new Response(req.method === 'HEAD' ? null : buf.slice(start, end + 1), { status: 206, headers: h })
  },
}
