const passwordHash = require('password-hash');

const User = require('../database/userModel');
const ValidationError = require('../errors/ValidationError');
const BaseError = require('../errors/BaseError');

class UserAlreadyExistsError extends BaseError {
    constructor(email) {
        super(409, `User with email ${email} already exists`);
    }
}

class UserNotFoundError extends BaseError {
    constructor(email) {
        super(404, `User with email ${email} not found`);
    }
}

class UserUnauthorizedError extends BaseError {
    constructor(email) {
        super(401, `User with email ${email} is not authorized`);
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
        validate(email, password);

        if (await isExists(email)) {
            throw new UserAlreadyExistsError(email);
        }

        password = passwordHash.generate(password);
        await User.create({ email, password });
    }

    /**
     * @method login
     * @description Login by email and password
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

        return {
            id: user.id,
            email: user.email
        };
    }
}

/**
 * @param {string} email
 * @param {string} password
 */
function validate(email, password) {
    if (!email || typeof email !== 'string') {
        throw new ValidationError();
    }

    if (!password || typeof password !== 'string') {
        throw new ValidationError();
    }
}

/**
* @method getUserByEmail
* @description Get user by email
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