<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import FlowerIcon from '@/components/garden/FlowerIcon.vue';
import Night from '@/components/garden/Night.vue';

const flowers = [
    { name: 'Kalachuchi', note: 'plumeria', href: '/garden/kalachuchi', c: ['#fffdf2', '#e8e5d9', '#f5c84b'] },
    { name: 'Sampaguita', note: 'jasmine', href: '/garden/sampaguita', c: ['#ffffff', '#d9d9cf', '#f3e6a8'] },
    { name: 'Gumamela', note: 'hibiscus', href: '/garden/gumamela', c: ['#e5384f', '#a31d33', '#f5c84b'] },
    { name: 'Waling-waling', note: 'queen of orchids', href: '/garden/waling-waling', c: ['#c58ad6', '#7a3f96', '#f5e27a'] },
];

const toast = ref('');
let timer: ReturnType<typeof setTimeout>;
function soon(name: string) {
    toast.value = `${name} is blooming soon`;
    clearTimeout(timer);
    timer = setTimeout(() => (toast.value = ''), 2200);
}
</script>

<template>
    <Head title="Choose a flower" />
    <Night>
        <section class="g-center">
            <h2 class="g-heading">Which flower will you visit?</h2>
            <div class="row">
                <template v-for="(f, i) in flowers" :key="f.name">
                    <Link v-if="f.href" :href="f.href" class="flower" :style="{ '--i': i }">
                        <FlowerIcon :petal="f.c[0]" :edge="f.c[1]" :center="f.c[2]" />
                        <b>{{ f.name }}</b>
                        <i>{{ f.note }}</i>
                    </Link>
                    <button v-else type="button" class="flower locked" :style="{ '--i': i }" @click="soon(f.name)">
                        <FlowerIcon :petal="f.c[0]" :edge="f.c[1]" :center="f.c[2]" />
                        <b>{{ f.name }}</b>
                        <i>{{ f.note }}</i>
                    </button>
                </template>
            </div>
        </section>
        <div class="g-toast" :class="{ on: toast }" role="status">{{ toast }}</div>
    </Night>
</template>

<style scoped>
.row {
    display: flex;
    flex-wrap: wrap;
    gap: 34px 44px;
    justify-content: center;
    max-width: 760px;
}
.flower {
    font: inherit;
    color: #f3e8c8;
    background: none;
    border: 0;
    cursor: pointer;
    width: 140px;
    padding: 0;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    animation: pop 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.3) both;
    animation-delay: calc(var(--i) * 0.45s + 0.2s);
}
.flower svg {
    width: 108px;
    height: 108px;
    transition: transform 0.5s;
}
.flower:hover svg {
    transform: rotate(36deg) scale(1.08);
}
.flower:focus-visible {
    outline: 2px solid #f5c84b;
    outline-offset: 4px;
}
.flower b {
    font-weight: 500;
    font-size: 24px;
}
.flower i {
    font-size: 16px;
    color: #a7b9a6;
}
.locked {
    opacity: 0.5;
}
@keyframes pop {
    from { opacity: 0; transform: scale(0.2) rotate(-60deg); }
    to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
    .flower { animation: none; }
    .flower svg { transition: none; }
}
</style>