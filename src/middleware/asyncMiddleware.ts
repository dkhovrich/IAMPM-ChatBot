import { Request, Response, NextFunction } from 'express';

export default function (fn: any) {
    return function (req: Request, res: Response, next: NextFunction, ...args: any[]) {
        const result = fn(req, res, next, ...args);
        return Promise.resolve(result).catch(next);
    };
}