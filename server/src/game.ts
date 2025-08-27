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
    // 1. Determine list of participating players
    const playerIds = await getConnectedPlayerIds();

    // 2. Fetch the round data
    const country = getRandomCountry();
    const countryColors = getColorsForCountry(country);
    const colors = getRandomColors(countryColors);

    // 3. Change the game state for the round
    patch({
        op: 'replace',
        path: '/secondsRemainingInPhase',
        value: 5
    });

    patch({
        op: 'replace',
        path: '/round',
        value: gameState.round + 1
    });
    patch({
        op: 'replace',
        path: '/currentPhase',
        value: Phase.SETUP
    });
    patch({
        op: 'replace',
        path: '/players',
        value: playerIds
    });
    patch({
        op: 'replace',
        path: '/artist',
        value: playerIds[Math.floor(Math.random() * playerIds.length)]
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
    console.log('  ', `Players: ${playerIds.join(', ')}`);
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

async function getConnectedPlayerIds() {
    // TODO: Implement logic to fetch connected player IDs
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return ['player1', 'player2', 'player3']; // Example player IDs, should be replaced with actual logic to fetch connected players
}

function advancePhase() {
    if (gameState.currentPhase === Phase.SETUP) startPlayPhase();
    else if (gameState.currentPhase === Phase.PLAY) startResultsPhase();
    else if (gameState.currentPhase === Phase.RESULTS) startSetupPhase();
}
