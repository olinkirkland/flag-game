import sql from './db';

export async function getUserById(userId: string) {
    // Fetch an existing user from the database
    // If the user does not exist, throw an error
    const user = await sql`
        SELECT id, user_id, created_at FROM users WHERE user_id = ${userId};
    `;

    if (user.length === 0) throw new Error('User not found');
    return user[0];
}

export async function getAllUsers() {
    // Fetch all users
    const users = await sql`
        SELECT id, user_id, created_at FROM users ORDER BY created_at DESC;
    `;
    return users;
}
