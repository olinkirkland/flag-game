import cors from 'cors';
import express from 'express';
import userRouter from './routes/users';

export function createServer() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use('/api/user', userRouter);
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });

    return app;
}
