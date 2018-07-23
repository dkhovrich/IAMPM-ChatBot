import { Request, Response, NextFunction } from 'express';

export default function () {
    return function (err: any, req: Request, res: Response, next: NextFunction) {
        if (res.headersSent) {
            return next(err);
        }

        console.error(err.message);
        console.error(err.stack);

        if (!err.statusCode) {
            err.statusCode = 500;
        }

        res.status(err.statusCode).send(err.message);
    };
}