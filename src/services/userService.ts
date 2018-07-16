// tslint:disable-next-line
const passwordHash = require('password-hash');
import validator from 'validator';

import { IUserModel, User } from '../database/userModel';
import { UserDto } from '../models/userDto';
import ValidationError from '../errors/validationError';
import ConflictError from '../errors/conflictError';
import UserAlreadyExistsError from '../errors/userErrors/userAlreadyExistsError';
import UserNotFoundError from '../errors/userErrors/userNotFoundError';
import UserUnauthorizedError from '../errors/userErrors/userUnauthorizedError';

class UserService {
    public async getAll(): Promise<UserDto[]> {
        const users: IUserModel[] = await User.find();
        return users.map(UserDto.create);
    }

    public async create(email: string, password: string): Promise<void> {
        this.validate(email, password);

        if (await this.isExistsByEmail(email)) {
            throw new UserAlreadyExistsError(email);
        }

        password = passwordHash.generate(password);
        await User.create({ email, password });
    }

    public async update(id: string, model: IUserModel): Promise<void> {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        this.validateUserModel(model);
        if (await this.isUpdateEmailConflict(id, model.email)) {
            throw new ConflictError();
        }

        const user = await this.getUserById(id);
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

        if (!await this.isExistsById(id)) {
            throw new UserNotFoundError(id);
        }

        await User.deleteOne({ _id: id });
    }

    public async login(email: string, password: string): Promise<UserDto> {
        this.validate(email, password);

        const user: IUserModel = await this.getUserByEmail(email);
        if (!passwordHash.verify(password, user.password)) {
            throw new UserUnauthorizedError(email);
        }

        return UserDto.create(user);
    }

    private validate(email: string, password: string): void {
        if (!email || typeof email !== 'string' || !validator.isEmail(email)) {
            throw new ValidationError();
        }

        if (!password || typeof password !== 'string') {
            throw new ValidationError();
        }
    }

    private validateUserModel(model: IUserModel): void {
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

    private async getUserByEmail(email: string): Promise<IUserModel> {
        const user = User.findOne({ email });
        if (!user) {
            throw new UserNotFoundError(email);
        }

        return user;
    }

    private async getUserById(id: string): Promise<IUserModel> {
        const user = await User.findById(id);
        if (!user) {
            throw new UserNotFoundError(id);
        }

        return user;
    }

    private async isExistsByEmail(email: string): Promise<boolean> {
        const user = await User.findOne({ email });
        return !!user;
    }

    private async isExistsById(id: string): Promise<boolean> {
        const user = await User.findById(id);
        return !!user;
    }

    private async isUpdateEmailConflict(id: string, email: string): Promise<boolean> {
        const users = await User.find({ _id: { $ne: id }, email });
        return users.length !== 0;
    }
}

export default new UserService();