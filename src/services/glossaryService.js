const Glossary = require('../database/glossaryModel');
const ValidationError = require('../errors/ValidationError');
const BaseError = require('../errors/BaseError');

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
     * @method getAll
     * @description Get all glossary items
     * @returns {Promise<Array>} Array of glossary items
     */
    async getAll() {
        return await Glossary.find();
    }

    /**
     * @method getById
     * @description Get glossary item by id
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
     * @method create
     * @description Create glossary item
     * @param {GlossaryType} model
     */
    async create(model) {
        validate(model);
        await Glossary.create(model);
    }

    /**
     * @method update
     * @description Update glossary item
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
     * @method delete
     * @description Delete glossary item
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
     * @method validate
     * @description Validate glossary model
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
 * @method isExists
 * @description Check if glossary exists in database by id
 * @param {string} id
 * @returns {Promise<boolean>} True if glossary exists; otherwise false
 */
async function isExists(id) {
    const glossary = await Glossary.findById(id);
    return !!glossary;
}

module.exports = new GlossaryService();