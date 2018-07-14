const BaseError = require('./baseError');

class ValidationError extends BaseError {
    constructor() {
        super(500);
    }
}

module.exports = ValidationError;