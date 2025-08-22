<template>
    <div class="button-container light" :class="`${props.class}`">
        <button>
            <slot></slot>
        </button>
        <div class="button-shadow"></div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    class: {
        type: String,
        default: ''
    }
});
</script>

<style lang="scss">
.button-container {
    position: relative;
    width: fit-content;

    &.full-width-mobile {
        width: 100%;
        > button {
            width: 100%;
            justify-content: center;
        }
        > .button-shadow {
            width: 100%;
        }
    }
}

button {
    position: relative;
    z-index: 1;
    width: fit-content;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    height: 3.2rem;
    padding: 0 1rem;
    color: var(--body);
    cursor: pointer;
    border-radius: 5px;
    border-bottom: 2px solid transparent;
    transition: all 0.1s;
    white-space: nowrap;

    i {
        font-size: 1.6rem;
    }
}

.button-shadow {
    position: absolute;
    top: 0.2rem;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
}

button:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-0.1rem);
}

button:active {
    transform: translateY(0.2rem);
    transition: unset;
}

// When button is active, the shadow should be slightly offset
button:active ~ .button-shadow {
    display: none;
}

// Light
.button-container.light {
    button {
        background-color: var(--surface);
        color: var(--body);
    }
    .button-shadow {
        background-color: var(--surface-dark);
    }
}

.button-container.dark {
    button {
        background-color: var(--body);
        color: var(--surface);
    }
    .button-shadow {
        background-color: var(--body-dark);
    }
}

.button-container.accent-1 {
    button {
        background-color: var(--accent-1);
        color: var(--body);
    }
    .button-shadow {
        background-color: var(--accent-1-dark);
    }
}

.button-container.accent-2 {
    button {
        background-color: var(--accent-2);
        color: var(--body);
    }
    .button-shadow {
        background-color: var(--accent-2-dark);
    }
}

.button-container.accent-3 {
    button {
        background-color: var(--accent-3);
        color: var(--body);
    }
    .button-shadow {
        background-color: var(--accent-3-dark);
    }
}

.button-container.accent-4 {
    button {
        background-color: var(--accent-4);
        color: var(--body);
    }
    .button-shadow {
        background-color: var(--accent-4-dark);
    }
}
</style>
