import { Vector3, Color } from 'three';

type Point2D = [number, number];

export interface ShapeInfo {
  cx: number;
  cy: number;
  w: number;
  h: number;
}

export const SHAPE_COLORS: Record<string, Color> = {
  eighteen: new Color('#250a0d'),
  glasses: new Color('#200a0d'),
  wheel: new Color('#0f0f14'),
  pen: new Color('#18080a'),
  bottle: new Color('#111116'),
  default: new Color('#0d0d10'),
};

export const SHAPE_PARTICLE_TINT: Record<string, Color> = {
  eighteen: new Color('#991b1b'),
  glasses: new Color('#991b1b'),
  wheel: new Color('#ffffff'),
  pen: new Color('#b91c1c'),
  bottle: new Color('#ffffff'),
  default: new Color('#ffffff'),
};

export function createShapePointClouds(pt: number = 350) {
  const b = (G: Point2D[], J: number): Vector3[] => {
    const we: number[] = [];
    let Ae = 0;
    for (let Ve = 0; Ve < G.length; Ve++) {
      const ze = G[Ve];
      const He = G[(Ve + 1) % G.length];
      const it = Math.hypot(He[0] - ze[0], He[1] - ze[1]);
      we.push(it);
      Ae += it;
    }
    const Ne: Vector3[] = [];
    for (let Ve = 0; Ve < J; Ve++) {
      let ze = (Ve / J) * Ae;
      let He = 0;
      while (He < we.length - 1 && ze > we[He]) {
        ze -= we[He];
        He++;
      }
      const it = G[He];
      const ut = G[(He + 1) % G.length];
      const Vt = we[He] ? ze / we[He] : 0;
      Ne.push(
        new Vector3(
          it[0] + (ut[0] - it[0]) * Vt,
          it[1] + (ut[1] - it[1]) * Vt,
          (Math.random() - 0.5) * 0.14
        )
      );
    }
    return Ne;
  };

  const I = (G: Point2D[], J: number): Point2D[] => {
    const we = Math.cos(J);
    const Ae = Math.sin(J);
    return G.map(([Ne, Ve]) => [Ne * we - Ve * Ae, Ne * Ae + Ve * we]);
  };

  const F: Point2D[] = I(
    [
      [-2.15, 0],
      [-2, 0.022],
      [-1.84, 0.045],
      [-1.64, 0.072],
      [-1.46, 0.09],
      [1.62, 0.09],
      [1.74, 0.07],
      [1.84, 0.04],
      [1.9, 0],
      [1.84, -0.04],
      [1.74, -0.07],
      [1.62, -0.09],
      [-1.46, -0.09],
      [-1.64, -0.072],
      [-1.84, -0.045],
      [-2, -0.022],
    ],
    0.6
  );

  const N: Point2D[] = I(
    [
      [-0.2, 1.14],
      [0.2, 1.14],
      [0.2, 0.9],
      [0.44, 0.66],
      [0.46, 0.48],
      [0.46, -0.92],
      [0.4, -1.12],
      [-0.4, -1.12],
      [-0.46, -0.92],
      [-0.46, 0.48],
      [-0.44, 0.66],
      [-0.2, 0.9],
    ],
    -0.5
  );

  const re = 0.9;
  const de = (G: Point2D[]): Point2D[] => G.map((J) => [J[0] * re, J[1] * re]);

  const O = (G: Point2D[][], J: number): Vector3[] => {
    const we = G.map((ze) => {
      let He = 0;
      for (let it = 0; it < ze.length; it++) {
        const ut = ze[it];
        const Vt = ze[(it + 1) % ze.length];
        He += Math.hypot(Vt[0] - ut[0], Vt[1] - ut[1]);
      }
      return He;
    });
    const Ae = we.reduce((ze, He) => ze + He, 0);
    const Ne: Vector3[] = [];
    let Ve = 0;
    for (let ze = 0; ze < G.length; ze++) {
      const He =
        ze === G.length - 1
          ? Math.max(1, J - Ve)
          : Math.max(2, Math.round((J * we[ze]) / Ae));
      Ve += He;
      b(G[ze], He).forEach((it) => Ne.push(it));
    }
    while (Ne.length < J) Ne.push(Ne[Ne.length - 1].clone());
    return Ne.slice(0, J);
  };

  const k: Point2D[] = [
    [-0.26, -0.78],
    [-0.26, 0.16],
    [0.02, 0.16],
    [0.02, 0.4],
    [-0.26, 0.4],
    [-0.26, 0.5],
    [0.02, 0.5],
    [0.02, 0.78],
    [-0.54, 0.78],
    [-0.54, 0.4],
    [-0.76, 0.4],
    [-0.76, 0.16],
    [-0.54, 0.16],
    [-0.54, -0.78],
  ];

  const ne = 0.72;
  const K = 0.15;
  const fe = 0.58;
  const Oe: Point2D[] = [
    [ne - K, fe],
    [ne + K, fe],
    [ne + K, K],
    [ne + fe, K],
    [ne + fe, -K],
    [ne + K, -K],
    [ne + K, -fe],
    [ne - K, -fe],
    [ne - K, -K],
    [ne - fe, -K],
    [ne - fe, K],
    [ne - K, K],
  ];

  const q = (G: Point2D[]): Point2D[] =>
    G.map((J) => [J[0] * 1.15 + 0.35, J[1] * 1.15]);
  const Ie = (G: Point2D[]): Point2D[] =>
    G.map((J) => [J[0] * re + 0.46, J[1] * re]);

  const me = (G: number, J: number, we: number, Ae: number): Point2D[] => {
    const Ne: Point2D[] = [];
    for (let Ve = 0; Ve < Ae; Ve++) {
      const ze = (Ve / Ae) * Math.PI * 2;
      Ne.push([G + Math.cos(ze) * we, J + Math.sin(ze) * we]);
    }
    return Ne;
  };

  const xe = (
    G: number,
    J: number,
    we: number,
    Ae: number,
    Ne: number
  ): Point2D[] => {
    const Ve: Point2D[] = [];
    for (let ze = 0; ze < Ne; ze++) {
      const He = (ze / Ne) * Math.PI * 2;
      Ve.push([G + Math.cos(He) * we, J + Math.sin(He) * Ae]);
    }
    return Ve;
  };

  const _e = (
    G: number,
    J: number,
    we: number,
    Ae: number,
    Ne: number,
    Ve: number
  ): Point2D[] => {
    const ze: Point2D[] = [];
    for (let He = 0; He <= Ve; He++) {
      const it = Ae + (He / Ve) * (Ne - Ae);
      ze.push([G + Math.cos(it) * we, J + Math.sin(it) * we]);
    }
    return ze;
  };

  const qe: Point2D[] = [
    [-0.6, 0.44],
    [0.6, 0.44],
    [0.54, 0],
    [0.48, -0.42],
    [0.4, -0.62],
    [0.22, -0.72],
    [-0.22, -0.72],
    [-0.4, -0.62],
    [-0.48, -0.42],
    [-0.54, 0],
  ];
  const V = xe(0, 0.44, 0.6, 0.13, 22);
  const Q = [
    ..._e(0.68, -0.02, 0.3, 2.06, -2.06, 14),
    ..._e(0.68, -0.02, 0.16, -2.06, 2.06, 10),
  ];
  const te = (G: number): Point2D[] => [
    [G - 0.04, 0.6],
    [G + 0.1, 0.78],
    [G - 0.06, 0.96],
    [G + 0.08, 1.14],
    [G + 0.16, 1.14],
    [G + 0.02, 0.96],
    [G + 0.18, 0.78],
    [G + 0.04, 0.6],
  ];
  const pe: Point2D[][] = [qe, V, Q, te(-0.24), te(0.2)];
  const he = (G: Point2D[]): Point2D[] =>
    G.map((J) => [J[0] * 0.95 + 0.4, J[1] * 0.95 + 0.02]);

  const Le: Point2D[][] = [
    [
      [-0.62, 0.95],
      [-0.34, 0.95],
      [0, 0.48],
      [0.34, 0.95],
      [0.62, 0.95],
      [0.1, 0.12],
      [-0.1, 0.12],
    ],
    me(0, -0.38, 0.58, 30),
    me(0, -0.38, 0.34, 20),
  ];
  const Ue = (G: Point2D[]): Point2D[] =>
    G.map((J) => [J[0] * 1.15 + 0.4, J[1] * 1.15]);

  const je = (G: number, J: number, we: number, Ae: number): Point2D[] => [
    [G, Ae],
    [we, Ae],
    [we, J],
    [G, J],
  ];
  const S: Point2D[][] = [
    je(-1.36, -0.82, 1.36, 0.82),
    [
      [-1.36, 0.82],
      [1.36, 0.82],
      [0, -0.04],
    ],
  ];

  const W: Point2D[][] = [
    [
      [-1.15, 0.5],
      [-0.5, 1.05],
      [-0.5, -0.75],
      [-0.25, -0.75],
      [-0.25, -1.02],
      [-1.15, -1.02],
      [-1.15, -0.75],
      [-0.9, -0.75],
      [-0.9, 0.68],
    ],
    me(0.5, 0.45, 0.44, 24),
    me(0.5, 0.45, 0.22, 16),
    me(0.5, -0.49, 0.56, 28),
    me(0.5, -0.49, 0.3, 18),
  ];
  const $ = (G: Point2D[]): Point2D[] =>
    G.map((J) => [J[0] * 0.9 + 0.28, J[1] * 0.9]);

  const ae: Point2D[][] = [
    me(0, 0, 1.15, 38),
    me(0, 0, 0.8, 30),
    me(0, 0, 0.22, 14),
  ];
  for (let G = 0; G < 6; G++) {
    ae.push(I(je(-0.07, 0.24, 0.07, 0.76), (G * Math.PI * 2) / 6));
  }
  const Z = (G: Point2D[]): Point2D[] =>
    G.map((J) => [J[0] * 0.9 - 0.05, J[1] * 0.9]);

  const Ce = (G: Point2D[]): Point2D[] =>
    G.map((J) => [J[0] * 0.9 + 0.45, J[1] * 0.9 + 0.2]);

  const ve = (
    G: number,
    J: number,
    we: number,
    Ae: number,
    Ne: number,
    Ve: number = 5
  ): Point2D[] => {
    const ze = we / 2 - Ne;
    const He = Ae / 2 - Ne;
    const it: Point2D[] = [
      [ze, He],
      [-ze, He],
      [-ze, -He],
      [ze, -He],
    ];
    const ut = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
    const Vt: Point2D[] = [];
    for (let qt = 0; qt < 4; qt++) {
      for (let bi = 0; bi <= Ve; bi++) {
        const Nt = ut[qt] + (bi / Ve) * (Math.PI / 2);
        Vt.push([
          G + it[qt][0] + Math.cos(Nt) * Ne,
          J + it[qt][1] + Math.sin(Nt) * Ne,
        ]);
      }
    }
    return Vt;
  };

  const se: Point2D[][] = [
    ve(-0.52, 0, 0.8, 0.72, 0.18),
    ve(0.52, 0, 0.8, 0.72, 0.18),
    je(-0.13, 0.04, 0.13, 0.16),
    je(-1.1, 0.02, -0.92, 0.12),
    je(0.92, 0.02, 1.1, 0.12),
  ];
  const A = (G: Point2D[]): Point2D[] =>
    G.map((J) => [J[0] * 0.9 + 0.12, J[1] * 0.9]);

  const ie: Point2D[][] = [
    ve(0, 0.32, 2.5, 1.55, 0.14),
    ve(0, 0.32, 2.16, 1.16, 0.05),
    [
      [-0.16, -0.46],
      [0.16, -0.46],
      [0.22, -0.9],
      [-0.22, -0.9],
    ],
    ve(0, -1, 1.05, 0.16, 0.07),
  ];
  const ee = (G: Point2D[]): Point2D[] =>
    G.map((J) => [J[0] * 0.8 + 0.32, J[1] * 0.8]);

  const shapes: Record<string, Vector3[]> = {
    pen: b(Ce(F), pt),
    bottle: b(de(N), pt),
    fplus: O([q(k), q(Oe)], pt),
    medal: O(Le.map(Ue), pt),
    cup: O(pe.map(he), pt),
    frame: O(ie.map(ee), pt),
    mail: O(S.map(Ie), pt),
    eighteen: O(W.map($), pt),
    wheel: O(ae.map(Z), pt),
    glasses: O(se.map(A), pt),
  };

  // Compute exact bounding box and center for each shape
  const shapeInfo: Record<string, ShapeInfo> = {};
  for (const s in shapes) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of shapes[s]) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    shapeInfo[s] = {
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
      w: Math.max(0.1, maxX - minX),
      h: Math.max(0.1, maxY - minY),
    };
  }

  return { shapes, shapeInfo };
}
