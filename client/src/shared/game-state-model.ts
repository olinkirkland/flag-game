export default interface GameState {
    round: number;
    players: string[];
    artist: string | null;
    countryName: string | null;
    countryCode: string | null;
    colors: string[];
    phase: string;
    secondsRemaining: number;
    imageData: string | null; // (base64 string of PNG data)
}

// TODO: Add Player to Gamestate instead of just the playerids
export interface Player {
    id: string;
    name: string;
    score: number;
}
