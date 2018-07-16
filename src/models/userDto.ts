import { IUserModel } from '../database/userModel';

export interface IUserDto {
    id: string;
    email: string;
}

export class UserDto implements IUserDto {
    public id: string;
    public email: string;

    public static create(model: IUserModel): UserDto {
        return {
            id: model.id,
            email: model.email
        };
    }
}