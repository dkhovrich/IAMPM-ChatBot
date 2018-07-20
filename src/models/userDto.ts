import { Schema } from 'jsonschema';
import { IUserModel } from '../database/userModel';

export interface IUserDto {
    id: string;
    email: string;
}

export interface ICreateUserDto {
    email: string;
    password: string;
}

export interface ILoginDto {
    email: string;
    password: string;
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

export const loginDtoJsonSchema: Schema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string ' }
    },
    required: ['email', 'password']
};