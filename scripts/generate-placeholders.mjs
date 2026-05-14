/* Generates warm-toned placeholder photos so the site renders without
   real photography. Run with `node scripts/generate-placeholders.mjs`.
   Replace the files in src/assets/ with real photos when ready. */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const out = new URL('../src/assets/', import.meta.url);
const projectsOut = new URL('../src/assets/projects/', import.meta.url);
await mkdir(projectsOut, { recursive: true });

// Warm wood-ish palettes: [top, bottom, label colour]
const tones = {
  hero: ['#6b4a2f', '#3a2a1c', '#f6f1e9'],
  portrait: ['#7a5c3e', '#4a3826', '#f6f1e9'],
  walnut: ['#4a3526', '#2a1d14', '#e9dcc8'],
  oak: ['#a07d4f', '#6b4f30', '#2c241c'],
  chair: ['#8a6440', '#5a3f28', '#f6f1e9'],
};

function svg(label, [top, bottom, ink]) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${top}"/>
        <stop offset="1" stop-color="${bottom}"/>
      </linearGradient>
    </defs>
    <rect width="1600" height="1100" fill="url(#g)"/>
    <rect x="40" y="40" width="1520" height="1020" fill="none" stroke="${ink}" stroke-opacity="0.35" stroke-width="2"/>
    <text x="800" y="540" font-family="Georgia, serif" font-size="64" fill="${ink}" text-anchor="middle">${label}</text>
    <text x="800" y="600" font-family="Georgia, serif" font-size="26" fill="${ink}" fill-opacity="0.7" text-anchor="middle">placeholder — replace with a real photo</text>
  </svg>`);
}

async function make(path, label, tone) {
  await sharp(svg(label, tone)).jpeg({ quality: 82 }).toFile(new URL(path, import.meta.url).pathname);
  console.log('wrote', path);
}

await make('../src/assets/hero.jpg', 'Workshop Hero', tones.hero);
await make('../src/assets/about-portrait.jpg', 'The Carpenter', tones.portrait);

const sets = [
  ['walnut-dining-table', 'Walnut Dining Table', tones.walnut],
  ['oak-bookshelf-cabinet', 'Oak Bookshelf Cabinet', tones.oak],
  ['vintage-rocking-chair', 'Restored Rocking Chair', tones.chair],
];

for (const [base, label, tone] of sets) {
  await make(`../src/assets/projects/${base}-cover.jpg`, label, tone);
  for (let i = 1; i <= 3; i++) {
    await make(`../src/assets/projects/${base}-${i}.jpg`, `${label} ${i}`, tone);
  }
}
