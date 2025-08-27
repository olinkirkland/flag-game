import { gameState, patch } from '@/game';
import { Request, Response, Router } from 'express';
import StatusCode from 'status-code-enum';

const router = Router();

/**
 * Fetch the current game state.
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        res.status(StatusCode.SuccessOK).json(gameState);
    } catch (error) {
        console.error('Error fetching game state:', error);
        res.status(StatusCode.ServerErrorInternal).json({
            error: 'Failed to fetch game state'
        });
    }
});

/**
 * Submit a guess.
 */
router.post('/guess', async (req: Request, res: Response) => {
    try {
        const { playerId, guess } = req.body;

        if (!playerId || !guess) {
            return res.status(StatusCode.ClientErrorBadRequest).json({
                error: 'playerId and guess are required'
            });
        }

        console.log(`Player ${playerId} guessed: ${guess}`);
        // TODO: Process the guess (e.g., check if correct, update scores, etc.)

        res.status(StatusCode.SuccessOK).json({ message: 'Guess received' });
    } catch (error) {
        console.error('Error submitting guess:', error);
        res.status(StatusCode.ServerErrorInternal).json({
            error: 'Failed to submit guess'
        });
    }
});

export default router;
