import dotenv from 'dotenv';
import sql from './database/db';
import { startGameLoop } from './game';
import { createServer } from './server';
import SocketServer from './socket-server';

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

    // TODO: Clean this part up, consolidate and use better naming conventions
    const app = createServer();
    const server = await SocketServer.getInstance().start(app);
    const PORT = Number(process.env.PORT) || 3000;
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });

    startGameLoop();
}

main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
