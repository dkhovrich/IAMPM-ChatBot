import BaseError from './baseError';

class ConflictError extends BaseError {
    constructor() {
        super(409);
    }
}

export default ConflictError;