export default interface GameState {
    round: number;
    players: string[];
    artist: string | null;
    currentCountry: string | null;
    currentColors: string[];
    currentPhase: string;
    secondsRemainingInPhase: number;
}

// TODO: Add Player to Gamestate instead of just the playerids
export interface Player {
    id: string;
    name: string;
    score: number;
}
