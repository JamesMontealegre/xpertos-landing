// Genera los PNG de marca a partir de los SVG (usa sharp de xpertos-landing).
const path = require('path');
const fs = require('fs');
const ROOT = process.argv[2];
const SRC = process.argv[3] || '.';
const sharp = require(path.join(ROOT, 'xpertos-landing/node_modules/sharp'));
const svg = (n) => path.join(SRC, n);

async function onCanvas(svgFile, { size, width, height, scale, bg, out }) {
  const W = width ?? size, H = height ?? size;
  const target = Math.round(Math.min(W, H) * scale);
  const meta = await sharp(svgFile).metadata();
  const ratio = meta.width / meta.height;
  const w = ratio >= 1 ? Math.min(Math.round(W * scale), Math.round(target * ratio)) : Math.round(target * ratio);
  const img = await sharp(svgFile, { density: 600 }).resize({ width: w }).png().toBuffer();
  const im = await sharp(img).metadata();
  const base = sharp({ create: { width: W, height: H, channels: 4, background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 } } });
  await base.composite([{ input: img, left: Math.round((W - im.width) / 2), top: Math.round((H - im.height) / 2) }]).png().toFile(out);
  console.log(path.relative(ROOT, out), `${W}x${H}`);
}

(async () => {
  const L = path.join(ROOT, 'xpertos-landing'), A = path.join(ROOT, 'xpertos-admin'), U = path.join(ROOT, 'xpertos-users');
  const white = { r: 255, g: 255, b: 255, alpha: 1 };
  const svgs = ['xpertos-logo.svg', 'xpertos-horizontal.svg', 'xpertos-wordmark.svg', 'xpertos-mark.svg', 'xpertos-mark-mono.svg'];

  for (const app of [L, A]) {
    fs.mkdirSync(path.join(app, 'public/brand'), { recursive: true });
    for (const s of svgs) fs.copyFileSync(svg(s), path.join(app, 'public/brand', s));
    fs.copyFileSync(svg('xpertos-mark.svg'), path.join(app, 'src/app/icon.svg'));
    await onCanvas(svg('xpertos-mark.svg'), { size: 180, scale: 0.86, bg: white, out: path.join(app, 'src/app/apple-icon.png') });
  }
  await onCanvas(svg('xpertos-logo.svg'), { width: 1200, height: 630, scale: 0.82, bg: white, out: path.join(L, 'src/app/opengraph-image.png') });

  fs.mkdirSync(path.join(U, 'assets/brand'), { recursive: true });
  for (const s of svgs) fs.copyFileSync(svg(s), path.join(U, 'assets/brand', s));
  fs.copyFileSync(svg('brand-logo.ts'), path.join(U, 'src/lib/brand-logo.ts'));
  const img = (n) => path.join(U, 'assets/images', n);
  await onCanvas(svg('xpertos-mark.svg'), { size: 1024, scale: 0.84, bg: white, out: img('icon.png') });
  await onCanvas(svg('xpertos-mark.svg'), { size: 1024, scale: 0.6, out: img('android-icon-foreground.png') });
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: white } }).png().toFile(img('android-icon-background.png'));
  await onCanvas(svg('xpertos-mark-mono.svg'), { size: 1024, scale: 0.6, out: img('android-icon-monochrome.png') });
  await onCanvas(svg('xpertos-logo.svg'), { width: 1024, height: 1024, scale: 0.92, out: img('splash-icon.png') });
  await onCanvas(svg('xpertos-mark.svg'), { size: 48, scale: 0.96, out: img('favicon.png') });
})();
