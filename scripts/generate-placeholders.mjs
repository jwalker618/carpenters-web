/* Procedural wood-grain placeholder generator.
   Produces JPGs that look like photographed timber rather than flat
   gradient cards. Each image gets layered sine-based grain, a touch of
   pixel grain, and a soft vignette. Re-run with `node
   scripts/generate-placeholders.mjs`; replace any file in src/assets/
   with a real photo whenever one is ready. */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const W = 1600;
const H = 1100;

const projectsOut = new URL('../src/assets/projects/', import.meta.url);
await mkdir(projectsOut, { recursive: true });

// Seeded PRNG so the same filename always produces the same image.
function rng(seed) {
  let s = seed | 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h;
}

const tones = {
  // [highlight rgb, shadow rgb] — sampled to feel like the named wood
  walnut: [
    [108, 78, 56],
    [54, 34, 22],
  ],
  oak: [
    [188, 152, 110],
    [120, 86, 52],
  ],
  ash: [
    [156, 124, 92],
    [88, 64, 42],
  ],
  workshop: [
    [120, 96, 72],
    [42, 32, 22],
  ],
  portrait: [
    [142, 108, 80],
    [70, 50, 36],
  ],
};

function grainBuffer({ width, height, tone, seed }) {
  const rand = rng(seed);
  const [hi, lo] = tone;
  const buf = Buffer.alloc(width * height * 3);

  // Pre-bake the per-column wood-grain noise so it's identical for
  // every row — that's what gives the "vertical grain" feel.
  const colour = new Float32Array(width);
  const phases = [
    rand() * Math.PI * 2,
    rand() * Math.PI * 2,
    rand() * Math.PI * 2,
    rand() * Math.PI * 2,
  ];
  for (let x = 0; x < width; x++) {
    const n =
      Math.sin(x * 0.018 + phases[0]) * 0.42 +
      Math.sin(x * 0.062 + phases[1]) * 0.26 +
      Math.sin(x * 0.17 + phases[2]) * 0.16 +
      Math.sin(x * 0.41 + phases[3]) * 0.1 +
      Math.sin(x * 0.83) * Math.sin(x * 1.13) * 0.06;
    colour[x] = n * 0.5 + 0.5; // 0..1
  }

  for (let y = 0; y < height; y++) {
    // Subtle horizontal undulation — like looking at a board where
    // grain bends gently along the length.
    const sway = Math.sin(y * 0.004) * 6 + Math.sin(y * 0.013) * 3;
    for (let x = 0; x < width; x++) {
      const xc = Math.max(0, Math.min(width - 1, Math.round(x + sway)));
      let n = colour[xc];
      // Per-pixel grit
      n += (rand() - 0.5) * 0.06;
      n = Math.max(0, Math.min(1, n));
      const i = (y * width + x) * 3;
      buf[i] = Math.round(lo[0] + (hi[0] - lo[0]) * n);
      buf[i + 1] = Math.round(lo[1] + (hi[1] - lo[1]) * n);
      buf[i + 2] = Math.round(lo[2] + (hi[2] - lo[2]) * n);
    }
  }
  return buf;
}

function vignetteSvg(width, height, strength = 0.45) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <radialGradient id="v" cx="50%" cy="50%" r="72%">
        <stop offset="55%" stop-color="black" stop-opacity="0"/>
        <stop offset="100%" stop-color="black" stop-opacity="${strength}"/>
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#v)"/>
  </svg>`);
}

async function make(path, tone, { vignette = 0.45, blur = 0.6 } = {}) {
  const seed = hashString(path);
  const grain = grainBuffer({ width: W, height: H, tone, seed });
  const base = sharp(grain, { raw: { width: W, height: H, channels: 3 } });
  await base
    .composite([{ input: vignetteSvg(W, H, vignette), blend: 'multiply' }])
    .blur(blur)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(new URL(path, import.meta.url).pathname);
  console.log('wrote', path);
}

// Hero + portrait — set inside the project lists below would be ugly;
// keep them at the top alongside the per-project sets.
await make('../src/assets/hero.jpg', tones.workshop, { vignette: 0.55 });
await make('../src/assets/about-portrait.jpg', tones.portrait, {
  vignette: 0.4,
});

const sets = [
  ['walnut-dining-table', tones.walnut],
  ['oak-bookshelf-cabinet', tones.oak],
  ['vintage-rocking-chair', tones.ash],
];

for (const [base, tone] of sets) {
  await make(`../src/assets/projects/${base}-cover.jpg`, tone);
  for (let i = 1; i <= 3; i++) {
    await make(`../src/assets/projects/${base}-${i}.jpg`, tone);
  }
}
