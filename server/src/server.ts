import cors from 'cors';
import express from 'express';
import userRouter from './routes/user-router';
import gameRouter from './routes/game-router';

export function createServer() {
    const app = express();
    app.use(
        cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        })
    );
    app.use(express.json());

    app.use('/api/user', userRouter);
    app.use('/api/game', gameRouter);
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });

    return app;
}
