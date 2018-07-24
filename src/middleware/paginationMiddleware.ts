import { Request, Response, NextFunction } from 'express';

const DEFAULT_PAGE_SIZE = 5;
const PAGE_NUMBER_PROPERTY = 'pageNumber';
const PAGE_SIZE_PROPERTY = 'pageSize';

export default function (pageSize: number = DEFAULT_PAGE_SIZE) {
    return function (req: Request, res: Response, next: NextFunction) {
        validateProperty(req.query, PAGE_NUMBER_PROPERTY, 1);
        validateProperty(req.query, PAGE_SIZE_PROPERTY, pageSize);
        next();
    };
}

function validateProperty(object: any, propertyName: string, defaultValue: number): void {
    if (!object.hasOwnProperty(propertyName)) {
        object[propertyName] = defaultValue;
        return;
    }

    object[propertyName] = Number(object[propertyName]);
    if (object[propertyName] === 0) {
        object[propertyName] = defaultValue;
    }
}