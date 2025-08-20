import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from '../server';
import StatusCode from 'status-code-enum';

describe('User creation', () => {
    it('should create and return a user with a new id via the API', async () => {
        const app = createServer();
        // Mount the user router as in index.ts
        const userRouter = require('../routes/users').default;
        app.use('/api/user', userRouter);

        const newUserId = uuidv4();
        const res = await request(app)
            .post(`/api/user/get-or-make/${newUserId}`)
            .send();

        expect(res.status).toBe(StatusCode.SuccessOK);
        expect(res.body).toBeDefined();
        expect(res.body.id).toBeDefined();
        expect(res.body.created_at).toBeDefined();
    });
});
