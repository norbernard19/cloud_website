<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

type Star = { x: number; y: number; r: number; p: number };

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D;
let stars: Star[] = [];
let w = 0, h = 0, dpr = 1, raf = 0, reduce = false;

function fit() {
    const c = canvas.value!;
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    stars = Array.from({ length: Math.round((w * h) / 9000) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: [1, 1.5, 2][Math.floor(Math.random() * 3)],
        p: Math.random() * 6,
    }));
}

function draw(now: number) {
    const t = now / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
        const k = 0.55 + 0.45 * Math.sin(reduce ? s.p : t * 1.8 + s.p);
        const v = Math.floor(115 + 110 * k);
        ctx.fillStyle = `rgb(${v},${v},${Math.min(255, v + 12)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * k * 0.8, 0, 7);
        ctx.fill();
    }
    raf = requestAnimationFrame(draw);
}

onMounted(() => {
    reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ctx = canvas.value!.getContext('2d')!;
    fit();
    window.addEventListener('resize', fit);
    raf = requestAnimationFrame(draw);
});

onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', fit);
});
</script>

<template>
    <canvas ref="canvas" aria-hidden="true" class="starfield" />
</template>

<style scoped>
.starfield {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
</style>