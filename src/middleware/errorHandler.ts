import { Request, Response, NextFunction } from 'express';
import BaseError from '../errors/baseError';

export default function () {
    return function (err: Error, req: Request, res: Response, next: NextFunction) {
        if (res.headersSent) {
            return next(err);
        }

        console.error(err.message);
        console.error(err.stack);

        const statusCode = err instanceof BaseError ? err.statusCode : 500;
        res.status(statusCode).send(err.message);
    };
}