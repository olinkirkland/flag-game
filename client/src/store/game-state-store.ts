import { getUserId } from '@/controllers/data-controller';
import { sendImageData } from '@/controllers/websocket-controller';
import GameState from '@shared/game-state-model';
import axios from 'axios';
import { defineStore } from 'pinia';

export const useGameStateStore = defineStore('game-state', () => {
    const state = {
        model: {} as GameState
    };

    async function fetchGameState() {
        try {
            const response = await axios.get('game');
            useGameStateStore().model = response.data as GameState;
        } catch (error) {
            console.error('Error fetching game state:', error);
        }
    }

    function updateImageData(imageData: string) {
        sendImageData(imageData);
    }

    return {
        model: state.model,
        fetchGameState,
        updateImageData
    };
});
