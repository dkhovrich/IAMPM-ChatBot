import BaseError from '../baseError';

class GlossaryNotFoundError extends BaseError {
    constructor(data: string) {
        super(404, `Glossary not found. Data: ${data}`);
    }
}

export default GlossaryNotFoundError;