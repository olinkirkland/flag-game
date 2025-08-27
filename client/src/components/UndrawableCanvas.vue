<template>
    <div class="undrawable-canvas-wrapper">
        <canvas ref="canvas" class="undrawable-canvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;

const props = defineProps<{
    imageData: string | null;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);

function drawImageFromBase64(base64: string) {
    const c = canvas.value;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const img = new window.Image();
    img.onload = () => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };
    img.src = `data:image/png;base64,${base64}`;
}

onMounted(() => {
    const c = canvas.value!;
    c.width = CANVAS_WIDTH;
    c.height = CANVAS_HEIGHT;
    drawImageFromBase64(props.imageData || '');
});

watch(
    () => props.imageData,
    (newVal) => {
        drawImageFromBase64(newVal || '');
    }
);
</script>

<style scoped lang="scss">
.undrawable-canvas-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.undrawable-canvas {
    width: 100%;
    max-width: 100vw;
    background: #fff;
    border: 2px solid var(--border);
    box-shadow: var(--shadow-sm);
    display: block;
}
</style>
