import { IGlossaryModel, Glossary } from '../database/glossaryModel';
import { GlossaryDto } from '../models/glossaryDto';
import ValidationError from '../errors/validationError';
import GlossaryNotFoundError from '../errors/glossaryErrors/glossaryNotFoundError';

class GlossaryService {
    public async getAll(): Promise<GlossaryDto[]> {
        const items: IGlossaryModel[] = await Glossary.find();
        return items.map(GlossaryDto.create);
    }

    public async getById(id: string): Promise<GlossaryDto> {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        const glossary: IGlossaryModel = await Glossary.findById(id);
        if (!glossary) {
            throw new GlossaryNotFoundError(id);
        }

        return GlossaryDto.create(glossary);
    }

    public async create(model: IGlossaryModel): Promise<void> {
        this.validate(model);
        await Glossary.create(model);
    }

    public async update(id: string, model: IGlossaryModel): Promise<void> {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        if (await !this.isExists(id)) {
            throw new GlossaryNotFoundError(id);
        }

        this.validate(model);
        await Glossary.updateOne({ _id: id }, model);
    }

    public async delete(id: string): Promise<void> {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        if (await !this.isExists(id)) {
            throw new GlossaryNotFoundError(id);
        }

        await Glossary.deleteOne({ _id: id });
    }

    private validate(model: IGlossaryModel): void {
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