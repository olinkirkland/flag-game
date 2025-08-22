import {
    getColorsForCountry,
    getRandomColors,
    getRandomCountry
} from './game-helpers';

let gameLoopInterval: NodeJS.Timeout | null = null;

export const Phase = {
    SETUP: 'setup',
    PLAY: 'play',
    RESULTS: 'results'
};

type GameState = {
    round: number;
    players: string[];
    artist: string | null; // The player who is currently the artist
    currentCountry: string | null;
    currentColors: string[];
    currentPhase: string;
    secondsRemainingInPhase: number;
};

export const gameState: GameState = {
    round: 1,
    players: [],
    artist: null, // Initially no artist
    currentCountry: null,
    currentColors: [],
    currentPhase: Phase.SETUP,
    secondsRemainingInPhase: 0
};

/**
 * Start the game loop that manages the game phases.
 * This function initializes the game by starting the setup phase
 * and sets up a timer to advance the game phases every second.
 */
export function startGameLoop() {
    if (gameLoopInterval) return;

    startSetupPhase(); // Start the game with the setup phase

    gameLoopInterval = setInterval(() => {
        if (gameState.secondsRemainingInPhase > 0)
            gameState.secondsRemainingInPhase--;
        else advancePhase();
    }, 1000);
}

export async function startSetupPhase() {
    // 1. Determine list of participating players
    const playerIds = await getConnectedPlayerIds();

    // 2. Fetch the round data
    const country = getRandomCountry();
    const countryColors = getColorsForCountry(country);
    const colors = getRandomColors(countryColors);

    // 3. Change the game state for the round
    gameState.round++;
    gameState.currentPhase = Phase.SETUP;
    gameState.players = playerIds;
    gameState.artist = playerIds[Math.floor(Math.random() * playerIds.length)];
    gameState.currentColors = colors;
    gameState.currentCountry = country;
    gameState.secondsRemainingInPhase = 5;
    console.log('👉', 'Setup phase: Players can prepare for the round.');
    console.log(`Current country: ${country}`);
    console.log(`Available colors: ${colors.join(', ')}`);
    console.log(`Players: ${playerIds.join(', ')}`);
}

function startPlayPhase() {
    // Change the game state to the play phase
    gameState.currentPhase = Phase.PLAY;
    gameState.secondsRemainingInPhase = 10;
    console.log('👉', 'Play phase: Players can now submit their guesses.');
}

function startResultsPhase() {
    // Change the game state to the results phase
    gameState.currentPhase = Phase.RESULTS;
    gameState.secondsRemainingInPhase = 5;
    console.log(
        '👉',
        'Results phase: Players can see the results of the round.'
    );
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
