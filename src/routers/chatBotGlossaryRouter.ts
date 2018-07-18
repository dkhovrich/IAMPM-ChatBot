import express, { Request, Response, Router } from 'express';

import asyncMiddleware from '../middleware/asyncMiddleware';
import GlossaryService from '../services/glossaryService';

const router: Router = express.Router();

router.get('/:key', asyncMiddleware(async (req: Request, res: Response) => {
    const glossary = await GlossaryService.find(req.params.key);
    res.send(glossary);
}));

export default router;