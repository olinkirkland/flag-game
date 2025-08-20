import { v4 as uuid } from 'uuid';
import { getUserById } from '@/database/users';
import { Request, Response, Router } from 'express';
import StatusCode from 'status-code-enum';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    // TODO: Get all users from the database
});

router.post('/', async (req: Request, res: Response) => {
    // Create a new user in the database
    const userId = uuid();
    try {
        const newUser = await getUserById(userId);
        res.status(StatusCode.SuccessCreated).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(StatusCode.ServerErrorInternal).json({
            error: 'Failed to create user'
        });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    // Fetch an existing user from the database or create a new one
    const userId = req.params.id;
    try {
        const user = await getUserById(userId);
        res.status(StatusCode.SuccessOK).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(StatusCode.ServerErrorInternal).json({
            error: 'Failed to fetch user'
        });
    }
});

export default router;
