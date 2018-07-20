import { validate, Schema, ValidationError } from 'jsonschema';
import { Request, Response, NextFunction } from 'express';

export default function (schema: Schema) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (validate(req.body, schema).valid) {
            next();
        } else {
            next(new ValidationError('JsonSchema validation failed!', req.body, schema));
        }
    };
}