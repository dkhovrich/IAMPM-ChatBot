import * as _ from 'lodash';
import { validate } from 'jsonschema';
import BaseService from './baseService';

import ValidationError from '../errors/validationError';
import GlossaryNotFoundError from '../errors/glossaryErrors/glossaryNotFoundError';

import { IGlossaryModel, Glossary } from '../database/glossaryModel';
import { IGlossaryDto, GlossaryDto } from '../models/glossaryDto';
import { IBaseRequest } from '../models/requestDto';
import { Response } from '../models/responseDto';

import { glossaryDtoJsonSchema } from '../models/glossaryDto';

class GlossaryService extends BaseService {
    async get(request: IBaseRequest): Promise<Response<GlossaryDto>> {
        return await this.handleConnection(async () => {
            const condition: any = this.getSearchConditions(request);
            return await this.findWithPagination(Glossary, condition, request.pageNumber, request.pageSize, GlossaryDto.create);
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

    private getSearchConditions(request: IBaseRequest): any {
        const conditions: any = {};

        if (request.searchCriteria) {
            conditions.$text = { $search: request.searchCriteria };
        }

        return conditions;
    }
}

export default new GlossaryService();