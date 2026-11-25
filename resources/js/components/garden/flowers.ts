export type Pt = [number, number];
export type Ctx = CanvasRenderingContext2D;

export const cubic = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => {
    const u = 1 - t;
    return [
        u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0],
        u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1],
    ];
};

/** [position along branch 0-1, side -1|1, angle, length] */
type LeafPos = [number, number, number, number];

export type FlowerSpec = {
    slug: string;
    title: string;
    hint: string;
    glow: string; // "r,g,b" horizon tint
    spark: string; // colour of the little burst when you tap
    stem: { color: string; width: number };
    leaf: { fill: string; edge: string; vein: string; wf: number; round: boolean; list: LeafPos[] };
    /** [x, y, scale, bloom delay in seconds] */
    initial: [number, number, number, number][];
    hit: number; // tap radius (multiplied by flower scale)
    plantY: [number, number]; // where new flowers may be planted
    max: number;
    draw: (g: Ctx, x: number, y: number, s: number, bloom: number) => void;
};

/* ---------- drawing helpers ---------- */

function petal(
    g: Ctx, x: number, y: number, ang: number, L: number, w: number,
    fill: string, stroke: string, fan = false,
) {
    g.save();
    g.translate(x, y);
    g.rotate((ang * Math.PI) / 180);
    g.beginPath();
    g.moveTo(0, 0);
    if (fan) {
        g.bezierCurveTo(-w * 0.4, L * 0.3, -w * 1.15, L * 0.92, 0, L);
        g.bezierCurveTo(w * 1.15, L * 0.92, w * 0.4, L * 0.3, 0, 0);
    } else {
        g.bezierCurveTo(-w * 0.75, L * 0.28, -w * 0.72, L * 0.88, 0, L);
        g.bezierCurveTo(w * 0.72, L * 0.88, w * 0.75, L * 0.28, 0, 0);
    }
    g.fillStyle = fill;
    g.fill();
    g.strokeStyle = stroke;
    g.lineWidth = 1;
    g.stroke();
    g.restore();
}

function dot(g: Ctx, x: number, y: number, r: number, c: string) {
    g.fillStyle = c;
    g.beginPath();
    g.arc(x, y, Math.max(0, r), 0, 7);
    g.fill();
}

/* ---------- Sampaguita (Philippine jasmine) ---------- */

const sampaguita: FlowerSpec = {
    slug: 'sampaguita',
    title: 'Sampaguita',
    hint: 'Tap the vine to plant blossoms. Tap a blossom to release its fragrance.',
    glow: '30,72,66',
    spark: '#fff7c9',
    stem: { color: '#7fa171', width: 2 },
    leaf: {
        fill: '#3f8a5f', edge: '#2a5f42', vein: '#9cc08b', wf: 0.42, round: true,
        list: [[0.2, -1, 50, 26], [0.35, 1, 50, 26], [0.5, -1, 50, 24], [0.65, 1, 50, 22], [0.8, -1, 50, 20]],
    },
    initial: [
        [-330, 120, 1.1, 0], [-270, 20, 1.0, 0.3], [-200, 170, 1.2, 0.6], [-120, 60, 1.0, 0.9],
        [-60, 200, 1.25, 1.2], [10, 110, 1.1, 1.5], [80, 10, 1.0, 1.8], [130, 185, 1.2, 2.1],
        [200, 70, 1.1, 2.4], [260, 150, 1.0, 2.7], [320, 30, 1.2, 3.0], [340, 200, 1.05, 3.3],
    ],
    hit: 30,
    plantY: [-60, 250],
    max: 30,
    draw(g, x, y, s, b) {
        if (b <= 0) return;
        const sp = 0.3 + 0.7 * b;
        for (let i = 0; i < 5; i++) petal(g, x, y, i * 72 - 90, 26 * s * b, 11 * s * sp, '#ffffff', '#dfe3d4');
        for (let i = 0; i < 5; i++) petal(g, x, y, i * 72 - 54, 20 * s * b, 9 * s * sp, '#f9faf3', '#e3e6d8');
        dot(g, x, y, 3.2 * s * b, '#f3e6a8');
    },
};

/* ---------- Gumamela (hibiscus) ---------- */

const gumamela: FlowerSpec = {
    slug: 'gumamela',
    title: 'Gumamela',
    hint: 'Tap the shrub to plant a hibiscus. Tap a flower to watch it unfurl.',
    glow: '70,28,44',
    spark: '#ff9aa8',
    stem: { color: '#6f8a5c', width: 3 },
    leaf: {
        fill: '#2f7a4f', edge: '#1f5636', vein: '#86b077', wf: 0.45, round: false,
        list: [[0.3, -1, 50, 46], [0.5, 1, 50, 46], [0.7, -1, 50, 42]],
    },
    initial: [
        [-300, 70, 1.0, 0], [-180, 190, 0.9, 0.8], [-70, 100, 1.15, 1.5], [60, 210, 1.0, 2.2],
        [160, 95, 1.1, 2.9], [280, 190, 0.95, 3.6], [330, 40, 0.9, 4.3],
    ],
    hit: 60,
    plantY: [-100, 260],
    max: 18,
    draw(g, x, y, s, b) {
        if (b <= 0) return;
        const sp = 0.35 + 0.65 * b;
        for (let i = 0; i < 5; i++) {
            petal(g, x, y, i * 72 - 90, 56 * s * b, 27 * s * sp, i % 2 ? '#e5384f' : '#d92d46', '#a31d33', true);
        }
        dot(g, x, y, 11 * s * b, '#7d1226');

        // long stamen column curving out of the throat
        const a = (50 * Math.PI) / 180;
        const len = 48 * s * b;
        const ex = x + Math.cos(a) * len;
        const ey = y + Math.sin(a) * len;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(ex, ey);
        g.strokeStyle = '#f2a3a8';
        g.lineWidth = 3 * s;
        g.lineCap = 'round';
        g.stroke();
        for (let k = 0; k < 6; k++) {
            const u = 0.55 + k * 0.07;
            const side = (k % 2) * 2 - 1;
            dot(g, x + Math.cos(a) * len * u - Math.sin(a) * side * 3 * s,
                y + Math.sin(a) * len * u + Math.cos(a) * side * 3 * s, 1.8 * s * b, '#f5c84b');
        }
        for (let k = 0; k < 5; k++) {
            dot(g, ex + Math.cos(k * 1.26) * 3.2 * s, ey + Math.sin(k * 1.26) * 3.2 * s, 1.8 * s * b, '#c4162f');
        }
    },
};

/* ---------- Waling-waling (Vanda sanderiana orchid) ---------- */

const walingWaling: FlowerSpec = {
    slug: 'waling-waling',
    title: 'Waling-waling',
    hint: 'Tap the stems to grow an orchid. Tap a bloom to open it again.',
    glow: '62,32,84',
    spark: '#e6b6ff',
    stem: { color: '#7d9a6d', width: 3 },
    leaf: {
        fill: '#3a7d57', edge: '#245a3c', vein: '#86b077', wf: 0.12, round: false,
        list: [[0.05, -1, 55, 110], [0.09, 1, 50, 100], [0.14, -1, 70, 85]],
    },
    initial: [
        [-250, 150, 1.1, 0], [-120, 50, 1.0, 1.0], [10, 190, 1.2, 2.0], [150, 80, 1.05, 3.0], [280, 170, 1.1, 4.0],
    ],
    hit: 58,
    plantY: [-60, 240],
    max: 12,
    draw(g, x, y, s, b) {
        if (b <= 0) return;
        const u = 0.5 + 0.5 * b; // petals swing outward as it opens
        const sp = 0.4 + 0.6 * b;

        // two lower sepals, then the broad side petals, then the top sepal
        for (const d of [1, -1]) petal(g, x, y, 150 * u * d, 52 * s * b, 19 * s * sp, '#c97fa0', '#8f3f66', true);
        for (const d of [1, -1]) petal(g, x, y, 90 * u * d, 50 * s * b, 23 * s * sp, '#f1d9ea', '#b277a8', true);
        petal(g, x, y, 0, 50 * s * b, 15 * s * sp, '#efd6e6', '#b277a8', true);

        // speckles on the side petals
        for (const d of [1, -1]) {
            const ang = (90 * u * d * Math.PI) / 180;
            for (let k = 0; k < 6; k++) {
                const dist = (16 + k * 6) * s * b;
                const off = ((k % 3) - 1) * 7 * s * b;
                dot(g, x - Math.sin(ang) * dist + Math.cos(ang) * off,
                    y + Math.cos(ang) * dist + Math.sin(ang) * off, 1.3 * s * b, '#a64d86');
            }
        }

        // golden lip with purple stripes, and the white column
        petal(g, x, y, 180, 24 * s * b, 12 * s * sp, '#f5c84b', '#7a2f8a');
        dot(g, x - 3 * s * b, y - 13 * s * b, 1.4 * s * b, '#7a2f8a');
        dot(g, x + 3 * s * b, y - 13 * s * b, 1.4 * s * b, '#7a2f8a');
        dot(g, x, y, 5 * s * b, '#fff6f0');
        dot(g, x, y, 2 * s * b, '#e0a8d0');
    },
};

export const SPECS: Record<string, FlowerSpec> = {
    [sampaguita.slug]: sampaguita,
    [gumamela.slug]: gumamela,
    [walingWaling.slug]: walingWaling,
};