// tslint:disable-next-line
const passwordHash = require('password-hash');
import validator from 'validator';

import { IUserModel, User } from '../database/userModel';
import ValidationError from '../errors/validationError';
import ConflictError from '../errors/conflictError';
import UserAlreadyExistsError from '../errors/userErrors/userAlreadyExistsError';
import UserNotFoundError from '../errors/userErrors/userNotFoundError';
import UserUnauthorizedError from '../errors/userErrors/userUnauthorizedError';

class UserService {
    public async getAll(): Promise<IUserModel[]> {
        return await User.find();
    }

    public async create(email: string, password: string): Promise<void> {
        validate(email, password);

        if (await isExistsByEmail(email)) {
            throw new UserAlreadyExistsError(email);
        }

        password = passwordHash.generate(password);
        await User.create({ email, password });
    }

    public async update(id: string, model: IUserModel): Promise<void> {
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

    public async delete(id: string): Promise<void> {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        if (!await isExistsById(id)) {
            throw new UserNotFoundError(id);
        }

        await User.deleteOne({ _id: id });
    }

    public async login(email: string, password: string): Promise<any> {
        validate(email, password);

        const user = await getUserByEmail(email);
        if (!passwordHash.verify(password, user.password)) {
            throw new UserUnauthorizedError(email);
        }

        return { id: user.id, email: user.email };
    }
}

function validate(email: string, password: string): void {
    if (!email || typeof email !== 'string' || !validator.isEmail(email)) {
        throw new ValidationError();
    }

    if (!password || typeof password !== 'string') {
        throw new ValidationError();
    }
}

function validateUserModel(model: IUserModel): void {
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

async function getUserByEmail(email: string): Promise<any> {
    const user = User.findOne({ email });
    if (!user) {
        throw new UserNotFoundError(email);
    }

    return user;
}

async function getUserById(id: string): Promise<any> {
    const user: any = await User.findById(id);
    if (!user) {
        throw new UserNotFoundError(id);
    }

    return user;
}

async function isExistsByEmail(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return !!user;
}

async function isExistsById(id: string): Promise<boolean> {
    const user = await User.findById(id);
    return !!user;
}

async function isUpdateEmailConflict(id: string, email: string): Promise<boolean> {
    const users = await User.find({ _id: { $ne: id }, email });
    return users.length !== 0;
}

export default new UserService();