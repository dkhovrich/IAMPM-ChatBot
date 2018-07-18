import { Document, Schema, Model, model } from 'mongoose';

export interface IUserModel extends Document {
    email: string;
    password: string;
}

export const schema = new Schema({
    email: String,
    password: String
}, { timestamps: true });

export const User: Model<IUserModel> = model<IUserModel>('User', schema);