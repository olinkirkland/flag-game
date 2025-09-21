<template>
    <div class="drawable-canvas-wrapper">
        <div class="canvas-stack">
            <img
                v-if="backgroundSrc"
                :src="backgroundSrc"
                class="canvas-background"
                alt="background"
            />
            <canvas
                ref="canvas"
                class="drawable-canvas"
                @mousedown="startDraw"
                @mousemove="draw"
                @mouseup="endDraw"
                @mouseleave="endDraw"
            ></canvas>
        </div>
        <div class="swatches">
            <div
                v-for="color in colors"
                class="swatch"
                :class="{ selected: color === selectedColor }"
                :style="{ backgroundColor: color }"
                :key="color"
                @click="selectColor(color)"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits, onMounted, ref } from 'vue';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;

const props = defineProps<{
    colors: string[];
    backgroundSrc?: string;
}>();
const emit = defineEmits(['change']);

const canvas = ref<HTMLCanvasElement | null>(null);
const selectedColor = ref(props.colors[0] || '#000');
const drawing = ref(false);
const lastPoint = ref<{ x: number; y: number } | null>(null);

function selectColor(color: string) {
    selectedColor.value = color;
}

function getCanvasPos(e: MouseEvent) {
    const rect = canvas.value!.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
        x: Math.floor((e.clientX - rect.left) * scaleX),
        y: Math.floor((e.clientY - rect.top) * scaleY)
    };
}

function startDraw(e: MouseEvent) {
    drawing.value = true;
    lastPoint.value = getCanvasPos(e);
    draw(e);
}

function draw(e: MouseEvent) {
    if (!drawing.value) return;
    const ctx = canvas.value!.getContext('2d')!;
    ctx.strokeStyle = selectedColor.value;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const { x, y } = getCanvasPos(e);
    if (lastPoint.value) {
        ctx.moveTo(lastPoint.value.x, lastPoint.value.y);
    } else {
        ctx.moveTo(x, y);
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPoint.value = { x, y };
    emitChangedPixels();
}

function endDraw() {
    drawing.value = false;
    lastPoint.value = null;
}

function emitChangedPixels() {
    const base64 = canvas.value!.toDataURL('image/png').split(',')[1];
    emit('change', base64);
}

onMounted(() => {
    const c = canvas.value!;
    c.width = CANVAS_WIDTH;
    c.height = CANVAS_HEIGHT;
    // Responsive sizing
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
});

// Watch for background image load (optional): when background changes we
// could ensure canvas stays transparent. The <img> is purely decorative.

function resizeCanvas() {
    const c = canvas.value!;
    const parent = c.parentElement!;
    const parentStyles = getComputedStyle(parent);
    const parentWidth =
        parent.clientWidth -
        parseFloat(parentStyles.paddingLeft) -
        parseFloat(parentStyles.paddingRight);
    c.style.width = `${parentWidth}px`;
    c.style.height = `${(parentWidth * CANVAS_HEIGHT) / CANVAS_WIDTH}px`;
}
</script>

<style lang="scss" scoped>
.drawable-canvas-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.drawable-canvas {
    width: 100%;
    max-width: 100vw;
    background: transparent;
    border: 2px solid var(--border);
    box-shadow: var(--shadow-sm);
    display: block;
    touch-action: none;
}

.swatches {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;
}
.swatch {
    width: 3.2rem;
    height: 3.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    border: 2px solid var(--border);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: border 0.2s;
}
.swatch.selected {
    border: 2px solid var(--primary, #007bff);
    box-shadow: 0 0 0 2px var(--primary, #007bff);
}

.canvas-stack {
    position: relative;
}

.canvas-background {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
    opacity: 0.5;
    z-index: 0;
}

.drawable-canvas {
    position: relative;
    z-index: 1;
}
</style>
