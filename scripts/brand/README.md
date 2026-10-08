# Logo de Xpertos

Fuente de verdad del logo en SVG, recreado a partir del diseño original.

El logo tiene **dos versiones**: el completo (casa + XPERTOS + lema), para pies de página e inicios
de sesión, y solo XPERTOS, para encabezados y barras. El favicon es solo la X.

- `build-logo.py` genera los SVG: `xpertos-logo.svg` (completo, con el lema "servicios a tu medida"),
  `xpertos-wordmark.svg` (solo XPERTOS), `xpertos-icon.svg` (la X, para el favicon), `xpertos-mark.svg` (casa, ícono de la app nativa) y
  `xpertos-mark-mono.svg` (casa de un color), además de `brand-logo.ts` para la app móvil.
  El texto está trazado como formas, así que no depende de fuentes instaladas.
- `make-assets.cjs` copia los SVG a las tres apps y genera los PNG (favicons, ícono de iOS,
  imagen para redes, íconos y pantalla de carga de la app) con `sharp`.

```bash
mkdir -p /tmp/xpertos-logo && python3 scripts/brand/build-logo.py /tmp/xpertos-logo
node scripts/brand/make-assets.cjs "$(cd .. && pwd)" /tmp/xpertos-logo
```

Colores: naranja `#FDA301 → #EE4400`, azul `#0A7FE6 → #01236A`, azul marino del texto `#073A8F → #00266B`.
