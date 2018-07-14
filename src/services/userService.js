const passwordHash = require('password-hash');
const validator = require('validator');

const User = require('../database/userModel');
const ValidationError = require('../errors/validationError');
const BaseError = require('../errors/baseError');
const ConflictError = require('../errors/conflictError');

class UserAlreadyExistsError extends BaseError {
    constructor(email) {
        super(409, `User with email ${email} already exists`);
    }
}

class UserNotFoundError extends BaseError {
    constructor(data) {
        super(404, `User with id or email ${data} not found`);
    }
}

class UserUnauthorizedError extends BaseError {
    constructor(email) {
        super(401, `User with email ${email} is not authorized`);
    }
}

/**
 * @typedef {Object} UserType
 * @property {string} email
 * @property {string} password
 */

class UserService {
    async getAll() {
        const users = await User.find();
        return users.map(user => ({ id: user.id, email: user.email }));
    }

    /**
     * @param {string} email
     * @param {string} password
     */
    async create(email, password) {
        validate(email, password);

        if (await isExistsByEmail(email)) {
            throw new UserAlreadyExistsError(email);
        }

        password = passwordHash.generate(password);
        await User.create({ email, password });
    }

    /**
     * @param {string} id
     * @param {UserType} model
     */
    async update(id, model) {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        validateUserModel(model);
        if (await isUpdateEmailConflict(id, model.email)) {
            throw new ConflictError();
        }

        const user = await getUserById(id);
        user.email = model.email;

        if (model.password) {
            user.password = passwordHash.generate(model.password);
        }

        await User.updateOne({ _id: id }, user);
    }

    /**
     * @param {string} id
     */
    async delete(id) {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        if (!await isExistsById(id)) {
            throw new UserNotFoundError(id);
        }

        await User.deleteOne({ _id: id });
    }

    /**
     * @param {string} email
     * @param {string} password
     * @returns {Object} user object
     */
    async login(email, password) {
        validate(email, password);

        const user = await getUserByEmail(email);
        if (!passwordHash.verify(password, user.password)) {
            throw new UserUnauthorizedError(email);
        }

        return { id: user.id, email: user.email };
    }
}

/**
 * @param {string} email
 * @param {string} password
 */
function validate(email, password) {
    if (!email || typeof email !== 'string' || !validator.isEmail(email)) {
        throw new ValidationError();
    }

    if (!password || typeof password !== 'string') {
        throw new ValidationError();
    }
}

/**
 * @param {UserType} model
 */
function validateUserModel(model) {
    if (!model || typeof model !== 'object') {
        throw new ValidationError();
    }

    if (!model.email || typeof model.email !== 'string' || !validator.isEmail(model.email)) {
        throw new ValidationError();
    }

    if (typeof model.password === 'string' && !model.password) {
        throw new ValidationError();
    }
}

/**
* @param {string} email
* @returns {Object} user object
*/
async function getUserByEmail(email) {
    const user = User.findOne({ email });
    if (!user) {
        throw new UserNotFoundError(email);
    }

    return user;
}

/**
 * @param {string} id
 * @returns {UserType} user model
 */
async function getUserById(id) {
    const user = User.findById(id);
    if (!user) {
        throw new UserNotFoundError(id);
    }

    return user;
}

/**
 * @param {string} email
 * @returns {Promise<boolean>}
 */
async function isExistsByEmail(email) {
    const user = await User.findOne({ email });
    return !!user;
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function isExistsById(id) {
    const user = await User.findById(id);
    return !!user;
}

/**
 * @param {string} id
 * @param {string} email
 * @returns {Promise<boolean>}
 */
async function isUpdateEmailConflict(id, email) {
    const users = await User.find({ _id: { $ne: id }, email });
    return users.length !== 0;
}

module.exports = new UserService();