<script setup lang="ts">
import StarField from './StarField.vue';
</script>

<template>
    <div class="g-night">
        <StarField />
        <slot />
    </div>
</template>

<style>
.g-night {
    position: fixed;
    inset: 0;
    background: #081522;
    color: #f3e8c8;
    font-family: 'Cormorant Garamond', Georgia, serif;
    overflow: hidden;
}
.g-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
}
.g-title {
    font-weight: 500;
    font-size: clamp(52px, 12vw, 120px);
    letter-spacing: 0.04em;
    margin: 0;
    line-height: 1;
}
.g-heading {
    font-weight: 500;
    font-size: clamp(28px, 5vw, 44px);
    margin: 0 0 36px;
}
.g-sub {
    font-style: italic;
    color: #a7b9a6;
    font-size: clamp(18px, 3vw, 24px);
    margin: 14px 0 40px;
}
.g-btn {
    font-size: 22px;
    color: #081522;
    background: #f3e8c8;
    border-radius: 999px;
    padding: 14px 38px;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s;
}
.g-btn:hover {
    background: #fff;
    transform: scale(1.04);
}
.g-ghost {
    font: inherit;
    font-size: 18px;
    color: #f3e8c8;
    background: rgba(8, 21, 34, 0.55);
    border: 1px solid rgba(243, 232, 200, 0.25);
    border-radius: 999px;
    padding: 8px 20px;
    cursor: pointer;
    text-decoration: none;
}
.g-ghost:hover {
    border-color: #f3e8c8;
}
.g-btn:focus-visible,
.g-ghost:focus-visible {
    outline: 2px solid #f5c84b;
    outline-offset: 4px;
}
.g-toast {
    position: fixed;
    left: 50%;
    bottom: 90px;
    transform: translateX(-50%);
    background: #f3e8c8;
    color: #081522;
    padding: 10px 22px;
    border-radius: 999px;
    font-size: 19px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    white-space: nowrap;
}
.g-toast.on {
    opacity: 1;
}
</style>