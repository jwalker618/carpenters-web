/* Builds two asset files from the logo embedded in Anne's invoice PDF:
   - src/assets/logo.png  — transparent wordmark + emblem
   - public/favicon.png   — just the emblem circle, square, for the tab
   pdfimages extracted the artwork as a flat RGB plus a separate alpha
   mask; this stitches them back into a single transparent PNG. */
import sharp from 'sharp';

const RGB = '/tmp/logo-000.png';
const MASK = '/tmp/logo-001.png';

const { data: rgb, info } = await sharp(RGB)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { data: mask } = await sharp(MASK)
  .resize(info.width, info.height)
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, n = info.width * info.height; i < n; i++) {
  out[i * 4] = rgb[i * 4];
  out[i * 4 + 1] = rgb[i * 4 + 1];
  out[i * 4 + 2] = rgb[i * 4 + 2];
  // The PDF mask is inverted relative to alpha (white = visible).
  out[i * 4 + 3] = mask[i];
}

const channels = 4;
const composed = sharp(out, {
  raw: { width: info.width, height: info.height, channels },
});

await composed
  .clone()
  .png({ compressionLevel: 9 })
  .toFile(new URL('../src/assets/logo.png', import.meta.url).pathname);

// Emblem-only square crop for the favicon and other small-mark uses.
// The emblem circle sits in the right ~55% of the artwork.
const emblemSize = info.height; // 642
const emblemLeft = info.width - emblemSize - 30; // a small inset from the right
await composed
  .clone()
  .extract({
    left: Math.max(0, emblemLeft),
    top: 0,
    width: emblemSize,
    height: emblemSize,
  })
  .resize(512, 512)
  .png({ compressionLevel: 9 })
  .toFile(new URL('../public/favicon.png', import.meta.url).pathname);

console.log('wrote src/assets/logo.png and public/favicon.png');
