const BaseError = require('./baseError');

class ConflictError extends BaseError {
    constructor() {
        super(409);
    }
}

module.exports = ConflictError;