<script setup lang="ts">
defineProps<{ petal: string; edge: string; center: string }>();
</script>

<template>
    <svg viewBox="-34 -34 68 68" aria-hidden="true">
        <ellipse
            v-for="i in 5"
            :key="i"
            cx="0" cy="-15" rx="9" ry="16"
            :fill="petal" :stroke="edge" stroke-width="0.8"
            :transform="`rotate(${(i - 1) * 72})`"
        />
        <circle r="5" :fill="center" />
    </svg>
</template>