// tslint:disable-next-line
const passwordHash = require('password-hash');
import validator from 'validator';

import BaseService from './baseService';
import { IUserModel, User } from '../database/userModel';
import { UserDto } from '../models/userDto';
import ValidationError from '../errors/validationError';
import ConflictError from '../errors/conflictError';
import UserAlreadyExistsError from '../errors/userErrors/userAlreadyExistsError';
import UserNotFoundError from '../errors/userErrors/userNotFoundError';
import UserUnauthorizedError from '../errors/userErrors/userUnauthorizedError';
import { ICreateUserDto, ILoginDto } from '../models/userDto';

class UserService extends BaseService {
    async getAll(): Promise<UserDto[]> {
        return await this.handleConnection(async () => {
            const users: IUserModel[] = await User.find();
            return users.map(UserDto.create);
        });
    }

    async create(model: ICreateUserDto): Promise<void> {
        if (!validator.isEmail(model.email)) {
            throw new ValidationError();
        }

        return await this.handleConnection(async () => {
            if (await this.isExistsByEmail(model.email)) {
                throw new UserAlreadyExistsError(model.email);
            }

            model.password = passwordHash.generate(model.password);
            await User.create({ email: model.email, password: model.password });
        });
    }

    async update(id: string, model: ICreateUserDto): Promise<void> {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        return await this.handleConnection(async () => {
            if (await this.isUpdateEmailConflict(id, model.email)) {
                throw new ConflictError();
            }

            const user = await this.getUserById(id);
            user.email = model.email;

            if (model.password) {
                user.password = passwordHash.generate(model.password);
            }

            await User.updateOne({ _id: id }, user);
        });
    }

    async delete(id: string): Promise<void> {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        return await this.handleConnection(async () => {
            if (!await this.isExistsById(id)) {
                throw new UserNotFoundError(id);
            }

            await User.deleteOne({ _id: id });
        });
    }

    async login(model: ILoginDto): Promise<UserDto> {
        if (!validator.isEmail(model.email)) {
            throw new ValidationError();
        }

        return await this.handleConnection(async () => {
            const user: IUserModel = await this.getUserByEmail(model.email);
            if (!passwordHash.verify(model.password, user.password)) {
                throw new UserUnauthorizedError(model.email);
            }

            return UserDto.create(user);
        });
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