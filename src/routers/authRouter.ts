import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';

import jsonSchemaMiddleware from '../middleware/jsonSchemaMiddleware';
import UserService from '../services/userService';
import { IUserDto, loginDtoJsonSchema } from '../models/userDto';

const router: Router = express.Router();

router.post('/login', jsonSchemaMiddleware(loginDtoJsonSchema), async (req: Request, res: Response) => {
    try {
        const user: IUserDto = await UserService.login(req.body);
        const token = jwt.sign(user, process.env.JWT_KEY);
        res.json({ token });
    } catch (err) {
        console.error('Login error', err);
        res.sendStatus(401);
    }
});

export default router;