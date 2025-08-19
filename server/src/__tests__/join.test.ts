import express from 'express';
import request from 'supertest';
import joinRouter from '../routes/join';

describe('POST /join', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/join', joinRouter);
    });

    it('should return 200 and a success message for valid input', async () => {
        const response = await request(app)
            .post('/join')
            .send({ username: 'testuser' });
        expect(response.status).toBe(200);
        // Adjust this expectation based on your join route's response
        expect(response.body).toHaveProperty('success');
    });

    it('should return 400 for missing username', async () => {
        const response = await request(app).post('/join').send({});
        expect(response.status).toBe(400);
    });

    // Add more tests as needed for edge cases
});
