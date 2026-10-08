# Logo de Xpertos

Fuente de verdad del logo en SVG, recreado a partir del diseño original.

- `build-logo.py` genera los SVG: `xpertos-logo.svg` (completo, con el lema "servicios a tu medida"),
  `xpertos-horizontal.svg` (casa + XPERTOS), `xpertos-wordmark.svg`, `xpertos-mark.svg` (casa) y
  `xpertos-mark-mono.svg` (casa de un color), además de `brand-logo.ts` para la app móvil.
  El texto está trazado como formas, así que no depende de fuentes instaladas.
- `make-assets.cjs` copia los SVG a las tres apps y genera los PNG (favicons, ícono de iOS,
  imagen para redes, íconos y pantalla de carga de la app) con `sharp`.

```bash
mkdir -p /tmp/xpertos-logo && python3 scripts/brand/build-logo.py /tmp/xpertos-logo
node scripts/brand/make-assets.cjs "$(cd .. && pwd)" /tmp/xpertos-logo
```

Colores: naranja `#FDA301 → #EE4400`, azul `#0A7FE6 → #01236A`, azul marino del texto `#073A8F → #00266B`.
