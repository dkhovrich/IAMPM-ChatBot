import { Schema } from 'jsonschema';
import { IGlossaryModel, IGlossaryTitleModel } from '../database/glossaryModel';

export interface IGlossaryTitleDto {
    rus: string;
    eng: string;
}

export interface IGlossaryDto {
    id: string;
    title: IGlossaryTitleDto;
    description: string;
}

export class GlossaryTitleDto implements IGlossaryTitleDto {
    constructor(public rus: string, public eng: string) { }

    static create(model: IGlossaryTitleModel): GlossaryTitleDto {
        return new GlossaryTitleDto(model.rus, model.eng);
    }
}

export class GlossaryDto implements IGlossaryDto {
    id: string;
    title: IGlossaryTitleDto;
    description: string;

    static create(model: IGlossaryModel): GlossaryDto {
        return {
            id: model.id,
            title: GlossaryTitleDto.create(model.title),
            description: model.description
        };
    }
}

export const glossaryDtoJsonSchema: Schema = {
    type: 'object',
    properties: {
        title: {
            type: 'object',
            properties: {
                rus: { type: ['string', 'null'] },
                eng: { type: ['string', 'null'] }
            },
            anyOf: [
                { required: ['rus'] },
                { required: ['eng'] }
            ]
        },
        description: { type: 'string' }
    },
    required: ['title', 'description']
};