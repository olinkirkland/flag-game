<template>
    <div class="play-page">
        <Button @click="onClickDeleteAllUsers">Delete all Users</Button>
        <Button @click="onClickFetchGameState">Fetch Game State</Button>

        <div class="flex">
            <InputGroup
                v-model="guess"
                placeholder="e.g., France, Germany, etc."
                >Guess</InputGroup
            >
            <Button @click="onClickSubmitGuess">Submit</Button>
        </div>

        <Panel>
            <h1>{{ currentPhase }}</h1>
            <p>{{ secondsRemainingInPhase }} seconds left</p>
            <p>Round: {{ round }}</p>
            <p>Artist: {{ artist }}</p>
            <p>Current Country: {{ currentCountry }}</p>
            <Panel border-mode>
                <div class="swatches">
                    <div
                        v-for="color in currentColors"
                        class="swatch"
                        :style="{ backgroundColor: color }"
                        :key="color"
                    ></div>
                </div>
            </Panel>
            <Panel border-mode>
                <h3>Players</h3>
                <ul class="player-list">
                    <li v-for="player in players" :key="player">
                        {{ player }}
                    </li>
                </ul>
            </Panel>
        </Panel>
    </div>
</template>

<script lang="ts" setup>
import { useGameStateStore } from '@/store/game-state-store';
import GameState from '@shared/game-state-model';
import axios from 'axios';
import { computed, ref } from 'vue';

const guess = ref('');

const gameState = useGameStateStore();
const currentPhase = computed(() => gameState.model.currentPhase || null);
const secondsRemainingInPhase = computed(
    () => gameState.model.secondsRemainingInPhase || 0
);
const players = computed(() => gameState.model.players || []);
const artist = computed(() => gameState.model.artist || null);
const currentColors = computed(() => gameState.model.currentColors || []);
const currentCountry = computed(() => gameState.model.currentCountry || null);
const round = computed(() => gameState.model.round || 1);

function onClickDeleteAllUsers() {
    axios
        .delete('user/clear')
        .then(() => {
            console.log('All users deleted successfully');
        })
        .catch((error) => {
            console.error('Error deleting users:', error);
        });
}

function onClickFetchGameState() {
    useGameStateStore().fetchGameState();
}

function onClickSubmitGuess() {
    if (!guess.value) {
        alert('Please enter a guess.');
        return;
    }

    axios
        .post('game/guess', { guess: guess.value })
        .then((response) => {
            console.log('Guess submitted successfully:', response.data);
            guess.value = '';
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
    padding: 2rem;
    height: 100%;
    overflow-y: auto;
}

.swatches {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
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
    > i {
        color: var(--border);
        font-size: 1.6rem;
    }
}

ul.player-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    li {
        border-radius: 5px;
    }
}
</style>
