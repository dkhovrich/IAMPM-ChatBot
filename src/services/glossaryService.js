const Glossary = require('../database/glossaryModel');
const ValidationError = require('../errors/validationError');
const BaseError = require('../errors/baseError');

class GlossaryNotFoundError extends BaseError {
    constructor(id) {
        super(404, `Glossary with id ${id} not found`);
    }
}

/**
 * @typedef {Object} GlossaryType
 * @property {string} title 
 */

class GlossaryService {
    /**
     * @returns {Promise<Array>} Array of glossary items
     */
    async getAll() {
        return await Glossary.find();
    }

    /**
     * @param {string} id
     * @returns {Promise} Glossary item
     */
    async getById(id) {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        const glossary = await Glossary.findById(id);
        if (!glossary) {
            throw new GlossaryNotFoundError(id);
        }

        return glossary;
    }

    /**
     * @param {GlossaryType} model
     */
    async create(model) {
        validate(model);
        await Glossary.create(model);
    }

    /**
     * @param {string} id
     * @param {GlossaryType} model
     */
    async update(id, model) {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        if (await !isExists(id)) {
            throw new GlossaryNotFoundError(id);
        }

        validate(model);
        await Glossary.updateOne({ _id: id }, model);
    }

    /**
     * @param {string} id
     */
    async delete(id) {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        if (await !isExists(id)) {
            throw new GlossaryNotFoundError(id);
        }

        await Glossary.deleteOne({ _id: id });
    }
}

/**
 * @param {GlossaryType} model
*/
function validate(model) {
    if (!model || typeof model !== 'object') {
        throw new ValidationError();
    }

    if (!model.title || typeof model.title !== 'string') {
        throw new ValidationError();
    }
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function isExists(id) {
    const glossary = await Glossary.findById(id);
    return !!glossary;
}

module.exports = new GlossaryService();