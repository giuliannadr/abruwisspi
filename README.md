# Abril Wisspi · Portfolio

Portfolio de Abril Wisspi, estudiante de diseño gráfico.

- Vite + React 19 + Tailwind 4, GSAP + ScrollTrigger, Lenis y Motion.
- Contenido en `src/data/` (proyectos, fotos, piezas de la portada) y configuración en `src/data/site.js` (mail, redes, CV).
- Imágenes optimizadas en `public/img` (WebP) y texturas en `public/tex` (recortes en semitono y grano).

```bash
npm install
npm run dev      # http://127.0.0.1:5192
npm run build
npx wrangler deploy   # publica dist/ en Cloudflare Workers
```
