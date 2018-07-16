import BaseError from '../baseError';

class GlossaryNotFoundError extends BaseError {
    constructor(id: string) {
        super(404, `Glossary with id ${id} not found`);
    }
}

export default GlossaryNotFoundError;