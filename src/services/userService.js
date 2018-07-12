const passwordHash = require('password-hash');

const User = require('../database/userModel');
const ValidationError = require('../errors/ValidationError');
const BaseError = require('../errors/BaseError');

class UserAlreadyExistsError extends BaseError {
    constructor(email) {
        super(409, `User with email ${email} already exists`);
    }
}

class UserService {
    /**
     * @method create
     * @description Create user in database
     * @param {string} email
     * @param {string} password
     */
    async create(email, password) {
        if (!email || typeof email !== 'string') {
            throw new ValidationError();
        }

        if (!password || typeof password !== 'string') {
            throw new ValidationError();
        }

        if (await isExists(email)) {
            throw new UserAlreadyExistsError(email);
        }

        password = passwordHash.generate(password);
        await User.create({ email, password });
    }
}

/**
 * @method isExists
 * @description Check if user exists in database by email
 * @param {string} email
 * @returns {Promise<boolean>} True if user exists; otherwise false
 */
async function isExists(email) {
    const user = await User.findOne({ email });
    return !!user;
}

module.exports = new UserService();