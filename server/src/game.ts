import GameState from '@shared/game-state-model';
import { applyPatch, Operation } from 'fast-json-patch';
import {
    getColorsForCountry,
    getRandomColors,
    getRandomCountry
} from './game-helpers';
import SocketServer from './socket-server';

let gameLoopInterval: NodeJS.Timeout | null = null;

export const Phase = {
    SETUP: 'setup',
    PLAY: 'play',
    RESULTS: 'results'
};

export let gameState: GameState = {
    round: 1,
    players: [],
    artist: null, // Initially no artist
    currentCountry: null,
    currentColors: [],
    currentPhase: Phase.SETUP,
    secondsRemainingInPhase: 0
};

export function patch(patch: Operation) {
    // Apply to server-side game state
    gameState = applyPatch(gameState, [patch]).newDocument;

    // Broadcast to all connected clients
    SocketServer.getInstance().broadcast({
        type: 'patch',
        data: patch
    });
}

/**
 * Start the game loop that manages the game phases.
 * This function initializes the game by starting the setup phase
 * and sets up a timer to advance the game phases every second.
 */
export function startGameLoop() {
    if (gameLoopInterval) return;

    startSetupPhase(); // Start the game with the setup phase

    const intervalMillis = 1000;
    gameLoopInterval = setInterval(() => {
        if (gameState.secondsRemainingInPhase > 0) {
            const newSecondsRemainingInPhase =
                gameState.secondsRemainingInPhase - intervalMillis / 1000;
            patch({
                op: 'replace',
                path: '/secondsRemainingInPhase',
                value: Number(newSecondsRemainingInPhase.toFixed(3))
            });
        } else advancePhase();
    }, intervalMillis);
}

export async function startSetupPhase() {
    const country = getRandomCountry();
    const countryColors = getColorsForCountry(country);
    const colors = getRandomColors(countryColors);

    // Seconds remaining in setup phase
    patch({
        op: 'replace',
        path: '/secondsRemainingInPhase',
        value: 5
    });

    // Increment the round number
    patch({
        op: 'replace',
        path: '/round',
        value: gameState.round + 1
    });

    // Set the current phase to setup
    patch({
        op: 'replace',
        path: '/currentPhase',
        value: Phase.SETUP
    });

    // Choose an artist randomly from the list of players
    patch({
        op: 'replace',
        path: '/artist',
        value: chooseArtist()
    });
    patch({
        op: 'replace',
        path: '/currentColors',
        value: colors
    });
    patch({
        op: 'replace',
        path: '/currentCountry',
        value: country
    });

    console.log('👉', 'Setup phase: Players can prepare for the round.');
    console.log('  ', `Current country: ${country}`);
    console.log('  ', `Available colors: ${colors.join(', ')}`);
}

function startPlayPhase() {
    // Change the game state to the play phase
    patch({
        op: 'replace',
        path: '/currentPhase',
        value: Phase.PLAY
    });
    patch({
        op: 'replace',
        path: '/secondsRemainingInPhase',
        value: 10
    });

    console.log('👉', 'Play phase: Players can submit their guesses.');
}

function startResultsPhase() {
    // Change the game state to the results phase
    patch({
        op: 'replace',
        path: '/currentPhase',
        value: Phase.RESULTS
    });
    patch({
        op: 'replace',
        path: '/secondsRemainingInPhase',
        value: 5
    });

    console.log('👉', 'Results phase: Players see the results of the round.');
}

function advancePhase() {
    if (gameState.currentPhase === Phase.SETUP) startPlayPhase();
    else if (gameState.currentPhase === Phase.PLAY) startResultsPhase();
    else if (gameState.currentPhase === Phase.RESULTS) startSetupPhase();
}

function chooseArtist() {
    const { players } = gameState;
    if (players.length === 0) return null;

    const currentArtistIndex = players.findIndex(
        (player) => player === gameState.artist
    );

    const nextArtistIndex = Math.round(Math.random() * players.length);
    return players[nextArtistIndex];
}
