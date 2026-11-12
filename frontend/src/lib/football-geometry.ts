// Truncated icosahedron (the classic football: 12 pentagons + 20 hexagons) on a unit sphere.
// Each face outline is subdivided and re-projected onto the sphere so seams curve naturally.

type Vec3 = [number, number, number];

export type BallFace = { center: Vec3; points: Vec3[]; pentagon: boolean };

const PHI = (1 + Math.sqrt(5)) / 2;

const norm = (v: Vec3): Vec3 => {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
};
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const cyclic = ([a, b, c]: Vec3): Vec3[] => [[a, b, c], [b, c, a], [c, a, b]];
const signed = (v: Vec3): Vec3[] =>
  v.reduce<number[][]>((acc, c) => acc.flatMap((o) => (c === 0 ? [[...o, 0]] : [[...o, c], [...o, -c]])), [[]]) as Vec3[];

export function buildBallFaces(subdivisions = 6): BallFace[] {
  const vertices: Vec3[] = [];
  for (const base of [[0, 1, 3 * PHI], [1, 2 + PHI, 2 * PHI], [PHI, 2, 2 * PHI + 1]] as Vec3[]) {
    for (const s of signed(base)) for (const p of cyclic(s)) vertices.push(norm(p));
  }

  // Pentagons sit on the 12 icosahedron vertices…
  const pentCenters: Vec3[] = [];
  for (const s of signed([0, 1, PHI])) for (const p of cyclic(s)) pentCenters.push(norm(p));

  // …hexagons on the 20 icosahedron faces (triples of mutually adjacent pentagon centres).
  const adjacentDot = 1 / Math.sqrt(5);
  const adjacent = (a: Vec3, b: Vec3) => Math.abs(dot(a, b) - adjacentDot) < 1e-6;
  const hexCenters: Vec3[] = [];
  for (let i = 0; i < 12; i++)
    for (let j = i + 1; j < 12; j++)
      for (let k = j + 1; k < 12; k++) {
        const [a, b, c] = [pentCenters[i], pentCenters[j], pentCenters[k]];
        if (adjacent(a, b) && adjacent(b, c) && adjacent(a, c)) {
          hexCenters.push(norm([a[0] + b[0] + c[0], a[1] + b[1] + c[1], a[2] + b[2] + c[2]]));
        }
      }

  const face = (center: Vec3, n: number): BallFace => {
    const ring = vertices
      .map((v) => [dot(v, center), v] as const)
      .sort((a, b) => b[0] - a[0])
      .slice(0, n)
      .map(([, v]) => v);
    const u = norm(ring[0].map((x, i) => x - dot(ring[0], center) * center[i]) as Vec3);
    const w = cross(center, u);
    ring.sort((a, b) => Math.atan2(dot(a, w), dot(a, u)) - Math.atan2(dot(b, w), dot(b, u)));

    const points: Vec3[] = [];
    for (let i = 0; i < n; i++) {
      const a = ring[i];
      const b = ring[(i + 1) % n];
      for (let s = 0; s < subdivisions; s++) {
        const t = s / subdivisions;
        points.push(norm([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]));
      }
    }
    return { center, points, pentagon: n === 5 };
  };

  return [...hexCenters.map((c) => face(c, 6)), ...pentCenters.map((c) => face(c, 5))];
}

/** Rotation: spin around Y, then a fixed tilt around X and Z. */
export function makeRotation(theta: number, tiltX: number, tiltZ: number) {
  const cy = Math.cos(theta), sy = Math.sin(theta);
  const cx = Math.cos(tiltX), sx = Math.sin(tiltX);
  const cz = Math.cos(tiltZ), sz = Math.sin(tiltZ);
  return (p: Vec3): Vec3 => {
    const x1 = p[0] * cy + p[2] * sy;
    const z1 = -p[0] * sy + p[2] * cy;
    const y2 = p[1] * cx - z1 * sx;
    const z2 = p[1] * sx + z1 * cx;
    return [x1 * cz - y2 * sz, x1 * sz + y2 * cz, z2];
  };
}
