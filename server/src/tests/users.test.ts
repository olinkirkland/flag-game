import request from 'supertest';
import { createServer } from '@/server';
import { createUser, getUserById, getAllUsers } from '@/database/users';
import StatusCode from 'status-code-enum';

test('jest is working', () => {
    expect(1 + 1).toBe(2);
});

describe.skip('User database functions', () => {
    it('should create a user and return user object', async () => {
        const user = await createUser();
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('user_id');
        expect(user).toHaveProperty('created_at');
    });

    it('should get a user by user_id', async () => {
        const created = await createUser();
        const fetched = await getUserById(created.user_id);
        expect(fetched).toMatchObject({
            id: created.id,
            user_id: created.user_id
        });
    });

    it('should throw error for non-existent user', async () => {
        await expect(getUserById('non-existent-id')).rejects.toThrow(
            'User not found'
        );
    });

    it('should get all users (array)', async () => {
        const users = await getAllUsers();
        expect(Array.isArray(users)).toBe(true);
    });
});

describe.skip('User API routes', () => {
    const app = createServer();

    it('POST /api/user should create a user', async () => {
        const res = await request(app).post('/api/user');
        expect(res.status).toBe(StatusCode.SuccessCreated);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('user_id');
        expect(res.body).toHaveProperty('created_at');
    });

    it('GET /api/user should return an array of users', async () => {
        const res = await request(app).get('/api/user');
        expect(res.status).toBe(StatusCode.SuccessOK);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/user/:id should return a user if exists', async () => {
        const createRes = await request(app).post('/api/user');
        const userId = createRes.body.user_id;
        const res = await request(app).get(`/api/user/${userId}`);
        expect(res.status).toBe(StatusCode.SuccessOK);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('user_id', userId);
    });

    it('GET /api/user/:id should return 500 for non-existent user', async () => {
        const res = await request(app).get('/api/user/non-existent-id');
        expect(res.status).toBe(StatusCode.ServerErrorInternal);
        expect(res.body).toHaveProperty('error');
    });
});
