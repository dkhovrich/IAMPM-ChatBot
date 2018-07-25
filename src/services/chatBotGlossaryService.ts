import * as _ from 'lodash';

import BaseService from './baseService';
import ValidationError from '../errors/validationError';
import GlossaryNotFoundError from '../errors/glossaryErrors/glossaryNotFoundError';

import { IGlossaryModel, Glossary } from '../database/glossaryModel';
import { ChatBotGlossaryDto } from '../models/chatBotGlossaryDto';

class ChatBotGlossaryService extends BaseService {
    async getById(id: string): Promise<ChatBotGlossaryDto> {
        if (!_.isString(id)) {
            throw new ValidationError();
        }

        return await this.handleConnection(async () => {
            const glossary: IGlossaryModel = await Glossary.findById(id);
            if (!glossary) {
                throw new GlossaryNotFoundError(id);
            }

            return ChatBotGlossaryDto.create(glossary);
        });
    }

    async search(key: string): Promise<ChatBotGlossaryDto[]> {
        if (!_.isString(key) || key.length === 0) {
            throw new ValidationError();
        }

        return await this.handleConnection(async () => {
            const glossaries: IGlossaryModel[] = await Glossary.find({ $text: { $search: key } });
            if (glossaries.length === 0) {
                throw new GlossaryNotFoundError(key);
            }

            return glossaries.map(ChatBotGlossaryDto.create);
        });
    }
}

export default new ChatBotGlossaryService();