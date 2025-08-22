import { createServer } from '@/server';
import StatusCode from 'status-code-enum';
import request from 'supertest';

test('jest is working', () => {
    expect(1 + 1).toBe(2);
});

describe('Game API routes', () => {
    const app = createServer();

    it('GET /api/game should return the current game state', async () => {
        const res = await request(app).get('/api/game');
        expect(res.status).toBe(StatusCode.SuccessOK);
        expect(res.body).toHaveProperty('currentPhase');
        expect(res.body).toHaveProperty('artist');
        expect(res.body).toHaveProperty('currentCountry');
        expect(res.body).toHaveProperty('currentColors');
    });
});
