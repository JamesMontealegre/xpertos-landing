// Copia los SVG de marca a las tres apps y genera los PNG (usa sharp de xpertos-landing).
// Uso: node scripts/brand/make-assets.cjs <carpeta raíz de los repos> <carpeta con los SVG generados>
const path = require('path');
const fs = require('fs');
const ROOT = process.argv[2];
const SRC = process.argv[3] || '.';
const sharp = require(path.join(ROOT, 'xpertos-landing/node_modules/sharp'));
const svg = (n) => path.join(SRC, n);

async function onCanvas(svgFile, { size, width, height, scale, bg, out }) {
  const W = width ?? size, H = height ?? size;
  const meta = await sharp(svgFile).metadata();
  const ratio = meta.width / meta.height;
  const maxW = W * scale, maxH = H * scale;
  const w = Math.round(Math.min(maxW, maxH * ratio));
  const img = await sharp(svgFile, { density: 600 }).resize({ width: w }).png().toBuffer();
  const im = await sharp(img).metadata();
  const base = sharp({ create: { width: W, height: H, channels: 4, background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 } } });
  await base.composite([{ input: img, left: Math.round((W - im.width) / 2), top: Math.round((H - im.height) / 2) }]).png().toFile(out);
  console.log(path.relative(ROOT, out), `${W}x${H}`);
}

function sync(dir, files, stale) {
  fs.mkdirSync(dir, { recursive: true });
  for (const f of files) fs.copyFileSync(svg(f), path.join(dir, f));
  for (const f of stale) fs.rmSync(path.join(dir, f), { force: true });
}

(async () => {
  const L = path.join(ROOT, 'xpertos-landing'), A = path.join(ROOT, 'xpertos-admin'), U = path.join(ROOT, 'xpertos-users');
  const white = { r: 255, g: 255, b: 255, alpha: 1 };

  // Web: dos versiones del logo (completo y solo XPERTOS) + ícono X para el favicon.
  for (const app of [L, A]) {
    sync(path.join(app, 'public/brand'), ['xpertos-logo.svg', 'xpertos-wordmark.svg', 'xpertos-icon.svg'],
      ['xpertos-horizontal.svg', 'xpertos-mark.svg', 'xpertos-mark-mono.svg']);
    fs.copyFileSync(svg('xpertos-icon.svg'), path.join(app, 'src/app/icon.svg'));
    await onCanvas(svg('xpertos-icon.svg'), { size: 180, scale: 0.78, bg: white, out: path.join(app, 'src/app/apple-icon.png') });
  }
  await onCanvas(svg('xpertos-logo.svg'), { width: 1200, height: 630, scale: 0.82, bg: white, out: path.join(L, 'src/app/opengraph-image.png') });
  // Correos: los clientes de correo no muestran SVG; PNG a 3x del ancho con que se muestra (160 px).
  await sharp(svg('xpertos-wordmark.svg'), { density: 600 }).resize({ width: 480 }).png({ compressionLevel: 9 })
    .toFile(path.join(L, 'public/brand/xpertos-wordmark.png'));

  // App: logo completo, solo XPERTOS y X (favicon web); la casa se usa en el ícono nativo.
  sync(path.join(U, 'assets/brand'), ['xpertos-logo.svg', 'xpertos-wordmark.svg', 'xpertos-icon.svg', 'xpertos-mark.svg', 'xpertos-mark-mono.svg'],
    ['xpertos-horizontal.svg']);
  fs.copyFileSync(svg('brand-logo.ts'), path.join(U, 'src/lib/brand-logo.ts'));
  const img = (n) => path.join(U, 'assets/images', n);
  await onCanvas(svg('xpertos-mark.svg'), { size: 1024, scale: 0.84, bg: white, out: img('icon.png') });
  await onCanvas(svg('xpertos-mark.svg'), { size: 1024, scale: 0.6, out: img('android-icon-foreground.png') });
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: white } }).png().toFile(img('android-icon-background.png'));
  await onCanvas(svg('xpertos-mark-mono.svg'), { size: 1024, scale: 0.6, out: img('android-icon-monochrome.png') });
  await onCanvas(svg('xpertos-logo.svg'), { width: 1024, height: 1024, scale: 0.92, out: img('splash-icon.png') });
  await onCanvas(svg('xpertos-icon.svg'), { size: 48, scale: 0.96, out: img('favicon.png') });
})();
