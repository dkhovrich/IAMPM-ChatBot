import { IGlossaryModel } from '../database/glossaryModel';

export interface IGlossaryDto {
    id: string;
    title: string;
}

export class GlossaryDto implements IGlossaryDto {
    id: string;
    title: string;

    public static create(model: IGlossaryModel): GlossaryDto {
        return {
            id: model.id,
            title: model.title
        };
    }
}