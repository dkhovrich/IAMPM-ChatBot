import fs from 'fs';
import parse from 'csv-parse/lib/sync';

import { IGlossaryDto, GlossaryDto, GlossaryTitleDto } from '../models/glossaryDto';

class CsvData {
    constructor(public titleRus: string, public titleEng: string, public description: string) {
        this.prepare();
    }

    toGlossaryDto(): GlossaryDto {
        const model = new GlossaryDto();
        model.title = new GlossaryTitleDto(this.titleRus, this.titleEng);
        model.description = this.description;

        return model;
    }

    private prepare(): void {
        this.titleEng = this.titleEng.length === 0 ? null : this.titleEng;
        this.titleRus = this.titleRus.length === 0 ? null : this.titleRus;
    }
}

class GlossaryParser {
    private readonly path: string;

    constructor(path: string) {
        this.path = path;
    }

    execute(): IGlossaryDto[] {
        this.validate();

        const csv: string = fs.readFileSync(this.path).toString();
        const results: CsvData[] = parse(csv, { delimiter: ';', columns: true })
            .map((item: any) => new CsvData(item.titleRus, item.titleEng, item.description));

        return results.map(r => r.toGlossaryDto());
    }

    private validate(): void {
        if (!this.path || !fs.existsSync(this.path)) {
            throw new Error('File not found');
        }
    }
}

export default GlossaryParser;