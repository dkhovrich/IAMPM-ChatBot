import BaseError from './baseError';

class ValidationError extends BaseError {
    constructor() {
        super(400);
    }
}

export default ValidationError;
