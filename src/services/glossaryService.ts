import { IGlossaryModel, Glossary } from '../database/glossaryModel';
import ValidationError from '../errors/validationError';
import GlossaryNotFoundError from '../errors/glossaryErrors/glossaryNotFoundError';

class GlossaryService {
    public async getAll(): Promise<IGlossaryModel[]> {
        return await Glossary.find();
    }

    public async getById(id: string): Promise<IGlossaryModel> {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        const glossary: IGlossaryModel = await Glossary.findById(id);
        if (!glossary) {
            throw new GlossaryNotFoundError(id);
        }

        return glossary;
    }

    public async create(model: IGlossaryModel): Promise<void> {
        validate(model);
        await Glossary.create(model);
    }

    public async update(id: string, model: IGlossaryModel): Promise<void> {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        if (await !isExists(id)) {
            throw new GlossaryNotFoundError(id);
        }

        validate(model);
        await Glossary.updateOne({ _id: id }, model);
    }

    public async delete(id: string): Promise<void> {
        if (!id || typeof id !== 'string') {
            throw new ValidationError();
        }

        if (await !isExists(id)) {
            throw new GlossaryNotFoundError(id);
        }

        await Glossary.deleteOne({ _id: id });
    }
}

function validate(model: IGlossaryModel): void {
    if (!model || typeof model !== 'object') {
        throw new ValidationError();
    }

    if (!model.title || typeof model.title !== 'string') {
        throw new ValidationError();
    }
}

async function isExists(id: string): Promise<boolean> {
    const glossary = await Glossary.findById(id);
    return !!glossary;
}

export default new GlossaryService();