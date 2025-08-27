import { gameState } from '@/game';
import { Request, Response, Router } from 'express';
import StatusCode from 'status-code-enum';

const router = Router();

/**
 * Fetch the current game state.
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        console.log(gameState);
        res.status(StatusCode.SuccessOK).json(gameState);
    } catch (error) {
        console.error('Error fetching game state:', error);
        res.status(StatusCode.ServerErrorInternal).json({
            error: 'Failed to fetch game state'
        });
    }
});

export default router;
