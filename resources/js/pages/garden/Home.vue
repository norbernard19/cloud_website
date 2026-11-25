<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import Night from '@/components/garden/Night.vue';
</script>

<template>
    <Head title="Kalachuchi Garden" />
    <Night>
        <section class="g-center">
            <h1 class="g-title">Kalachuchi</h1>
            <p class="g-sub">a little garden, blooming just for you</p>
            <Link href="/flowers" class="g-btn">Visit the garden</Link>
        </section>
    </Night>
</template>