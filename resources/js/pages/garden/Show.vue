<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import FlowerGarden from '@/components/garden/FlowerGarden.vue';
import { SPECS } from '@/components/garden/flowers';
import Night from '@/components/garden/Night.vue';

const props = defineProps<{ slug: string }>();
const spec = SPECS[props.slug];

const garden = ref<InstanceType<typeof FlowerGarden> | null>(null);
const toast = ref('');
let timer: ReturnType<typeof setTimeout>;

function notice(message: string) {
    toast.value = message;
    clearTimeout(timer);
    timer = setTimeout(() => (toast.value = ''), 2200);
}
</script>

<template>
    <Head :title="spec.title" />
    <Night>
        <FlowerGarden :key="slug" ref="garden" :slug="slug" @notice="notice" />

        <div class="bar">
            <Link href="/flowers" class="g-ghost">Back to flowers</Link>
            <button type="button" class="g-ghost" @click="garden?.replay()">Bloom again</button>
        </div>

        <div class="cap">
            <div class="t">{{ spec.title.toUpperCase() }}</div>
            <div class="s">{{ spec.hint }}</div>
        </div>

        <div class="g-toast" :class="{ on: toast }" role="status">{{ toast }}</div>
    </Night>
</template>

<style scoped>
.bar {
    position: absolute;
    top: calc(env(safe-area-inset-top, 0px) + 14px);
    left: 14px;
    right: 14px;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
}
.bar > * {
    pointer-events: auto;
}
.cap {
    position: absolute;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 18px);
    left: 0;
    right: 0;
    text-align: center;
    pointer-events: none;
    padding: 0 16px;
}
.t {
    font-size: clamp(20px, 3vw, 26px);
    letter-spacing: 0.35em;
}
.s {
    font-style: italic;
    color: #a7b9a6;
    font-size: 17px;
    margin-top: 4px;
}
</style>