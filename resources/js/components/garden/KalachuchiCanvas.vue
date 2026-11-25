<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

type Pt = [number, number];
type Bloom = { x: number; y: number; s: number; t: number; i: number };

const emit = defineEmits<{ notice: [message: string] }>();
const canvas = ref<HTMLCanvasElement | null>(null);

const INITIAL: [number, number, number, number][] = [
    [-330, 65, 0.82, 0], [-220, 185, 0.72, 0.7], [-95, 90, 0.95, 1.3],
    [45, 220, 0.82, 1.9], [175, 105, 0.92, 2.5], [300, 205, 0.72, 3.1],
    [350, 20, 0.72, 3.8], [-5, -5, 0.68, 4.4],
];
const BASE_Y = -310;
const COLS = ['#fffdf2', '#fff8e8', '#f7f1e4', '#fffaf0', '#f5eee1'];

let g: CanvasRenderingContext2D;
let W = 0, H = 0, S = 1, dpr = 1, t0 = 0, raf = 0;
let running = false, reduce = false;
let flowers: Bloom[] = [];

const cubic = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => {
    const u = 1 - t;
    return [
        u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0],
        u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1],
    ];
};

function fit() {
    const c = canvas.value!;
    dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    c.width = W * dpr;
    c.height = H * dpr;
    S = Math.min(W / 860, H / 720);
}

function leaf(x: number, y: number, ang: number, L: number) {
    g.save();
    g.translate(x, y);
    g.rotate((ang * Math.PI) / 180);
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(-L * 0.48, L * 0.28, -L * 0.52, L * 0.78, 0, L);
    g.bezierCurveTo(L * 0.52, L * 0.78, L * 0.48, L * 0.28, 0, 0);
    g.fillStyle = '#347b58';
    g.fill();
    g.strokeStyle = '#24543f';
    g.lineWidth = 1;
    g.stroke();
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(0, L * 0.88);
    g.strokeStyle = '#8ab17c';
    g.stroke();
    g.restore();
}

function branch(f: Bloom, sway: number) {
    const base: Pt = [f.x * 0.48, BASE_Y];
    const mid: Pt = [f.x * 0.72 + sway, -110];
    const c2: Pt = [f.x - sway * 0.25, f.y - 80];
    const end: Pt = [f.x, f.y - 10];
    g.beginPath();
    g.moveTo(...base);
    g.bezierCurveTo(...mid, ...c2, ...end);
    g.strokeStyle = '#6d8b62';
    g.lineWidth = 3 * f.s;
    g.lineCap = 'round';
    g.stroke();
    ([[0.28, -1], [0.48, 1], [0.68, -1]] as [number, number][]).forEach(([t, side]) => {
        const [bx, by] = cubic(base, mid, c2, end, t);
        leaf(bx, by, side * 48 + f.x * 0.04, 43 * f.s);
    });
}

function petal(x: number, y: number, ang: number, L: number, w: number, col: string) {
    g.save();
    g.translate(x, y);
    g.rotate((ang * Math.PI) / 180);
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(-w * 0.75, L * 0.28, -w * 0.72, L * 0.88, 0, L);
    g.bezierCurveTo(w * 0.72, L * 0.88, w * 0.75, L * 0.28, 0, 0);
    g.fillStyle = col;
    g.fill();
    g.strokeStyle = '#e8e5d9';
    g.lineWidth = 1;
    g.stroke();
    g.restore();
}

function flower(x: number, y: number, s: number, bloom: number) {
    if (bloom <= 0) return;
    const spread = 0.25 + 0.75 * bloom;
    const L = 65 * s * bloom;
    const w = 25 * s * (0.35 + 0.65 * bloom);
    for (let i = 0; i < 5; i++) petal(x, y, i * 72 - 90, L, w * spread, COLS[i]);
    g.fillStyle = '#f5c84b';
    g.beginPath();
    g.arc(x, y, 8.5 * s * bloom, 0, 7);
    g.fill();
    g.fillStyle = '#ffe99a';
    g.beginPath();
    g.arc(x - 3 * s, y + 3 * s, 2.5 * s * bloom, 0, 7);
    g.fill();
}

function frame(now: number) {
    if (!running) return;
    const t = (now - t0) / 1000;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
    // y axis points up, origin at screen centre (same as turtle)
    g.setTransform(dpr * S, 0, 0, -dpr * S, (dpr * W) / 2, (dpr * H) / 2);

    const glow = g.createRadialGradient(0, -274, 0, 0, -274, 230);
    glow.addColorStop(0, 'rgba(22,60,58,.9)');
    glow.addColorStop(1, 'rgba(16,43,43,0)');
    g.fillStyle = glow;
    g.fillRect(-W / S, -H / S, (2 * W) / S, (2 * H) / S);

    flowers.forEach((f) => branch(f, reduce ? 0 : Math.sin(t * 1.1 + f.i) * 10));
    flowers.forEach((f) => {
        const p = reduce ? 1 : Math.max(0, Math.min(1, (t - f.t) / 2.2));
        const bloom = 1 - (1 - p) ** 3;
        const sw = reduce ? 0 : Math.sin(t * 1.1 + f.i) * 2;
        flower(f.x + sw, f.y + sw * 0.35, f.s, bloom);
    });
    raf = requestAnimationFrame(frame);
}

function replay() {
    cancelAnimationFrame(raf);
    fit();
    t0 = performance.now();
    flowers = INITIAL.map(([x, y, s, t], i) => ({ x, y, s, t, i }));
    running = true;
    raf = requestAnimationFrame(frame);
}

function locate(e: PointerEvent) {
    const x = (e.clientX - W / 2) / S;
    const y = -(e.clientY - H / 2) / S;
    for (let k = flowers.length - 1; k >= 0; k--) {
        const f = flowers[k];
        if (Math.hypot(x - f.x, y - f.y) < 62 * f.s) return { f, x, y };
    }
    return { f: undefined, x, y };
}

function onMove(e: PointerEvent) {
    canvas.value!.style.cursor = locate(e).f ? 'pointer' : 'default';
}

function onDown(e: PointerEvent) {
    const t = (performance.now() - t0) / 1000;
    const { f, x, y } = locate(e);
    if (f) {
        f.t = t; // replay this flower's bloom
        return;
    }
    if (y < -120 || y > 300) {
        emit('notice', 'Plant higher up, where the branches reach');
        return;
    }
    if (flowers.length >= 22) flowers.splice(8, 1);
    flowers.push({ x, y, s: 0.6 + Math.random() * 0.35, t, i: flowers.length + Math.random() * 5 });
}

function onResize() {
    if (running) fit();
}

onMounted(() => {
    reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    g = canvas.value!.getContext('2d')!;
    window.addEventListener('resize', onResize);
    replay();
});

onBeforeUnmount(() => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
});

defineExpose({ replay });
</script>

<template>
    <canvas ref="canvas" class="garden-canvas" @pointerdown="onDown" @pointermove="onMove" />
</template>

<style scoped>
.garden-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    touch-action: manipulation;
}
</style>