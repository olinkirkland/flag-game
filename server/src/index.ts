import dotenv from 'dotenv';
import sql from './database/db';
import userRouter from './routes/users';
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

    // Create and start the Express server
    const app = createServer();

    app.use('/api/user', userRouter);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
