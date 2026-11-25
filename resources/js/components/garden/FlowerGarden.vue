<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { cubic, SPECS, type Pt } from './flowers';

const props = defineProps<{ slug: string }>();
const emit = defineEmits<{ notice: [message: string] }>();

const spec = SPECS[props.slug];
const canvas = ref<HTMLCanvasElement | null>(null);

type Bloom = { x: number; y: number; s: number; t: number; i: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };

const BASE_Y = -310;
let g: CanvasRenderingContext2D;
let W = 0, H = 0, S = 1, dpr = 1, t0 = 0, last = 0, raf = 0;
let running = false, reduce = false;
let flowers: Bloom[] = [];
let sparks: Spark[] = [];

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
    const l = spec.leaf;
    const y1 = l.round ? 0.12 : 0.28;
    const y2 = l.round ? 0.95 : 0.78;
    g.save();
    g.translate(x, y);
    g.rotate((ang * Math.PI) / 180);
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(-L * l.wf, L * y1, -L * l.wf * 1.08, L * y2, 0, L);
    g.bezierCurveTo(L * l.wf * 1.08, L * y2, L * l.wf, L * y1, 0, 0);
    g.fillStyle = l.fill;
    g.fill();
    g.strokeStyle = l.edge;
    g.lineWidth = 1;
    g.stroke();
    if (l.wf > 0.2) {
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(0, L * 0.88);
        g.strokeStyle = l.vein;
        g.stroke();
    }
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
    g.strokeStyle = spec.stem.color;
    g.lineWidth = spec.stem.width * f.s;
    g.lineCap = 'round';
    g.stroke();
    for (const [t, side, ang, len] of spec.leaf.list) {
        const [bx, by] = cubic(base, mid, c2, end, t);
        leaf(bx, by, side * ang + f.x * 0.04, len * f.s);
    }
}

function burst(x: number, y: number) {
    if (reduce) return;
    for (let k = 0; k < 14; k++) {
        sparks.push({ x, y, vx: (Math.random() - 0.5) * 50, vy: 20 + Math.random() * 55, life: 1 });
    }
}

function frame(now: number) {
    if (!running) return;
    const t = (now - t0) / 1000;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
    g.setTransform(dpr * S, 0, 0, -dpr * S, (dpr * W) / 2, (dpr * H) / 2);

    const glow = g.createRadialGradient(0, -274, 0, 0, -274, 230);
    glow.addColorStop(0, `rgba(${spec.glow},.9)`);
    glow.addColorStop(1, `rgba(${spec.glow},0)`);
    g.fillStyle = glow;
    g.fillRect(-W / S, -H / S, (2 * W) / S, (2 * H) / S);

    flowers.forEach((f) => branch(f, reduce ? 0 : Math.sin(t * 1.1 + f.i) * 10));
    flowers.forEach((f) => {
        const p = reduce ? 1 : Math.max(0, Math.min(1, (t - f.t) / 2.2));
        const b = 1 - (1 - p) ** 3;
        const sw = reduce ? 0 : Math.sin(t * 1.1 + f.i) * 2;
        spec.draw(g, f.x + sw, f.y + sw * 0.35, f.s, b);
    });

    sparks = sparks.filter((p) => p.life > 0);
    for (const p of sparks) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx += Math.sin(p.y * 0.1) * 20 * dt;
        p.life -= dt * 0.6;
        g.globalAlpha = Math.max(0, p.life);
        g.fillStyle = spec.spark;
        g.beginPath();
        g.arc(p.x, p.y, 2.2, 0, 7);
        g.fill();
    }
    g.globalAlpha = 1;

    raf = requestAnimationFrame(frame);
}

function replay() {
    cancelAnimationFrame(raf);
    fit();
    t0 = last = performance.now();
    sparks = [];
    flowers = spec.initial.map(([x, y, s, t], i) => ({ x, y, s, t, i }));
    running = true;
    raf = requestAnimationFrame(frame);
}

function locate(e: PointerEvent) {
    const x = (e.clientX - W / 2) / S;
    const y = -(e.clientY - H / 2) / S;
    for (let k = flowers.length - 1; k >= 0; k--) {
        const f = flowers[k];
        if (Math.hypot(x - f.x, y - f.y) < spec.hit * f.s) return { f, x, y };
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
        f.t = t;
        burst(f.x, f.y);
        return;
    }
    if (y < spec.plantY[0] || y > spec.plantY[1]) {
        emit('notice', 'Plant higher up, where the branches reach');
        return;
    }
    if (flowers.length >= spec.max) flowers.splice(spec.initial.length, 1);
    flowers.push({ x, y, s: 0.85 + Math.random() * 0.35, t, i: flowers.length + Math.random() * 5 });
    burst(x, y);
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