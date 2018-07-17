import { Document, Schema, Model, model } from 'mongoose';

export interface IGlossaryModel extends Document {
    title: string;
    text: string;
}

export const schema = new Schema({
    title: {
        type: String,
        index: true,
        unique: true,
        trim: true
    },
    text: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export const Glossary: Model<IGlossaryModel> = model<IGlossaryModel>('Glossary', schema);