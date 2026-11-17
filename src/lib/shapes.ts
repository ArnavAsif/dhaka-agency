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
    // Digit '3'
    [
      [-1.0295, -1], [-1.185, -0.9895], [-1.302, -0.9678], [-1.4126, -0.9322],
      [-1.5146, -0.8819], [-1.6029, -0.8144], [-1.6754, -0.7287], [-1.711, -0.6604],
      [-1.7432, -0.5408], [-1.4942, -0.5408], [-1.45, -0.6245], [-1.3573, -0.704],
      [-1.242, -0.7529], [-1.0564, -0.7809], [-0.8884, -0.7704], [-0.7668, -0.7347],
      [-0.6792, -0.6788], [-0.6149, -0.5921], [-0.5854, -0.4676], [-0.5945, -0.3302],
      [-0.6256, -0.2517], [-0.6932, -0.1761], [-0.7841, -0.1289], [-0.8898, -0.1037],
      [-1.248, -0.0927], [-1.248, 0.1231], [-1.0406, 0.1276], [-0.897, 0.1554],
      [-0.7786, 0.2114], [-0.7094, 0.2796], [-0.6681, 0.3714], [-0.6604, 0.5012],
      [-0.684, 0.609], [-0.7353, 0.6843], [-0.8053, 0.7351], [-0.8905, 0.7642],
      [-1.014, 0.7808], [-1.1246, 0.7756], [-1.2318, 0.7493], [-1.3287, 0.6996],
      [-1.4036, 0.6234], [-1.4361, 0.5463], [-1.6768, 0.5463], [-1.6608, 0.6235],
      [-1.6184, 0.7242], [-1.5555, 0.8076], [-1.4777, 0.8756], [-1.3865, 0.9284],
      [-1.2853, 0.966], [-1.1761, 0.9889], [-1.0267, 1], [-0.8298, 0.9818],
      [-0.6903, 0.9391], [-0.6007, 0.888], [-0.5492, 0.8442], [-0.4693, 0.7317],
      [-0.4424, 0.6625], [-0.4223, 0.5415], [-0.4246, 0.4302], [-0.4541, 0.3084],
      [-0.4953, 0.2282], [-0.5523, 0.1591], [-0.6253, 0.101], [-0.7141, 0.0539],
      [-0.566, 0.0048], [-0.5053, -0.0346], [-0.4313, -0.1082], [-0.3649, -0.2289],
      [-0.3399, -0.3341], [-0.3352, -0.4108], [-0.3425, -0.5267], [-0.3813, -0.6717],
      [-0.4248, -0.7495], [-0.5073, -0.8432], [-0.6086, -0.9104], [-0.7206, -0.9565],
      [-0.8795, -0.9895], [-1.0295, -1],
    ],
    // Decimal point '.'
    [
      [0.0138, -1], [-0.0519, -0.9882], [-0.1051, -0.953], [-0.1404, -0.8997],
      [-0.1521, -0.834], [-0.1404, -0.7683], [-0.1051, -0.7151], [-0.0519, -0.6798],
      [0.0138, -0.668], [0.0795, -0.6798], [0.1328, -0.7151], [0.168, -0.7683],
      [0.1798, -0.834], [0.168, -0.8997], [0.1328, -0.953], [0.0795, -0.9882],
      [0.0138, -1],
    ],
    // Digit '2'
    [
      [1.7432, -0.9779], [0.3988, -0.9779], [0.3988, -0.7759], [1.0212, -0.2503],
      [1.2408, -0.0481], [1.3377, 0.0616], [1.3986, 0.1506], [1.4459, 0.245],
      [1.4725, 0.3433], [1.4747, 0.4676], [1.4309, 0.6112], [1.4046, 0.6501],
      [1.3355, 0.7142], [1.2004, 0.7707], [1.0443, 0.7798], [0.9583, 0.7666],
      [0.8802, 0.7402], [0.8111, 0.7007], [0.757, 0.6497], [0.7058, 0.5519],
      [0.4486, 0.5519], [0.4939, 0.6905], [0.5437, 0.768], [0.6083, 0.8336],
      [0.7238, 0.9116], [0.8592, 0.9654], [1.0519, 0.9986], [1.1611, 0.9982],
      [1.2733, 0.9834], [1.4237, 0.9336], [1.5482, 0.8524], [1.6422, 0.7414],
      [1.7013, 0.6013], [1.7211, 0.4329], [1.7135, 0.318], [1.674, 0.164],
      [1.6295, 0.0731], [1.5445, -0.0515], [1.3238, -0.2711], [0.7473, -0.7593],
      [1.7432, -0.7593], [1.7432, -0.9779],
    ],
  ];
  const $ = (G: Point2D[]): Point2D[] =>
    G.map((J) => [J[0] * 0.95, J[1] * 0.95]);

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
