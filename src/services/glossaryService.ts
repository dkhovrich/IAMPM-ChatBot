import * as _ from 'lodash';
import { validate } from 'jsonschema';
import BaseService from './baseService';
import { IGlossaryModel, Glossary } from '../database/glossaryModel';
import { IGlossaryDto, GlossaryDto } from '../models/glossaryDto';
import ValidationError from '../errors/validationError';
import GlossaryNotFoundError from '../errors/glossaryErrors/glossaryNotFoundError';
import { glossaryDtoJsonSchema } from '../models/glossaryDto';

class GlossaryService extends BaseService {
    async getAll(): Promise<GlossaryDto[]> {
        return await this.handleConnection(async () => {
            const items: IGlossaryModel[] = await Glossary.find();
            return items.map(GlossaryDto.create);
        });
    }

    async getById(id: string): Promise<GlossaryDto> {
        if (!_.isString(id)) {
            throw new ValidationError();
        }

        return await this.handleConnection(async () => {
            const glossary: IGlossaryModel = await Glossary.findById(id);
            if (!glossary) {
                throw new GlossaryNotFoundError(id);
            }

            return GlossaryDto.create(glossary);
        });
    }

    async find(key: string): Promise<GlossaryDto> {
        if (!_.isString(key) || key.length === 0) {
            throw new ValidationError();
        }

        return await this.handleConnection(async () => {
            const glossaries: IGlossaryModel[] = await Glossary.find({ $text: { $search: key } });
            if (glossaries.length === 0) {
                throw new GlossaryNotFoundError(key);
            } else if (glossaries.length === 1) {
                return GlossaryDto.create(glossaries[0]);
            } else {
                return glossaries.map(GlossaryDto.create);
            }
        });
    }

    async create(model: IGlossaryDto): Promise<void> {
        return await this.handleConnection(async () => {
            const glossary: IGlossaryModel = await Glossary.create(model);
            return GlossaryDto.create(glossary);
        });
    }

    async createMany(models: IGlossaryDto[]): Promise<void> {
        if (!models.every(model => validate(model, glossaryDtoJsonSchema).valid)) {
            throw new ValidationError();
        }

        await this.handleConnection(async () => await Glossary.insertMany(models));
    }

    async update(id: string, model: IGlossaryDto): Promise<void> {
        if (!_.isString(id)) {
            throw new ValidationError();
        }

        return await this.handleConnection(async () => {
            if (await !this.isExists(id)) {
                throw new GlossaryNotFoundError(id);
            }

            await Glossary.updateOne({ _id: id }, model);
        });
    }

    async delete(id: string): Promise<void> {
        return await this.handleConnection(async () => {
            if (!id || typeof id !== 'string') {
                throw new ValidationError();
            }

            if (await !this.isExists(id)) {
                throw new GlossaryNotFoundError(id);
            }

            await Glossary.deleteOne({ _id: id });
        });
    }

    private async isExists(id: string): Promise<boolean> {
        const glossary = await Glossary.findById(id);
        return !!glossary;
    }
}

export default new GlossaryService();