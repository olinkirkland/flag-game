import dotenv from 'dotenv';

(async () => {
    dotenv.config();
    console.log('Starting server...');
    // Connect to Redis database (Railway deployment)
    // Need: env variable REDIS_URL, e.g. redis://default:password@host:port
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        console.error('REDIS_URL environment variable is not set.');
        process.exit(1);
    }
})();
