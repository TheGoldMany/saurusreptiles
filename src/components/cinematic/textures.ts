import * as THREE from "three";

/** Small deterministic PRNG so generated surfaces are stable across renders. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Procedurally draws a hardwood grain map on a 2D canvas.
 *
 * Generating this at runtime keeps the scene entirely self-contained — no
 * texture files to fetch, so the viewer never sees an untextured frame while
 * an asset loads. The map is near-white with darker streaks so it multiplies
 * cleanly against whichever veneer colour is selected.
 */
export function makeWoodGrainTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(20260916);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  // Broad cathedral figure
  for (let i = 0; i < 14; i++) {
    const y = rand() * size;
    ctx.strokeStyle = `rgba(120,90,55,${0.05 + rand() * 0.05})`;
    ctx.lineWidth = 8 + rand() * 26;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += size / 16) {
      ctx.lineTo(x, y + Math.sin((x / size) * Math.PI * 2 + i) * 18);
    }
    ctx.stroke();
  }

  // Fine pore lines
  for (let i = 0; i < 260; i++) {
    const y = rand() * size;
    ctx.strokeStyle = `rgba(0,0,0,${0.02 + rand() * 0.08})`;
    ctx.lineWidth = 0.4 + rand() * 1.8;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += size / 24) {
      ctx.lineTo(
        x,
        y + Math.sin((x / size) * Math.PI * 2 + i * 0.4) * 5 + (rand() - 0.5) * 2.5
      );
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * A mottled grayscale map used as a roughness/vari-tone map on the carved
 * rock so the slate reads as layered stone rather than flat plastic.
 */
export function makeRockTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(77321);

  ctx.fillStyle = "#b0b0b0";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 1400; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 1 + rand() * 7;
    const v = Math.floor(90 + rand() * 130);
    ctx.fillStyle = `rgba(${v},${v},${v},${0.18 + rand() * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Horizontal sediment banding
  for (let i = 0; i < 40; i++) {
    const y = rand() * size;
    ctx.fillStyle = `rgba(60,60,60,${0.05 + rand() * 0.12})`;
    ctx.fillRect(0, y, size, 1 + rand() * 3);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 2;
  return tex;
}

export { mulberry32 };
