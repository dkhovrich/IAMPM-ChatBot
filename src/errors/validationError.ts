import BaseError from './baseError';

class ValidationError extends BaseError {
    constructor() {
        super(500);
    }
}

export default ValidationError;
