const BaseError = require('./BaseError');

class ValidationError extends BaseError {
    constructor() {
        super(500);
    }
}

module.exports = ValidationError;