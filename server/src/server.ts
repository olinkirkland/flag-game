import cors from 'cors';
import express from 'express';

export function createServer() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    return app;
}
