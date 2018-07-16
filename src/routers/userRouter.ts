import express, { Request, Response, Router } from 'express';

import asyncMiddleware from '../middleware/asyncMiddleware';
import UserService from '../services/userService';

const router: Router = express.Router();

router.get('/', asyncMiddleware(async (req: Request, res: Response) => {
    const users = await UserService.getAll();
    res.send(users);
}));

router.post('/', asyncMiddleware(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    await UserService.create(email, password);
    res.sendStatus(201);
}));

router.put('/:id', asyncMiddleware(async (req: Request, res: Response) => {
    await UserService.update(req.params.id, req.body);
    res.sendStatus(201);
}));

router.delete('/:id', asyncMiddleware(async (req: Request, res: Response) => {
    await UserService.delete(req.params.id);
    res.sendStatus(200);
}));

export default router;