import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import Redis from 'ioredis';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Redis connection
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
    console.error('REDIS_URL environment variable is not set.');
    process.exit(1);
}
const redis = new Redis(redisUrl);

/**
 * Endpoint to join a user by ID.
 * Expects a JSON body with an "id" field.
 * If the user does not exist, it creates a new user with the provided ID.
 * Returns the user data as JSON.
 * @route POST /join
 * @param {string} id - The ID of the user to join.
 * @returns {object} - The user data, including ID and creation timestamp.
 */
app.post('/join', async (req, res) => {
    const { id } = req.body;
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid id' });
    }
    const redisKey = `user:${id}`;
    let rawUserData = await redis.get(redisKey);
    if (!rawUserData) {
        await redis.set(
            redisKey,
            JSON.stringify({ id, createdAt: new Date().toISOString() })
        );
        rawUserData = await redis.get(redisKey);
    }

    try {
        const userData = JSON.parse(rawUserData!!);
        return res.json(userData);
    } catch (e) {
        return res.status(500).json({ error: 'Corrupted user data' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
