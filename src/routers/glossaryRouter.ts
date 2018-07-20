import express, { Request, Response, Router } from 'express';

import asyncMiddleware from '../middleware/asyncMiddleware';
import GlossaryService from '../services/glossaryService';

const router: Router = express.Router();

router.get('/', asyncMiddleware(async (req: Request, res: Response) => {
    const glossaries = await GlossaryService.getAll();
    res.send(glossaries);
}));

router.get('/:id', asyncMiddleware(async (req: Request, res: Response) => {
    const glossary = await GlossaryService.getById(req.params.id);
    res.send(glossary);
}));

router.post('/', asyncMiddleware(async (req: Request, res: Response) => {
    const glossary = await GlossaryService.create(req.body);
    res.send(glossary).status(201);
}));

router.put('/:id', asyncMiddleware(async (req: Request, res: Response) => {
    await GlossaryService.update(req.params.id, req.body);
    res.sendStatus(200);
}));

router.delete('/:id', asyncMiddleware(async (req: Request, res: Response) => {
    await GlossaryService.delete(req.params.id);
    res.sendStatus(200);
}));

export default router;