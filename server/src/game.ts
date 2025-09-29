import type GameState from '@/shared/game-state-model';
import { applyPatch, Operation } from 'fast-json-patch';
import {
    getColorsForCountry,
    getRandomColors,
    getRandomCountry
} from './game-helpers';
import SocketServer from './socket-server';

const SECONDS_IN_SETUP_PHASE = 5;
const SECONDS_IN_PLAY_PHASE = 10;
const SECONDS_IN_RESULTS_PHASE = 5;

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
    countryCode: null,
    countryName: null,
    colors: [],
    phase: Phase.SETUP,
    secondsRemaining: 0,
    imageData: null // Initially no image data
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
        if (gameState.secondsRemaining > 0) {
            const nextSecondsRemaining =
                gameState.secondsRemaining - intervalMillis / 1000;
            patch({
                op: 'replace',
                path: '/secondsRemaining',
                value: Number(nextSecondsRemaining.toFixed(3))
            });
        } else advancePhase();
    }, intervalMillis);
}

export async function startSetupPhase() {
    const countryCode = getRandomCountry();
    const country = getRandomCountry();
    const countryColors = getColorsForCountry(country.code);
    const colors = getRandomColors(countryColors);

    // Set the timer for the setup phase
    patch({
        op: 'replace',
        path: '/secondsRemaining',
        value: SECONDS_IN_SETUP_PHASE
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
        path: '/phase',
        value: Phase.SETUP
    });

    // Choose an artist randomly from the list of players
    patch({
        op: 'replace',
        path: '/artist',
        value: chooseArtist()
    });

    // Update the country and colors for the new round
    patch({
        op: 'replace',
        path: '/colors',
        value: colors
    });

    // Update country name
    patch({
        op: 'replace',
        path: '/countryName',
        value: country.name
    });

    // Update country code
    patch({
        op: 'replace',
        path: '/countryCode',
        value: country.code
    });

    // Clear any existing image data
    patch({
        op: 'replace',
        path: '/imageData',
        value: null
    });

    console.log('👉', 'Setup phase: Players can prepare for the round.');
    console.log('  ', `Current country: ${country.name} (${country.code})`);
    console.log('  ', `Available colors: ${colors.join(', ')}`);
}

function startPlayPhase() {
    // Change the game state to the play phase
    patch({
        op: 'replace',
        path: '/phase',
        value: Phase.PLAY
    });

    // Set the timer for the play phase
    patch({
        op: 'replace',
        path: '/secondsRemaining',
        value: SECONDS_IN_PLAY_PHASE
    });

    console.log('👉', 'Play phase: Players can submit their guesses.');
}

function startResultsPhase() {
    // Change the game state to the results phase
    patch({
        op: 'replace',
        path: '/phase',
        value: Phase.RESULTS
    });

    // Set the timer for the results phase
    patch({
        op: 'replace',
        path: '/secondsRemaining',
        value: SECONDS_IN_RESULTS_PHASE
    });

    console.log('👉', 'Results phase: Players see the results of the round.');
}

function advancePhase() {
    if (gameState.phase === Phase.SETUP) startPlayPhase();
    else if (gameState.phase === Phase.PLAY) startResultsPhase();
    else if (gameState.phase === Phase.RESULTS) startSetupPhase();
}

function chooseArtist() {
    const { players } = gameState;
    if (players.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * players.length);
    return players[randomIndex];
}
