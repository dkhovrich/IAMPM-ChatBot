import { Document, Schema, Model, model } from 'mongoose';

export interface IGlossaryTitleModel {
    rus: string;
    eng: string;
}

export interface IGlossaryModel extends Document {
    title: IGlossaryTitleModel;
    description: string;
}

export const schema = new Schema({
    title: new Schema({
        rus: {
            type: String,
            trim: true
        },
        eng: {
            type: String,
            trim: true
        }
    }, { _id: false }),
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export const Glossary: Model<IGlossaryModel> = model<IGlossaryModel>('Glossary', schema);