import { Schema } from 'jsonschema';
import { IGlossaryModel } from '../database/glossaryModel';

export interface IGlossaryDto {
    id: string;
    title: string;
    text: string;
}

export class GlossaryDto implements IGlossaryDto {
    id: string;
    title: string;
    text: string;

    static create(model: IGlossaryModel): GlossaryDto {
        return {
            id: model.id,
            title: model.title,
            text: model.text
        };
    }
}

export const glossaryDtoJsonSchema: Schema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        text: { type: 'string' }
    },
    required: ['title', 'text']
};