import { NextFunction, Request, Response, Router } from 'express';
import { Redis } from 'ioredis';

// Extend Express Request type to include redis
interface RedisRequest extends Request {
    redis: Redis;
}

const router = Router();

// Middleware to inject redis instance into req
export function setRedis(redis: Redis) {
    return (req: Request, _res: Response, next: NextFunction) => {
        (req as RedisRequest).redis = redis;
        next();
    };
}

router.post('/', async (req: Request, res: Response) => {
    const redis: Redis = (req as RedisRequest).redis;
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

export default router;
