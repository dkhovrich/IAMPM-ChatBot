import { validate, Schema, ValidationError } from 'jsonschema';
import { Request, Response, NextFunction } from 'express';

export enum RequestPartToValidate {
    body,
    query
}

export default function (schema: Schema, requestPartToValidate: RequestPartToValidate = RequestPartToValidate.body) {
    return function (req: Request, res: Response, next: NextFunction) {
        const instance: any = requestPartToValidate === RequestPartToValidate.body ? req.body : req.query;

        if (validate(instance, schema).valid) {
            next();
        } else {
            next(new ValidationError('JsonSchema validation failed!', instance, schema));
        }
    };
}