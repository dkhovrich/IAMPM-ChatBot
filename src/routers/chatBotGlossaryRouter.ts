import express, { Request, Response, Router } from 'express';

import asyncMiddleware from '../middleware/asyncMiddleware';
import jsonSchemaMiddleware, { RequestPartToValidate } from '../middleware/jsonSchemaMiddleware';

import ChatBotGlossaryService from '../services/chatBotGlossaryService';
import { ChatBotGlossaryDto, glossarySearchSchema } from '../models/chatBotGlossaryDto';

const router: Router = express.Router();

router.get('/:id', asyncMiddleware(async (req: Request, res: Response) => {
    const glossary: ChatBotGlossaryDto = await ChatBotGlossaryService.getById(req.params.id);
    res.send(glossary);
}));

router.get('/', jsonSchemaMiddleware(glossarySearchSchema, RequestPartToValidate.query), asyncMiddleware(async (req: Request, res: Response) => {
    const glossaries: ChatBotGlossaryDto[] = await ChatBotGlossaryService.search(req.query.search);
    res.send(glossaries);
}));

export default router;