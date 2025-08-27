<template>
    <div class="play-page">
        <!-- Phase: setup -->
        <Panel v-if="phase === 'setup'" class="setup">
            <h1>Round {{ round }} will begin in {{ secondsRemaining }}...</h1>
            <h1>
                The artist is <strong>{{ artist }}</strong>
            </h1>
        </Panel>

        <!-- Phase: play -->
        <Panel v-if="phase === 'play'" class="play">
            <Panel v-if="artist === myId">
                <h1>
                    You are the artist! Draw the flag of
                    <strong>{{ countryName }}</strong
                    >.
                </h1>
                <DrawableCanvas
                    :colors="colors"
                    @change="onChangeImageData"
                    class="canvas-area"
                />
            </Panel>

            <Panel v-else>
                <h1>You are guessing! What flag is being drawn?</h1>
                <div class="guess-input">
                    <input
                        v-model="guess"
                        placeholder="e.g., France, Germany,
                    etc."
                    />
                    <Button @click="onClickSubmitGuess" class="accent-1"
                        >Guess!</Button
                    >
                </div>
                <UndrawableCanvas
                    :imageData="gameState.model.imageData"
                    class="canvas-area"
                />
            </Panel>
        </Panel>

        <!-- Phase: results -->
        <Panel v-if="phase === 'results'" class="results">
            <div v-if="phase === 'results'">
                <h1>Round Over!</h1>
                <h1>
                    The flag was <strong>{{ countryName }}</strong
                    >!
                </h1>
                <img
                    :src="'flags/' + countryCode + '.png'"
                    :alt="`Flag of ${countryName}`"
                />
            </div>

            <Panel border-mode>
                <h1>Round {{ round }}: {{ phase }}</h1>
                <p>{{ secondsRemaining }} seconds left</p>
                <p>Artist: {{ artist }}</p>
            </Panel>
        </Panel>
    </div>

    <!-- Player list -->
    <div class="players">
        <ul>
            <li v-for="player in players" :key="player">
                {{ player }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import DrawableCanvas from '@/components/DrawableCanvas.vue';
import UndrawableCanvas from '@/components/UndrawableCanvas.vue';
import { getUserId } from '@/controllers/data-controller';
import { useGameStateStore } from '@/store/game-state-store';
import axios from 'axios';
import { computed, ref, watch } from 'vue';

const guess = ref('');
const myId = ref(getUserId());

const gameState = useGameStateStore();
const phase = computed(() => gameState.model.phase || null);
const secondsRemaining = computed(() => gameState.model.secondsRemaining || 0);
const players = computed(() => gameState.model.players || []);
const artist = computed(() => gameState.model.artist || null);
const colors = computed(() => gameState.model.colors || []);
const countryName = computed(() => gameState.model.countryName || null);
const countryCode = computed(() => gameState.model.countryCode || null);
const round = computed(() => gameState.model.round || 1);

// Clear guess input when phase changes
watch(phase, () => {
    guess.value = '';
});

function onChangeImageData(imageData: string) {
    gameState.updateImageData(imageData);
}

function onClickSubmitGuess() {
    guess.value = '';
    axios
        .post('game/guess', { guess: guess.value })
        .then((response) => {
            console.log('Guess submitted successfully:', response.data);
        })
        .catch((error) => {
            console.error('Error submitting guess:', error);
        });
}
</script>

<style lang="scss" scoped>
.play-page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    overflow-y: auto;
    padding: 4rem;
}

.guess-input {
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    input {
        height: 3.6rem;
        border-bottom: 0.2rem solid var(--accent-1);
        font-size: 2rem;
        max-width: unset;
        width: auto;
    }
}

.players {
    display: flex;
    justify-content: center;
    border-top: 2px solid var(--surface-dark);
    padding: 1rem;
    position: absolute;
    width: 100%;
    bottom: 0;

    ul {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem;
        li {
            border-radius: 5px;
        }
    }
}

.results {
    width: 100%;
    img {
        width: 100%;
        max-width: 40rem;
        object-fit: contain;
    }
}

.canvas-area {
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 2rem;
    border: 2px solid var(--accent-1);
    :deep(canvas) {
        border: none !important;
    }
}
</style>
