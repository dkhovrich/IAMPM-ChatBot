import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';

import UserService from '../services/userService';
import config from '../config';

const router: Router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await UserService.login(email, password);
        const token = jwt.sign(user, config.jwtSecretKey);
        res.json({ token });
    } catch (err) {
        console.error('Login error', err);
        res.sendStatus(401);
    }
});

export default router;