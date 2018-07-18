import { IUserModel } from '../database/userModel';

export interface IUserDto {
    id: string;
    email: string;
}

export class UserDto implements IUserDto {
    id: string;
    email: string;

    static create(model: IUserModel): UserDto {
        return {
            id: model.id,
            email: model.email
        };
    }
}