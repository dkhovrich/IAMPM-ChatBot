import BaseService from './baseService';
import { IGlossaryModel, Glossary } from '../database/glossaryModel';
import { IGlossaryDto, GlossaryDto } from '../models/glossaryDto';
import ValidationError from '../errors/validationError';
import GlossaryNotFoundError from '../errors/glossaryErrors/glossaryNotFoundError';

class GlossaryService extends BaseService {
    async getAll(): Promise<GlossaryDto[]> {
        return await this.handleConnection(async () => {
            const items: IGlossaryModel[] = await Glossary.find();
            return items.map(GlossaryDto.create);
        });
    }

    async getById(id: string): Promise<GlossaryDto> {
        return await this.handleConnection(async () => {
            if (!id || typeof id !== 'string') {
                throw new ValidationError();
            }

            const glossary: IGlossaryModel = await Glossary.findById(id);
            if (!glossary) {
                throw new GlossaryNotFoundError(id);
            }

            return GlossaryDto.create(glossary);
        });
    }

    async create(model: IGlossaryDto): Promise<void> {
        await this.handleConnection(async () => {
            this.validate(model);
            await Glossary.create(model);
        });
    }

    async createMany(models: IGlossaryDto[]): Promise<void> {
        await this.handleConnection(async () => {
            models.forEach(this.validate);

            for (const model of models) {
                await Glossary.create(model);
            }
        });
    }

    async update(id: string, model: IGlossaryDto): Promise<void> {
        return await this.handleConnection(async () => {
            if (!id || typeof id !== 'string') {
                throw new ValidationError();
            }

            if (await !this.isExists(id)) {
                throw new GlossaryNotFoundError(id);
            }

            this.validate(model);
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

    private validate(model: IGlossaryDto): void {
        if (!model || typeof model !== 'object') {
            throw new ValidationError();
        }

        if (!model.title || typeof model.title !== 'string') {
            throw new ValidationError();
        }
    }

    private async isExists(id: string): Promise<boolean> {
        const glossary = await Glossary.findById(id);
        return !!glossary;
    }
}

export default new GlossaryService();