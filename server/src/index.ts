import dotenv from 'dotenv';
import Redis from 'ioredis';
import joinRouter, { setRedis } from './routes/join';
import { createServer } from './server';

async function main() {
    console.log('Loading environment variables...');
    dotenv.config();

    console.log('Reading Redis configuration...');
    const redisUrl = process.env.REDIS_URL;
    const redisPassword = process.env.REDIS_PASSWORD;
    if (!redisUrl || !redisPassword) {
        throw new Error(
            'Missing REDIS_URL or REDIS_PASSWORD in environment variables'
        );
    }

    console.log('Connecting to Redis...');
    const redis = new Redis(redisUrl, { password: redisPassword });

    // Wait for Redis to be ready before starting the server
    await new Promise((resolve, reject) => {
        redis.once('ready', () => {
            console.log('Redis connected successfully');
            resolve(null);
        });
        redis.once('error', (err: unknown) => {
            console.error('Redis connection error:', err);
            reject(err);
        });
    });

    // Create and start the Express server
    const app = createServer(redis);

    app.use('/api/join', setRedis(redis), joinRouter);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
