import { Schema } from 'jsonschema';
import { IGlossaryModel } from '../database/glossaryModel';

export interface IChatBotGlossaryDto {
    id: string;
    title: string;
    description: string;
}

export class ChatBotGlossaryDto implements IChatBotGlossaryDto {
    id: string;
    title: string;
    description: string;

    static create(model: IGlossaryModel): ChatBotGlossaryDto {
        const dto = new ChatBotGlossaryDto();
        dto.id = model.id;
        dto.title = model.title.eng ? model.title.eng : model.title.rus;
        dto.description = model.description;

        return dto;
    }
}

export const glossarySearchSchema: Schema = {
    type: 'object',
    properties: {
        search: { type: 'string' }
    },
    required: ['search']
};