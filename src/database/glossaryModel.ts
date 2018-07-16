import { Document, Schema, Model, model } from 'mongoose';

export interface IGlossaryModel extends Document {
    title: string;
}

export const schema = new Schema({
    title: String
}, { timestamps: true });

export const Glossary: Model<IGlossaryModel> = model<IGlossaryModel>('Glossary', schema);