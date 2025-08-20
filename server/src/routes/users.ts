import { createUser, getAllUsers, getUserById } from '@/database/users';
import { Request, Response, Router } from 'express';
import StatusCode from 'status-code-enum';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(StatusCode.SuccessOK).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(StatusCode.ServerErrorInternal).json({
            error: 'Failed to fetch users'
        });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const user = createUser();
        res.status(StatusCode.SuccessCreated).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(StatusCode.ServerErrorInternal).json({
            error: 'Failed to create user'
        });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
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
