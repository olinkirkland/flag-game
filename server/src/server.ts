import cors from 'cors';
import express from 'express';
import { Redis } from 'ioredis';

export function createServer(redis: Redis) {
    const app = express();
    app.use(cors());
    app.use(express.json());

    return app;
}
