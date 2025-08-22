import { v4 as uuid } from 'uuid';
import sql from './db';

export async function createUser() {
    // Create a new user in the database
    const userId = uuid();
    const result = await sql`
        INSERT INTO users (user_id, created_at)
        VALUES (${userId}, NOW())
        RETURNING id, user_id, created_at;
    `;
    if (result.length === 0) throw new Error('Failed to create user');
    return result[0];
}

export async function getUserById(id: string) {
    // Fetch an existing user from the database
    // If the user does not exist, throw an error
    const user = await sql`
        SELECT id, user_id, created_at FROM users WHERE user_id = ${id};
    `;

    if (user.length === 0) throw new Error('User not found');
    return {
        id: user[0].user_id,
        name: user[0].user_id, // Assuming user_id is used as the name for simplicity
        createdAt: user[0].created_at
    };
}

export async function getAllUsers() {
    // Fetch all users
    const users = await sql`
        SELECT id, user_id, created_at FROM users ORDER BY created_at DESC;
    `;
    return users.map((user) => ({
        id: user.user_id,
        name: user.user_id, // Assuming user_id is used as the name for simplicity
        createdAt: user.created_at
    }));
}

export async function deleteAllUsers() {
    // Delete all users from the database
    await sql`DELETE FROM users;`;
}
