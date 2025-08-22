import dotenv from 'dotenv';
import sql from './database/db';
import { startGameLoop } from './game';
import { createServer } from './server';

async function main() {
    dotenv.config();

    // Ensure the user table exists
    // { id, created_at, user_id }
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    } catch (error) {
        console.error('Error creating users table:', error);
        throw error;
    }

    const app = createServer();

    startGameLoop();
}

main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
